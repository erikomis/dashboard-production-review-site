import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { Category, CategoryDetail } from "@/shared/types/category";

export const CategoryService = {
  /** GET /category/list — categorias com subcategorias aninhadas. */
  list: async (): Promise<Category[]> => {
    try {
      const response = await api.request<Category[]>({
        method: "GET",
        url: "/category/list",
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /category/slug/{slug}. Devolve null quando a categoria não existe. */
  getBySlug: async (slug: string): Promise<CategoryDetail | null> => {
    try {
      const response = await api.request<CategoryDetail>({
        method: "GET",
        url: `/category/slug/${encodeURIComponent(slug)}`,
      });
      return response.data;
    } catch (er) {
      const error = toHttpError(er);
      if (error.status === 404) return null;
      throw error;
    }
  },
};
