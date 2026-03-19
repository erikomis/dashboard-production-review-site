import { AxiosError } from "axios";
import { api } from "@/shared/services/api";
import type { Review, ReviewPage } from "@/shared/types/review";

export type CreateReviewDto = {
  title: string;
  content: string;
  rating: number;
  productId: string;
};

export const ReviewsService = {
  listByProduct: async (productId: string, page = 0, size = 20): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: `/review/list?page=${page}&size=${size}`,
        method: "GET",
      });
      return {
        ...response.data,
        content: response.data.content.filter((r: Review) => r.productId === productId),
      };
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || error.message);
    }
  },

  create: async (dto: CreateReviewDto): Promise<Review> => {
    try {
      const response = await api.request<Review>({
        url: "/review/create",
        method: "POST",
        data: dto,
      });
      return response.data;
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      throw new Error(error.response?.data?.message || error.message);
    }
  },
};
