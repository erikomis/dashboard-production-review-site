import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type {
  CreateReviewDto,
  Review,
  ReviewPage,
  ReviewSummary,
} from "@/shared/types/review";

export const ReviewsService = {
  /** GET /review/list — avaliações mais recentes de todos os produtos. */
  listRecent: async (page = 0, size = 6): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: "/review/list",
        method: "GET",
        params: { page, size },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /review/product/{productId} — paginado, mais recentes primeiro. */
  listByProduct: async (productId: number, page = 0, size = 10): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: `/review/product/${productId}`,
        method: "GET",
        params: { page, size },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /review/product/{productId}/summary — média e total. */
  getSummary: async (productId: number): Promise<ReviewSummary> => {
    try {
      const response = await api.request<ReviewSummary>({
        url: `/review/product/${productId}/summary`,
        method: "GET",
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** POST /review/ (barra final) — exige login. */
  create: async (dto: CreateReviewDto): Promise<Review> => {
    try {
      const response = await api.request<Review>({
        url: "/review/",
        method: "POST",
        data: dto,
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
