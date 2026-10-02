import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type {
  CreateReviewDto,
  HelpfulResult,
  ProductReviewsParams,
  Review,
  ReviewPage,
  ReviewSummary,
  UpdateReviewDto,
} from "@/shared/types/review";

export const ReviewsService = {
  /** GET /review/list — avaliações visíveis mais recentes de todos os produtos. */
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

  /** GET /review/product/{productId} — paginado, com filtro por nota e ordenação. */
  listByProduct: async (
    productId: number,
    { page = 0, size = 10, note, sort = "recent" }: ProductReviewsParams = {},
  ): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: `/review/product/${productId}`,
        method: "GET",
        params: { page, size, note: note || undefined, sort },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /review/product/{productId}/summary — média, total e distribuição 1–5. */
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

  /** GET /review/me — avaliações do usuário logado, inclusive as ocultas pela moderação. */
  listMine: async (page = 0, size = 10): Promise<ReviewPage> => {
    try {
      const response = await api.request<ReviewPage>({
        url: "/review/me",
        method: "GET",
        params: { page, size },
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

  /** PUT /review/{id} — só o autor (ou ADMIN). Não altera o status de moderação. */
  update: async (id: number, dto: UpdateReviewDto): Promise<Review> => {
    try {
      const response = await api.request<Review>({
        url: `/review/${id}`,
        method: "PUT",
        data: dto,
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** DELETE /review/{id} — só o autor (ou ADMIN). */
  remove: async (id: number): Promise<void> => {
    try {
      await api.request({ url: `/review/${id}`, method: "DELETE" });
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** POST /review/{id}/helpful — alterna a marcação "útil" do usuário logado. */
  toggleHelpful: async (id: number): Promise<HelpfulResult> => {
    try {
      const response = await api.request<HelpfulResult>({
        url: `/review/${id}/helpful`,
        method: "POST",
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
