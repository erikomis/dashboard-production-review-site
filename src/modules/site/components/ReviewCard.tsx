import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { ThumbsUp } from "lucide-react";
import type { Review } from "@/shared/types/review";
import { formatDate, formatInteger, getInitials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { StarRating } from "./StarRating";

export interface ReviewHelpfulProps {
  /** Usuário logado (sem login o clique leva ao login) */
  isAuthenticated: boolean;
  /** id do usuário logado, para desabilitar o botão na própria avaliação */
  currentUserId?: number;
  /** ids com marcação em andamento */
  pendingIds: number[];
  onToggle: (review: Review) => void;
}

interface Props {
  review: Review;
  /** Mostra o nome do produto (usado na home, em "avaliações recentes") */
  showProduct?: boolean;
  headingLevel?: "h3" | "h4";
  /** Exibe o botão "Isso foi útil" */
  helpful?: ReviewHelpfulProps;
}

const HelpfulButton = ({ review, helpful }: { review: Review; helpful: ReviewHelpfulProps }) => {
  const hintId = useId();
  const isOwn = helpful.currentUserId !== undefined && helpful.currentUserId === review.userId;
  const pending = helpful.pendingIds.includes(review.id);
  const pressed = helpful.isAuthenticated && review.helpfulByMe;
  const hint = isOwn
    ? "Você não pode marcar a sua própria avaliação como útil."
    : !helpful.isAuthenticated
      ? "Entre na sua conta para marcar como útil."
      : undefined;

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-line pt-4">
      <button
        type="button"
        onClick={() => {
          if (!pending) helpful.onToggle(review);
        }}
        disabled={isOwn}
        aria-pressed={isOwn ? undefined : pressed}
        aria-describedby={hint ? hintId : undefined}
        aria-disabled={pending || undefined}
        className={cn(
          "inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-semibold transition-colors",
          "disabled:cursor-not-allowed disabled:border-line disabled:bg-canvas disabled:text-muted",
          pressed
            ? "border-brand-600 bg-brand-50 text-brand-800 hover:bg-brand-100"
            : "border-line-strong/50 bg-surface text-ink hover:border-ink",
        )}
      >
        <ThumbsUp aria-hidden="true" className={cn("h-4 w-4", pressed && "fill-brand-600 text-brand-600")} />
        Isso foi útil ({formatInteger(review.helpfulCount)})
      </button>
      {hint && (
        <span id={hintId} className={cn("text-xs text-muted", !isOwn && "sr-only")}>
          {hint}
        </span>
      )}
    </div>
  );
};

export const ReviewCard = ({ review, showProduct, headingLevel: Heading = "h3", helpful }: Props) => {
  const author = review.userName || "Usuário";
  const isOwn = helpful?.currentUserId !== undefined && helpful.currentUserId === review.userId;
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
          <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
            <span className="truncate">{author}</span>
            {isOwn && (
              <span className="rounded-full bg-brand-50 px-2 py-0.5 text-xs font-semibold text-brand-800">
                Sua avaliação
              </span>
            )}
          </p>
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
          {review.productSlug ? (
            <Link to="/products/$slug" params={{ slug: review.productSlug }} className="link">
              {review.productName}
            </Link>
          ) : (
            <span className="font-semibold text-ink">{review.productName}</span>
          )}
        </p>
      )}
      {helpful && <HelpfulButton review={review} helpful={helpful} />}
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
