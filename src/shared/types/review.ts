import type { Page } from "./page";

export type ReviewStatus = "VISIBLE" | "HIDDEN";

export interface Review {
  id: number;
  title: string;
  description: string;
  note: number;
  productId: number;
  userId: number;
  createdAt: string;
  productName: string | null;
  productSlug: string | null;
  userName: string | null;
  /** Quantas pessoas marcaram como útil */
  helpfulCount: number;
  /** Se o usuário logado marcou como útil (false sem login) */
  helpfulByMe: boolean;
  status: ReviewStatus;
  /** Motivo informado pela moderação quando a avaliação está oculta */
  moderationReason: string | null;
  moderatedAt: string | null;
}

export type ReviewPage = Page<Review>;

/** Chaves "1" a "5" sempre presentes */
export type RatingDistribution = Record<"1" | "2" | "3" | "4" | "5", number>;

export interface ReviewSummary {
  productId: number;
  totalReviews: number;
  /** 0 quando não há avaliações */
  averageNote: number;
  distribution: RatingDistribution;
}

export type ReviewSort = "recent" | "oldest" | "highest" | "lowest" | "helpful";

export interface ProductReviewsParams {
  page?: number;
  size?: number;
  /** Filtra por nota exata (1 a 5) */
  note?: number;
  sort?: ReviewSort;
}

export interface CreateReviewDto {
  title: string;
  description: string;
  note: number;
  productId: number;
}

export type UpdateReviewDto = CreateReviewDto;

/** Resposta de POST /review/{id}/helpful */
export interface HelpfulResult {
  reviewId: number;
  helpfulCount: number;
  helpfulByMe: boolean;
}
