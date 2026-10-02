import type { Page } from "./page";

export type ReviewStatus = "VISIBLE" | "HIDDEN";

/** Foto enviada pelo autor. `url` é relativa à API (ex.: "/api/v1/files/reviews/12/uuid.jpg"). */
export interface ReviewImage {
  id: number;
  url: string;
}

/** Resposta oficial da equipe ReviewStore */
export interface ReviewReply {
  text: string;
  authorName: string | null;
  /** ISO-8601 em UTC (com Z) */
  repliedAt: string;
}

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
  /** username do autor, para o link do perfil público (/u/{username}) */
  userUsername: string | null;
  /** Quantas pessoas marcaram como útil */
  helpfulCount: number;
  /** Se o usuário logado marcou como útil (false sem login) */
  helpfulByMe: boolean;
  status: ReviewStatus;
  /** Motivo informado pela moderação quando a avaliação está oculta */
  moderationReason: string | null;
  moderatedAt: string | null;
  /** Fotos da avaliação (no máximo 3) */
  images: ReviewImage[];
  /** Resposta oficial ou null */
  reply: ReviewReply | null;
  /** Se o usuário logado já denunciou esta avaliação (false sem login) */
  reportedByMe: boolean;
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

export type ReportReason = "SPAM" | "OFFENSIVE" | "FALSE_INFORMATION" | "OTHER";

/** Corpo de POST /review/{id}/report */
export interface ReportReviewDto {
  reason: ReportReason;
  /** Até 500 caracteres */
  details?: string;
}

/** Resposta 201 de POST /review/{id}/report */
export interface ReviewReport {
  id: number;
  reason: ReportReason;
  details: string | null;
  reporterName: string | null;
  createdAt: string;
}

/** Resposta de POST /review/{id}/helpful */
export interface HelpfulResult {
  reviewId: number;
  helpfulCount: number;
  helpfulByMe: boolean;
}
