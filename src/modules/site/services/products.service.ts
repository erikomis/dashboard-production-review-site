import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type {
  ProductDetail,
  ProductListParams,
  ProductPage,
  ProductSort,
} from "@/shared/types/product";

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
};
