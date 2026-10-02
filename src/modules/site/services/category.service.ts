import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { Category } from "@/shared/types/category";

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
};
