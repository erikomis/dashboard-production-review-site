import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type {
  CreateReviewDto,
  HelpfulResult,
  ProductReviewsParams,
  ReportReviewDto,
  Review,
  ReviewImage,
  ReviewPage,
  ReviewReport,
  ReviewSummary,
  UpdateReviewDto,
} from "@/shared/types/review";

/** Regras de fotos da API: JPEG/PNG/WebP, até 5 MB, no máximo 3 por avaliação. */
export const REVIEW_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export const REVIEW_IMAGE_MAX_BYTES = 5 * 1024 * 1024;
export const REVIEW_IMAGE_MAX_COUNT = 3;

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

  /** POST /review/{id}/report — {reason, details?}. 409 se já denunciou; 400 na própria avaliação. */
  report: async (id: number, dto: ReportReviewDto): Promise<ReviewReport> => {
    try {
      const response = await api.request<ReviewReport>({
        url: `/review/${id}/report`,
        method: "POST",
        data: { reason: dto.reason, details: dto.details?.trim() || undefined },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** POST /review/{id}/images (multipart `file`) — só o autor; informa o progresso do envio (0–100). */
  uploadImage: async (id: number, file: File, onProgress?: (percent: number) => void): Promise<ReviewImage> => {
    const form = new FormData();
    form.append("file", file);
    try {
      const response = await api.request<ReviewImage>({
        url: `/review/${id}/images`,
        method: "POST",
        data: form,
        // o axios completa o boundary do multipart
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (event) => {
          if (onProgress && event.total) onProgress(Math.round((event.loaded / event.total) * 100));
        },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** DELETE /review/{id}/images/{imageId} — autor (ou ADMIN). */
  deleteImage: async (id: number, imageId: number): Promise<void> => {
    try {
      await api.request({ url: `/review/${id}/images/${imageId}`, method: "DELETE" });
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
