import { Link } from "@tanstack/react-router";
import type { Review } from "@/shared/types/review";
import { formatDate, getInitials } from "@/shared/utils/format";
import { StarRating } from "./StarRating";

interface Props {
  review: Review;
  /** Mostra o nome do produto (usado na home, em "avaliações recentes") */
  showProduct?: boolean;
  /** slug do produto para o link, quando conhecido */
  productSlug?: string;
  headingLevel?: "h3" | "h4";
}

export const ReviewCard = ({ review, showProduct, productSlug, headingLevel: Heading = "h3" }: Props) => {
  const author = review.userName || "Usuário";
  return (
    <article className="flex h-full flex-col rounded-2xl border border-line bg-surface p-5 shadow-card sm:p-6">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-bold text-brand-800"
        >
          {getInitials(author)}
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{author}</p>
          <p className="text-xs text-muted">
            <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
          </p>
        </div>
      </div>
      <StarRating value={review.note} size="sm" className="mt-4" label={`Nota ${review.note} de 5 estrelas`} />
      <Heading className="mt-2 font-sans text-base font-semibold text-ink">{review.title}</Heading>
      <p className="mt-1.5 whitespace-pre-line break-words text-[0.95rem] leading-relaxed text-ink-soft">
        {review.description}
      </p>
      {showProduct && review.productName && (
        <p className="mt-auto pt-4 text-sm text-muted">
          Sobre{" "}
          {productSlug ? (
            <Link to="/products/$slug" params={{ slug: productSlug }} className="link">
              {review.productName}
            </Link>
          ) : (
            <span className="font-semibold text-ink">{review.productName}</span>
          )}
        </p>
      )}
    </article>
  );
};

export const ReviewCardSkeleton = () => (
  <div aria-hidden="true" className="rounded-2xl border border-line bg-surface p-6">
    <div className="flex items-center gap-3">
      <div className="skeleton h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-3.5 w-32" />
        <div className="skeleton h-3 w-24" />
      </div>
    </div>
    <div className="skeleton mt-4 h-4 w-24" />
    <div className="skeleton mt-3 h-4 w-1/2" />
    <div className="skeleton mt-3 h-3.5 w-full" />
    <div className="skeleton mt-2 h-3.5 w-4/5" />
  </div>
);
