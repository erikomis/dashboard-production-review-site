import { AxiosError } from "axios";
import { api } from "@/shared/services/api";
import type { Product, ProductPage } from "@/shared/types/product";

export const ProductsService = {
  fetchProducts: async (page = 0, size = 12): Promise<ProductPage> => {
    try {
      const response = await api.request<ProductPage>({
        url: `/production/list?page=${page}&size=${size}`,
        method: "GET",
      });
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getById: async (id: string): Promise<Product> => {
    try {
      const response = await api.request<Product>({
        url: `/production/get?id=${id}`,
        method: "GET",
      });
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  getBySlug: async (slug: string): Promise<Product | null> => {
    try {
      const response = await api.request<ProductPage>({
        url: `/production/list?page=0&size=200`,
        method: "GET",
      });
      return response.data.content.find((p) => p.slug === slug) ?? null;
    } catch {
      return null;
    }
  },
};
