import type { Review } from "@/shared/types/review";
import { StarRating } from "./StarRating";

interface Props {
  review: Review;
}

function formatDate(dateStr?: string) {
  if (!dateStr) return "";
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export const ReviewCard = ({ review }: Props) => {
  return (
    <div className="bg-white rounded-xl border border-stroke p-6 dark:bg-boxdark dark:border-strokedark">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h4 className="font-semibold text-black dark:text-white">{review.title}</h4>
          {review.createdAt && (
            <span className="text-xs text-gray-400 mt-0.5 block">
              {formatDate(review.createdAt)}
            </span>
          )}
        </div>
        <StarRating value={review.rating} size="sm" />
      </div>
      <p className="text-gray-600 text-sm leading-relaxed">{review.content}</p>
    </div>
  );
};
