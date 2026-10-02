import { formatNote, pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { StarRating } from "./StarRating";

interface ProductRatingProps {
  averageNote: number | null;
  totalReviews: number;
  size?: "sm" | "md";
  className?: string;
}

/** Nota média + total de avaliações (ou "Ainda sem avaliações"), como vem no ProductSummary. */
export const ProductRating = ({ averageNote, totalReviews, size = "sm", className }: ProductRatingProps) => {
  if (!totalReviews || averageNote === null) {
    return <span className={cn("text-sm text-muted", className)}>Ainda sem avaliações</span>;
  }
  return (
    <span className={cn("inline-flex flex-wrap items-center gap-x-2 gap-y-0.5 text-sm", className)}>
      <StarRating value={averageNote} size={size} />
      <span className={cn("font-semibold text-ink", size === "md" && "text-base")} aria-hidden="true">
        {formatNote(averageNote)}
      </span>
      <span className="text-muted">({pluralize(totalReviews, "avaliação", "avaliações")})</span>
    </span>
  );
};
