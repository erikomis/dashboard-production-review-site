import type { Page } from "./page";

export interface Review {
  id: number;
  title: string;
  description: string;
  note: number;
  productId: number;
  userId: number;
  createdAt: string;
  productName: string | null;
  userName: string | null;
}

export type ReviewPage = Page<Review>;

export interface ReviewSummary {
  productId: number;
  totalReviews: number;
  averageNote: number;
}

export interface CreateReviewDto {
  title: string;
  description: string;
  note: number;
  productId: number;
}
