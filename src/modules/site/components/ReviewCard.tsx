import { useId } from "react";
import { Link } from "@tanstack/react-router";
import { Flag, ThumbsUp } from "lucide-react";
import type { Review } from "@/shared/types/review";
import { formatDate, formatInteger, getInitials } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { StarRating } from "./StarRating";
import { ReviewGallery } from "./ReviewGallery";
import { ReviewReply } from "./ReviewReply";

export interface ReviewHelpfulProps {
  /** Usuário logado (sem login o clique leva ao login) */
  isAuthenticated: boolean;
  /** id do usuário logado, para desabilitar o botão na própria avaliação */
  currentUserId?: number;
  /** ids com marcação em andamento */
  pendingIds: number[];
  onToggle: (review: Review) => void;
}

export interface ReviewReportProps {
  /** id do usuário logado: a própria avaliação não pode ser denunciada */
  currentUserId?: number;
  /** Abre o modal de denúncia (sem login, leva ao login) */
  onReport: (review: Review) => void;
}

interface Props {
  review: Review;
  /** Mostra o nome do produto (usado na home, em "avaliações recentes" e no perfil) */
  showProduct?: boolean;
  headingLevel?: "h2" | "h3" | "h4";
  /** Exibe o botão "Isso foi útil" */
  helpful?: ReviewHelpfulProps;
  /** Exibe a ação "Denunciar" */
  report?: ReviewReportProps;
  /** Esconde o link para o perfil do autor (ex.: dentro do próprio perfil) */
  hideAuthorLink?: boolean;
  /** Versão resumida (cards da home): sem fotos, resposta nem ações */
  compact?: boolean;
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
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
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
            ? "border-brand-600 bg-tint text-brand-800 hover:bg-tint-strong dark:border-brand-300"
            : "border-line-strong/50 bg-surface text-ink hover:border-ink",
        )}
      >
        <ThumbsUp
          aria-hidden="true"
          className={cn("h-4 w-4 transition-transform", pressed && "fill-brand-600 text-brand-600 motion-safe:scale-110 dark:fill-brand-300 dark:text-brand-300")}
        />
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

const ReportAction = ({ review, report, author }: { review: Review; report: ReviewReportProps; author: string }) => {
  const isOwn = report.currentUserId !== undefined && report.currentUserId === review.userId;
  if (isOwn) return null;
  if (review.reportedByMe) {
    return (
      <span className="inline-flex h-10 items-center gap-1.5 rounded-full bg-canvas px-3 text-sm font-medium text-muted">
        <Flag aria-hidden="true" className="h-4 w-4 fill-current" />
        Denunciada
        <span className="sr-only"> por você. A moderação vai analisar esta avaliação.</span>
      </span>
    );
  }
  return (
    <button
      type="button"
      onClick={() => report.onReport(review)}
      className="inline-flex h-10 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-muted transition-colors hover:bg-danger-soft hover:text-danger"
    >
      <Flag aria-hidden="true" className="h-4 w-4" />
      Denunciar<span className="sr-only"> a avaliação de {author}</span>
    </button>
  );
};

export const ReviewCard = ({
  review,
  showProduct,
  headingLevel: Heading = "h3",
  helpful,
  report,
  hideAuthorLink,
  compact,
}: Props) => {
  const author = review.userName || "Usuário";
  const currentUserId = helpful?.currentUserId ?? report?.currentUserId;
  const isOwn = currentUserId !== undefined && currentUserId === review.userId;
  const hasActions = !compact && (helpful || report);

  return (
    <article
      id={compact ? undefined : `review-${review.id}`}
      tabIndex={compact ? undefined : -1}
      className="flex h-full scroll-mt-24 flex-col rounded-2xl border border-line bg-surface p-5 shadow-card transition-shadow focus:outline-none focus:ring-2 focus:ring-brand-300 sm:p-6"
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint-strong text-sm font-bold text-brand-800"
        >
          {getInitials(author)}
        </span>
        <div className="min-w-0">
          <p className="flex flex-wrap items-center gap-x-2 text-sm font-semibold text-ink">
            {review.userUsername && !hideAuthorLink ? (
              <Link
                to="/u/$username"
                params={{ username: review.userUsername }}
                className="truncate rounded underline-offset-4 hover:text-brand-700 hover:underline"
              >
                {author}
                <span className="sr-only"> (ver perfil)</span>
              </Link>
            ) : (
              <span className="truncate">{author}</span>
            )}
            {isOwn && (
              <span className="rounded-full bg-tint px-2 py-0.5 text-xs font-semibold text-brand-800">Sua avaliação</span>
            )}
          </p>
          <p className="text-xs text-muted">
            <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
          </p>
        </div>
      </div>
      <StarRating value={review.note} size="sm" className="mt-4" label={`Nota ${review.note} de 5 estrelas`} />
      <Heading className="mt-2 font-sans text-base font-semibold text-ink">{review.title}</Heading>
      <p
        className={cn(
          "mt-1.5 whitespace-pre-line break-words text-[0.95rem] leading-relaxed text-ink-soft",
          compact && "line-clamp-4",
        )}
      >
        {review.description}
      </p>

      {!compact && <ReviewGallery images={review.images ?? []} author={author} title={review.title} />}
      {!compact && review.reply && <ReviewReply reply={review.reply} />}

      {showProduct && review.productName && (
        <p className={cn("text-sm text-muted", compact ? "mt-auto pt-4" : "mt-4")}>
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
      {compact && (review.images?.length ?? 0) > 0 && (
        <p className="mt-2 text-xs text-muted">
          {review.images.length === 1 ? "1 foto" : `${review.images.length} fotos`}
          {review.reply ? " · respondida pela equipe" : ""}
        </p>
      )}

      {hasActions && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-4">
          {helpful ? <HelpfulButton review={review} helpful={helpful} /> : <span />}
          {report && <ReportAction review={review} report={report} author={author} />}
        </div>
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
