import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { Page } from "@/shared/types/page";
import type {
  FollowResult,
  ProductDetail,
  ProductListParams,
  ProductPage,
  ProductSort,
  ProductSuggestion,
  ProductSummary,
} from "@/shared/types/product";

/** A API recusa (400) buscas com menos de 2 caracteres. */
export const SUGGEST_MIN_CHARS = 2;

/** Ordenação do site -> parâmetros property/sort da API. */
const SORT_PARAMS: Record<ProductSort, { property: string; sort: "ASC" | "DESC" }> = {
  recent: { property: "createdAt", sort: "DESC" },
  "name-asc": { property: "name", sort: "ASC" },
  "name-desc": { property: "name", sort: "DESC" },
  // A API desempata a média pelo total de avaliações (DESC) e deixa os sem nota por último
  rating: { property: "averageNote", sort: "DESC" },
  popular: { property: "totalReviews", sort: "DESC" },
};

export const ProductsService = {
  /**
   * GET /production/list — página de ProductSummary (já com nota média, total,
   * foto e nomes de categoria/subcategoria). Filtros e ordenação no servidor.
   */
  list: async ({
    page = 0,
    size = 12,
    search,
    sort = "recent",
    categoryId,
    subCategorieId,
    onlyRated,
  }: ProductListParams = {}): Promise<ProductPage> => {
    try {
      const response = await api.request<ProductPage>({
        url: "/production/list",
        method: "GET",
        params: {
          page,
          size,
          search: search?.trim() || undefined,
          categoryId: categoryId || undefined,
          subCategorieId: subCategorieId || undefined,
          onlyRated: onlyRated || undefined,
          ...SORT_PARAMS[sort],
        },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /production/slug/{slug}. Devolve null quando o produto não existe. */
  getBySlug: async (slug: string): Promise<ProductDetail | null> => {
    try {
      const response = await api.request<ProductDetail>({
        url: `/production/slug/${encodeURIComponent(slug)}`,
        method: "GET",
      });
      return response.data;
    } catch (er) {
      const error = toHttpError(er);
      if (error.status === 404) return null;
      throw error;
    }
  },

  /**
   * GET /production/suggest — autocompletar (sem acento/maiúsculas, prefixo primeiro).
   * Não chama a API com menos de 2 caracteres (ela responde 400).
   */
  suggest: async (q: string, limit = 8, signal?: AbortSignal): Promise<ProductSuggestion[]> => {
    const term = q.trim();
    if (term.length < SUGGEST_MIN_CHARS) return [];
    try {
      const response = await api.request<ProductSuggestion[]>({
        url: "/production/suggest",
        method: "GET",
        params: { q: term, limit: Math.min(10, Math.max(1, limit)) },
        signal,
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** POST /production/{id}/follow — exige login. */
  follow: async (id: number): Promise<FollowResult> => {
    try {
      const response = await api.request<FollowResult>({ url: `/production/${id}/follow`, method: "POST" });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** DELETE /production/{id}/follow — exige login. */
  unfollow: async (id: number): Promise<FollowResult> => {
    try {
      const response = await api.request<FollowResult>({ url: `/production/${id}/follow`, method: "DELETE" });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /user/me/following — produtos seguidos (ordenados por nome). */
  listFollowing: async (page = 0, size = 12): Promise<Page<ProductSummary>> => {
    try {
      const response = await api.request<Page<ProductSummary>>({
        url: "/user/me/following",
        method: "GET",
        params: { page, size },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
