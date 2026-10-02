import { z } from "zod";
import { SchemaCreateReview } from "./create-review.schema";

export type CreateReviewValues = z.infer<typeof SchemaCreateReview>;

export interface CreateReviewProps {
  productId: number;
  productName: string;
  isAuthenticated: boolean;
  /** Caminho para voltar após o login */
  loginRedirect: string;
  onCreated?: () => void;
}
