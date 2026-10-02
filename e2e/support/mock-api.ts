import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import type { Page, Route } from "@playwright/test";

/**
 * API falsa para os E2E: intercepta todas as chamadas a /api/v1 com page.route e responde
 * com fixtures JSON coerentes com o contrato (página {content, page}, erro {message, httpStatus,
 * statusCode}, datas ISO em UTC com Z). O estado vive em memória durante o teste, então criar,
 * editar, seguir, denunciar e marcar como lida refletem nas chamadas seguintes.
 */

const dir = path.dirname(fileURLToPath(import.meta.url));
const fixture = <T>(name: string): T => JSON.parse(readFileSync(path.join(dir, "..", "fixtures", name), "utf8"));
export const PHOTO = readFileSync(path.join(dir, "..", "fixtures", "foto.jpg"));

type Json = Record<string, any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export interface MockState {
  loggedIn: boolean;
  user: Json;
  categories: Json[];
  products: Json[];
  reviews: Json[];
  notifications: Json[];
  profiles: Record<string, Json>;
  following: Set<number>;
  preferences: { emailNotifications: boolean };
  reports: { reviewId: number; reason: string; details?: string }[];
  calls: { method: string; path: string; body?: unknown }[];
  nextId: number;
}

export const createState = (options: { loggedIn?: boolean } = {}): MockState => ({
  loggedIn: options.loggedIn ?? false,
  user: fixture("user.json"),
  categories: fixture("categories.json"),
  products: fixture("products.json"),
  reviews: fixture("reviews.json"),
  notifications: fixture("notifications.json"),
  profiles: fixture("profiles.json"),
  following: new Set<number>(),
  preferences: { emailNotifications: true },
  reports: [],
  calls: [],
  nextId: 100,
});

const page = <T>(items: T[], pageNumber: number, size: number) => ({
  content: items.slice(pageNumber * size, pageNumber * size + size),
  page: { size, number: pageNumber, totalElements: items.length, totalPages: Math.ceil(items.length / size) },
});

const error = (route: Route, status: number, message: string, httpStatus: string) =>
  route.fulfill({ status, contentType: "application/json", json: { message, httpStatus, statusCode: status } });

const fold = (text: string) => text.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();

const summary = (p: Json) => {
  const { images: _images, followersCount: _f, followedByMe: _b, ...rest } = p; // eslint-disable-line @typescript-eslint/no-unused-vars
  return rest;
};

const productStats = (state: MockState, productId: number) => {
  const visible = state.reviews.filter((r) => r.productId === productId && r.status === "VISIBLE");
  const total = visible.length;
  const avg = total ? Math.round((visible.reduce((s, r) => s + r.note, 0) / total) * 10) / 10 : null;
  return { visible, total, avg };
};

const withStats = (state: MockState, p: Json) => {
  const { total, avg } = productStats(state, p.id);
  return {
    ...p,
    totalReviews: total,
    averageNote: avg,
    followedByMe: state.loggedIn && state.following.has(p.id),
    followersCount: (p.followersCount ?? 0) + (state.following.has(p.id) ? 1 : 0),
  };
};

const reviewView = (state: MockState, r: Json) => ({
  ...r,
  helpfulByMe: state.loggedIn ? r.helpfulByMe : false,
  reportedByMe: state.loggedIn ? r.reportedByMe : false,
});

