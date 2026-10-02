import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type {
  ProductDetail,
  ProductListParams,
  ProductPage,
  ProductSort,
} from "@/shared/types/product";

const SORT_PARAMS: Record<ProductSort, { property: string; sort: "ASC" | "DESC" }> = {
  recent: { property: "createdAt", sort: "DESC" },
  "name-asc": { property: "name", sort: "ASC" },
  "name-desc": { property: "name", sort: "DESC" },
};

/** Maior página aceita pela API. */
const MAX_PAGE_SIZE = 100;

const fetchPage = async ({
  page = 0,
  size = 12,
  search,
  sort = "recent",
}: ProductListParams): Promise<ProductPage> => {
  const response = await api.request<ProductPage>({
    url: "/production/list",
    method: "GET",
    params: {
      page,
      size,
      search: search?.trim() || undefined,
      ...SORT_PARAMS[sort],
    },
  });
  return response.data;
};

export const ProductsService = {
  /** GET /production/list (paginado, busca por nome e ordenação). */
  list: async (params: ProductListParams = {}): Promise<ProductPage> => {
    try {
      const { subCategorieId, page = 0, size = 12 } = params;
      if (!subCategorieId) return await fetchPage(params);

      // A API não filtra por subcategoria: buscamos a maior página permitida
      // e filtramos/paginamos no cliente.
      const all = await fetchPage({ ...params, page: 0, size: MAX_PAGE_SIZE });
      const filtered = all.content.filter((p) => p.subCategorieId === subCategorieId);
      const totalPages = Math.max(1, Math.ceil(filtered.length / size));
      return {
        content: filtered.slice(page * size, page * size + size),
        page: { size, number: page, totalElements: filtered.length, totalPages },
      };
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

