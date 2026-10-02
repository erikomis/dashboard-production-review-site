import { useEffect } from "react";

export const SITE_NAME = "ReviewStore";
export const DEFAULT_TITLE = `${SITE_NAME} — Avaliações reais de produtos`;
export const DEFAULT_DESCRIPTION =
  "ReviewStore: avaliações reais de quem já comprou. Compare produtos, veja notas e compartilhe sua experiência.";

export interface SeoOptions {
  /** Título da página (vira "Título | ReviewStore"); vazio = título padrão do site */
  title?: string;
  description?: string | null;
  /** Caminho canônico (padrão: o caminho atual, sem query string) */
  path?: string;
  /** Imagem para Open Graph/Twitter (URL absoluta) */
  image?: string | null;
  type?: "website" | "product" | "profile" | "article";
  /** Páginas privadas (conta, notificações...) não devem ser indexadas */
  noindex?: boolean;
  /** Dados estruturados (schema.org) inseridos como <script type="application/ld+json"> */
  jsonLd?: Record<string, unknown> | null;
}

/** Origem pública do site: VITE_SITE_URL (produção) ou a origem atual. */
export const siteOrigin = () =>
  ((import.meta.env.VITE_SITE_URL as string | undefined) || window.location.origin).replace(/\/$/, "");

const upsertMeta = (attr: "name" | "property", key: string, content: string | null | undefined) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!content) {
    el?.remove();
    return;
  }
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.rel = "canonical";
    document.head.appendChild(el);
  }
  el.href = href;
};

const JSON_LD_ID = "seo-jsonld";

/** Limita a descrição a ~160 caracteres (tamanho exibido pelos buscadores). */
const clip = (text: string, max = 160) => {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

/**
 * SEO por página: <title>, meta description, canonical, Open Graph, Twitter Card, robots
 * e JSON-LD. O título também é anunciado por leitores de tela ao navegar.
 */
export const useSeo = ({ title, description, path, image, type = "website", noindex, jsonLd }: SeoOptions = {}) => {
  const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : "";

  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = clip(description || DEFAULT_DESCRIPTION);
    const url = `${siteOrigin()}${path ?? window.location.pathname}`;

    document.title = fullTitle;
    upsertMeta("name", "description", desc);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertCanonical(url);

    upsertMeta("property", "og:title", fullTitle);
    upsertMeta("property", "og:description", desc);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:type", type);
    upsertMeta("property", "og:image", image || null);
    upsertMeta("name", "twitter:card", image ? "summary_large_image" : "summary");
    upsertMeta("name", "twitter:title", fullTitle);
    upsertMeta("name", "twitter:description", desc);
    upsertMeta("name", "twitter:image", image || null);
  }, [title, description, path, image, type, noindex]);

  useEffect(() => {
    if (!jsonLdText) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = JSON_LD_ID;
    // "<" escapado: o texto vem de dados de usuários e não pode fechar a tag <script>
    script.textContent = jsonLdText.replace(/</g, "\\u003c");
    document.getElementById(JSON_LD_ID)?.remove();
    document.head.appendChild(script);
    return () => script.remove();
  }, [jsonLdText]);
};