export const mockApi = async (pageObj: Page, state: MockState) => {
  // Fotos externas (Open Food Facts) e arquivos da API: imagem local, sem rede
  await pageObj.route("https://images.openfoodfacts.org/**", (route) =>
    route.fulfill({ status: 200, contentType: "image/jpeg", body: PHOTO }),
  );

  await pageObj.route(/\/api\/v1\//, async (route) => {
    const request = route.request();
    const url = new URL(request.url());
    const method = request.method();
    const p = url.pathname.replace(/^.*\/api\/v1/, "");
    const q = url.searchParams;
    const pageNumber = Number(q.get("page") ?? 0);
    const size = Number(q.get("size") ?? 10);
    let body: Json | undefined;
    try {
      body = request.postDataJSON() ?? undefined;
    } catch {
      body = undefined;
    }
    state.calls.push({ method, path: p, body });
    const requireLogin = () => {
      if (!state.loggedIn) {
        error(route, 401, "Não autenticado", "UNAUTHORIZED");
        return false;
      }
      return true;
    };
    let m: RegExpMatchArray | null;

    // ---------- arquivos ----------
    if (p.startsWith("/files/")) return route.fulfill({ status: 200, contentType: "image/jpeg", body: PHOTO });

    // ---------- auth / usuário ----------
    if (p === "/user/me" && method === "GET")
      return state.loggedIn ? route.fulfill({ json: state.user }) : error(route, 401, "Não autenticado", "UNAUTHORIZED");
    if (p === "/auth/sign-in" && method === "POST") {
      if (body?.password !== "Usuario@123") return error(route, 401, "Credenciais inválidas", "UNAUTHORIZED");
      state.loggedIn = true;
      return route.fulfill({ status: 200, body: "" });
    }
    if (p === "/auth/logout") {
      state.loggedIn = false;
      return route.fulfill({ status: 200, body: "" });
    }
    if (p === "/user/me/preferences") {
      if (!requireLogin()) return;
      if (method === "PATCH") state.preferences = { emailNotifications: !!body?.emailNotifications };
      return route.fulfill({ json: state.preferences });
    }
    if (p === "/user/me/following" && method === "GET") {
      if (!requireLogin()) return;
      const items = state.products
        .filter((x) => state.following.has(x.id))
        .map((x) => summary(withStats(state, x)))
        .sort((a, b) => a.name.localeCompare(b.name));
      return route.fulfill({ json: page(items, pageNumber, size) });
    }

    // ---------- perfil público ----------
    if ((m = p.match(/^\/users\/([^/]+)$/)) && method === "GET") {
      const profile = state.profiles[decodeURIComponent(m[1])];
      return profile ? route.fulfill({ json: profile }) : error(route, 404, "Usuário não encontrado", "NOT_FOUND");
    }
    if ((m = p.match(/^\/users\/([^/]+)\/reviews$/)) && method === "GET") {
      const items = state.reviews.filter((r) => r.userUsername === decodeURIComponent(m![1]) && r.status === "VISIBLE");
      return route.fulfill({ json: page(items.map((r) => reviewView(state, r)), pageNumber, size) });
    }

    // ---------- categorias ----------
    if (p === "/category/list") return route.fulfill({ json: state.categories });
    if ((m = p.match(/^\/category\/slug\/(.+)$/))) {
      const c = state.categories.find((x) => x.slug === m![1]);
      return c ? route.fulfill({ json: c }) : error(route, 404, "Categoria não encontrada", "NOT_FOUND");
    }

    // ---------- produtos ----------
    if (p === "/production/suggest") {
      const term = fold(q.get("q") ?? "");
      if (term.length < 2) return error(route, 400, "q: informe pelo menos 2 caracteres", "BAD_REQUEST");
      const items = state.products
        .filter((x) => fold(x.name).includes(term))
        .sort((a, b) => Number(!fold(a.name).startsWith(term)) - Number(!fold(b.name).startsWith(term)))
        .slice(0, Number(q.get("limit") ?? 8))
        .map((x) => ({ id: x.id, name: x.name, slug: x.slug, imageUrl: x.imageUrl, categoryName: x.categoryName }));
      return route.fulfill({ json: items });
    }
    if (p === "/production/list") {
      let items = state.products.map((x) => summary(withStats(state, x)));
      const search = q.get("search");
      if (search) items = items.filter((x) => fold(x.name).includes(fold(search)));
      if (q.get("categoryId")) items = items.filter((x) => x.categoryId === Number(q.get("categoryId")));
      if (q.get("subCategorieId")) items = items.filter((x) => x.subCategorieId === Number(q.get("subCategorieId")));
      if (q.get("onlyRated") === "true") items = items.filter((x) => x.totalReviews > 0);
      if (q.get("property") === "averageNote") items.sort((a, b) => (b.averageNote ?? 0) - (a.averageNote ?? 0));
      if (q.get("property") === "totalReviews") items.sort((a, b) => b.totalReviews - a.totalReviews);
      return route.fulfill({ json: page(items, pageNumber, size) });
    }
    if ((m = p.match(/^\/production\/slug\/(.+)$/))) {
      const prod = state.products.find((x) => x.slug === decodeURIComponent(m![1]));
      return prod ? route.fulfill({ json: withStats(state, prod) }) : error(route, 404, "Produto não encontrado", "NOT_FOUND");
    }
    if ((m = p.match(/^\/production\/(\d+)\/follow$/))) {
      if (!requireLogin()) return;
      const id = Number(m[1]);
      if (method === "POST") state.following.add(id);
      else state.following.delete(id);
      const prod = withStats(state, state.products.find((x) => x.id === id)!);
      return route.fulfill({ json: { following: prod.followedByMe, followersCount: prod.followersCount } });
    }

    // ---------- SEO ----------
    if ((m = p.match(/^\/seo\/products\/(.+)$/))) {
      const prod = state.products.find((x) => x.slug === m![1]);
      if (!prod) return error(route, 404, "Produto não encontrado", "NOT_FOUND");
      const { visible, total, avg } = productStats(state, prod.id);
      return route.fulfill({
        json: {
          name: prod.name,
          description: prod.description,
          image: prod.imageUrl,
          url: `http://localhost:5174/products/${prod.slug}`,
          aggregateRating: total ? { ratingValue: avg, reviewCount: total } : null,
          reviews: visible.slice(0, 5).map((r) => ({
            author: r.userName,
            datePublished: r.createdAt,
            reviewBody: r.description,
            name: r.title,
            ratingValue: r.note,
          })),
        },
      });
    }

    // ---------- avaliações ----------
    if (p === "/review/list") {
      const items = state.reviews.filter((r) => r.status === "VISIBLE").map((r) => reviewView(state, r));
      return route.fulfill({ json: page(items, pageNumber, size) });
    }
    if (p === "/review/me") {
      if (!requireLogin()) return;
      const items = state.reviews.filter((r) => r.userId === state.user.id).map((r) => reviewView(state, r));
      return route.fulfill({ json: page(items, pageNumber, size) });
    }
    if ((m = p.match(/^\/review\/product\/(\d+)\/summary$/))) {
      const { visible, total, avg } = productStats(state, Number(m[1]));
      const distribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 } as Record<string, number>;
      visible.forEach((r) => distribution[String(r.note)]++);
      return route.fulfill({ json: { productId: Number(m[1]), totalReviews: total, averageNote: avg ?? 0, distribution } });
    }
    if ((m = p.match(/^\/review\/product\/(\d+)$/))) {
      let items = productStats(state, Number(m[1])).visible;
      if (q.get("note")) items = items.filter((r) => r.note === Number(q.get("note")));
      return route.fulfill({ json: page(items.map((r) => reviewView(state, r)), pageNumber, size) });
    }
    if (p === "/review/" && method === "POST") {
      if (!requireLogin()) return;
      const prod = state.products.find((x) => x.id === body?.productId)!;
      const review = {
        id: state.nextId++,
        title: body?.title,
        description: body?.description,
        note: body?.note,
        productId: prod.id,
        userId: state.user.id,
        createdAt: new Date().toISOString().replace(/\.\d+Z$/, "Z"),
        productName: prod.name,
        productSlug: prod.slug,
        userName: state.user.name,
        userUsername: state.user.username,
        helpfulCount: 0,
        helpfulByMe: false,
        status: "VISIBLE",
        moderationReason: null,
        moderatedAt: null,
        images: [],
        reportedByMe: false,
        reportsCount: 0,
        reply: null,
      };
      state.reviews.unshift(review);
      return route.fulfill({ status: 201, json: review });
    }
    if ((m = p.match(/^\/review\/(\d+)\/images$/)) && method === "POST") {
      if (!requireLogin()) return;
      const review = state.reviews.find((r) => r.id === Number(m![1]))!;
      if (review.images.length >= 3) return error(route, 400, "Limite de 3 fotos por avaliação", "BAD_REQUEST");
      const image = { id: state.nextId++, url: `/api/v1/files/reviews/${review.id}/${state.nextId}.jpg` };
      review.images.push(image);
      return route.fulfill({ status: 201, json: image });
    }
    if ((m = p.match(/^\/review\/(\d+)\/images\/(\d+)$/)) && method === "DELETE") {
      const review = state.reviews.find((r) => r.id === Number(m![1]))!;
      review.images = review.images.filter((i: Json) => i.id !== Number(m![2]));
      return route.fulfill({ status: 204, body: "" });
    }
    if ((m = p.match(/^\/review\/(\d+)\/report$/)) && method === "POST") {
      if (!requireLogin()) return;
      const review = state.reviews.find((r) => r.id === Number(m![1]))!;
      if (review.userId === state.user.id) return error(route, 400, "Você não pode denunciar a sua própria avaliação", "BAD_REQUEST");
      if (review.reportedByMe) return error(route, 409, "Você já denunciou esta avaliação", "CONFLICT");
      review.reportedByMe = true;
      state.reports.push({ reviewId: review.id, reason: body?.reason, details: body?.details });
      return route.fulfill({
        status: 201,
        json: { id: state.nextId++, reason: body?.reason, details: body?.details ?? null, reporterName: state.user.name, createdAt: "2026-10-02T15:00:00Z" },
      });
    }
    if ((m = p.match(/^\/review\/(\d+)\/helpful$/)) && method === "POST") {
      if (!requireLogin()) return;
      const review = state.reviews.find((r) => r.id === Number(m![1]))!;
      review.helpfulByMe = !review.helpfulByMe;
      review.helpfulCount += review.helpfulByMe ? 1 : -1;
      return route.fulfill({ json: { reviewId: review.id, helpfulCount: review.helpfulCount, helpfulByMe: review.helpfulByMe } });
    }
    if ((m = p.match(/^\/review\/(\d+)$/))) {
      const idx = state.reviews.findIndex((r) => r.id === Number(m![1]));
      if (idx < 0) return error(route, 404, "Avaliação não encontrada", "NOT_FOUND");
      if (method === "PUT") {
        Object.assign(state.reviews[idx], { title: body?.title, description: body?.description, note: body?.note });
        return route.fulfill({ json: state.reviews[idx] });
      }
      if (method === "DELETE") {
        state.reviews.splice(idx, 1);
        return route.fulfill({ status: 204, body: "" });
      }
      return route.fulfill({ json: state.reviews[idx] });
    }

    // ---------- notificações ----------
    if (p.startsWith("/notifications")) {
      if (!requireLogin()) return;
      if (p === "/notifications/unread-count") return route.fulfill({ json: { count: state.notifications.filter((n) => !n.read).length } });
      if (p === "/notifications/read-all") {
        state.notifications.forEach((n) => (n.read = true));
        return route.fulfill({ status: 204, body: "" });
      }
      if ((m = p.match(/^\/notifications\/(\d+)\/read$/))) {
        const n = state.notifications.find((x) => x.id === Number(m![1]));
        if (n) n.read = true;
        return route.fulfill({ status: 204, body: "" });
      }
      const items = q.get("unreadOnly") === "true" ? state.notifications.filter((n) => !n.read) : state.notifications;
      return route.fulfill({ json: page(items, pageNumber, size) });
    }

    return error(route, 404, `Rota não mockada: ${method} ${p}`, "NOT_FOUND");
  });
};
