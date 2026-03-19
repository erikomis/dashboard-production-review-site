import { api } from "@/shared/services/api";
import { Category } from "@/shared/types/category";

export const CategoryService = {
  list: async () => {
    const response = await api.request<Category[]>({
      method: "GET",
      url: "/category/list",
    });
    return response.data;
  },
};
