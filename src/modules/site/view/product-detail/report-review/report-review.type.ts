import { z } from "zod";
import type { Review } from "@/shared/types/review";
import { SchemaReportReview } from "./report-review.schema";

export type ReportReviewValues = z.infer<typeof SchemaReportReview>;

export interface ReportReviewProps {
  review: Review;
  onCancel: () => void;
  /** Denúncia registrada (ou já existente: 409) */
  onReported: (review: Review) => void;
  /** Avisa o modal para não fechar enquanto envia */
  onPendingChange?: (pending: boolean) => void;
}
