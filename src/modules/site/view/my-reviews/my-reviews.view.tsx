import { useRef } from "react";
import { Link } from "@tanstack/react-router";
import { EyeOff, MessageSquareText, Pencil, ShieldAlert, ThumbsUp, Trash2 } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { Pagination } from "@/modules/site/components/Pagination";
import { ReviewCardSkeleton } from "@/modules/site/components/ReviewCard";
import { StarRating } from "@/modules/site/components/StarRating";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { Modal } from "@/shared/components/modal";
import { EmptyState, ErrorState } from "@/shared/components/state";
import type { Review } from "@/shared/types/review";
import { formatDate, pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { EditReview } from "./edit-review/EditReview";
import { useMyReviewsModel } from "./my-reviews.model";

type MyReviewsViewProps = ReturnType<typeof useMyReviewsModel>;

const StatusBadge = ({ review }: { review: Review }) =>
  review.status === "HIDDEN" ? (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger-soft px-2.5 py-1 text-xs font-semibold text-danger">
      <EyeOff aria-hidden="true" className="h-3.5 w-3.5" />
      Oculta pela moderação
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-xs font-semibold text-success">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-success" />
      Publicada
    </span>
  );

const MyReviewItem = ({
  review,
  onEdit,
  onDelete,
}: {
  review: Review;
  onEdit: (review: Review) => void;
  onDelete: (review: Review) => void;
}) => {
  const hidden = review.status === "HIDDEN";
  return (
    <article
      className={cn(
        "rounded-2xl border bg-surface p-5 shadow-card sm:p-6",
        hidden ? "border-danger/30" : "border-line",
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-muted">
            Sobre{" "}
            {review.productSlug ? (
              <Link to="/products/$slug" params={{ slug: review.productSlug }} className="link">
                {review.productName ?? "produto"}
              </Link>
            ) : (
              <span className="font-semibold text-ink">{review.productName ?? "produto removido"}</span>
            )}
          </p>
          <p className="mt-0.5 text-xs text-muted">
            Publicada em <time dateTime={review.createdAt}>{formatDate(review.createdAt)}</time>
          </p>
        </div>
        <StatusBadge review={review} />
      </div>

      <StarRating value={review.note} size="sm" className="mt-4" label={`Nota ${review.note} de 5 estrelas`} />
      <h2 className="mt-2 font-sans text-base font-semibold text-ink">{review.title}</h2>
      <p className="mt-1.5 whitespace-pre-line break-words text-[0.95rem] leading-relaxed text-ink-soft">
        {review.description}
      </p>

      {hidden && (
        <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-danger-soft px-4 py-3 text-sm text-ink-soft">
          <ShieldAlert aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-danger" />
          <div>
            <p className="font-semibold text-ink">Esta avaliação não aparece para outras pessoas.</p>
            <p className="mt-0.5">
              <span className="font-medium">Motivo da moderação:</span>{" "}
              {review.moderationReason?.trim() || "não informado."}
            </p>
          </div>
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
        <p className="inline-flex items-center gap-1.5 text-sm text-muted">
          <ThumbsUp aria-hidden="true" className="h-4 w-4" />
          {review.helpfulCount > 0
            ? `${pluralize(review.helpfulCount, "pessoa achou", "pessoas acharam")} útil`
            : "Ainda sem marcações de útil"}
        </p>
        <div className="flex gap-2">
          <Button color="outline" size="sm" onClick={() => onEdit(review)}>
            <Pencil aria-hidden="true" className="h-4 w-4" />
            Editar<span className="sr-only"> a avaliação “{review.title}”</span>
          </Button>
          <Button
            color="outline"
            size="sm"
            onClick={() => onDelete(review)}
            className="text-danger hover:border-danger hover:bg-danger-soft"
          >
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            Excluir<span className="sr-only"> a avaliação “{review.title}”</span>
          </Button>
        </div>
      </div>
    </article>
  );
};

export const MyReviewsView = ({
  user,
  page,
  reviews,
  totalPages,
  totalElements,
  hiddenCount,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  onPageChange,
  headingRef,
  announcement,
  editingReview,
  openEdit,
  closeEdit,
  onEditSaved,
  isSavingEdit,
  onEditPendingChange,
  deletingReview,
  openDelete,
  closeDelete,
  confirmDelete,
  isDeleting,
}: MyReviewsViewProps) => {
  const cancelDeleteRef = useRef<HTMLButtonElement>(null);

  return (
    <div className="container-page py-8 sm:py-10">
      <Breadcrumb items={[{ label: "Minhas avaliações" }]} />

      <div className="mt-5 max-w-3xl">
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-ink focus:outline-none sm:text-4xl">
          Minhas avaliações
        </h1>
        <p className="mt-2 text-muted">
          {user ? `Olá, ${user.name.split(" ")[0]}. ` : ""}Aqui ficam todas as avaliações que você publicou, inclusive as
          ocultas pela moderação. Você pode editar ou excluir cada uma.
        </p>
      </div>

      <p role="status" aria-live="polite" className="mt-6 text-sm font-semibold text-ink">
        {isLoading || isError
          ? ""
          : totalElements === 0
            ? ""
            : `${pluralize(totalElements, "avaliação", "avaliações")}${
                hiddenCount > 0 ? ` · ${pluralize(hiddenCount, "oculta", "ocultas")} nesta página` : ""
              }${totalPages > 1 ? ` · página ${page + 1} de ${totalPages}` : ""}`}
      </p>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div className="mt-4 max-w-3xl">
        {isError ? (
          <ErrorState message={error?.message ?? "Não conseguimos carregar suas avaliações."} onRetry={() => refetch()} />
        ) : isLoading ? (
          <div className="space-y-4" aria-busy="true">
            <span className="sr-only" role="status">
              Carregando suas avaliações…
            </span>
            <ReviewCardSkeleton />
            <ReviewCardSkeleton />
          </div>
        ) : reviews.length === 0 ? (
          <EmptyState
            icon={<MessageSquareText />}
            title="Você ainda não avaliou nenhum produto"
            description="Conte como foi sua experiência com algo que você usou. Leva menos de um minuto."
            headingLevel="h2"
            action={
              <Link to="/products" className={buttonVariants()}>
                Encontrar um produto para avaliar
              </Link>
            }
          />
        ) : (
          <ul aria-label="Suas avaliações" aria-busy={isFetching} className={cn("space-y-4 transition-opacity", isFetching && "opacity-60")}>
            {reviews.map((review) => (
              <li key={review.id}>
                <MyReviewItem review={review} onEdit={openEdit} onDelete={openDelete} />
              </li>
            ))}
          </ul>
        )}

        <Pagination
          page={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
          label="Paginação das suas avaliações"
          className="mt-8"
        />
      </div>

      <Modal
        open={!!editingReview}
        onClose={closeEdit}
        closeDisabled={isSavingEdit}
        title="Editar avaliação"
        description={editingReview?.productName ? `Sobre ${editingReview.productName}` : undefined}
        className="max-w-xl"
      >
        {editingReview && (
          <EditReview
            review={editingReview}
            onCancel={closeEdit}
            onSaved={onEditSaved}
            onPendingChange={onEditPendingChange}
          />
        )}
      </Modal>

      <Modal
        open={!!deletingReview}
        onClose={closeDelete}
        closeDisabled={isDeleting}
        role="alertdialog"
        initialFocusRef={cancelDeleteRef}
        title="Excluir avaliação?"
        description={
          deletingReview ? (
            <>
              A avaliação <strong className="font-semibold text-ink">“{deletingReview.title}”</strong>
              {deletingReview.productName ? <> sobre {deletingReview.productName}</> : null} será removida
              permanentemente. Essa ação não pode ser desfeita.
            </>
          ) : undefined
        }
      >
        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button ref={cancelDeleteRef} color="outline" onClick={closeDelete} disabled={isDeleting}>
            Cancelar
          </Button>
          <Button color="danger" onClick={confirmDelete} loading={isDeleting}>
            <Trash2 aria-hidden="true" className="h-4 w-4" />
            {isDeleting ? "Excluindo…" : "Excluir avaliação"}
          </Button>
        </div>
      </Modal>
    </div>
  );
};
