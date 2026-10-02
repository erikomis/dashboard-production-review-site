import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { SeoProduct } from "@/shared/types/seo";

export const SeoService = {
  /** GET /seo/products/{slug} — dados para o JSON-LD Product/AggregateRating/Review. */
  getProduct: async (slug: string): Promise<SeoProduct | null> => {
    try {
      const response = await api.request<SeoProduct>({
        url: `/seo/products/${encodeURIComponent(slug)}`,
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
