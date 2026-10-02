import { z } from "zod";
import type { Review } from "@/shared/types/review";
import { SchemaEditReview } from "./edit-review.schema";

export type EditReviewValues = z.infer<typeof SchemaEditReview>;

export interface EditReviewProps {
  review: Review;
  onCancel: () => void;
  onSaved: (review: Review) => void;
  /** Avisa o modal para não fechar enquanto salva */
  onPendingChange?: (pending: boolean) => void;
}
