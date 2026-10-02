import { useEffect, useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useQueryMyReviews } from "@/modules/site/hooks/useQueryReviews";
import { useMutationDeleteReview } from "@/modules/site/hooks/useMutationReview";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError } from "@/shared/services/http-error";
import type { Review } from "@/shared/types/review";

export const MY_REVIEWS_PAGE_SIZE = 10;
export const MY_REVIEWS_PATH = "/minhas-avaliacoes";

export const useMyReviewsModel = () => {
  useDocumentTitle("Minhas avaliações");
  const navigate = useNavigate();
  const search = useSearch({ from: "/site/minhas-avaliacoes" });
  const page = (search.page ?? 1) - 1;
  const headingRef = useRef<HTMLHeadingElement>(null);

  const { data: user, isPending: isLoadingUser } = useMeQuery();
  const reviewsQuery = useQueryMyReviews(page, MY_REVIEWS_PAGE_SIZE, !!user);

  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [announcement, setAnnouncement] = useState("");
  const deleteMutation = useMutationDeleteReview();

  // A rota já exige login; se a sessão acabar aqui (ex.: logout), volta para o login
  useEffect(() => {
    if (!isLoadingUser && !user) {
      navigate({ to: "/login", search: { redirect: MY_REVIEWS_PATH }, replace: true });
    }
  }, [isLoadingUser, user, navigate]);

  const reviews = reviewsQuery.data?.content ?? [];
  const totalPages = reviewsQuery.data?.page.totalPages ?? 0;
  const totalElements = reviewsQuery.data?.page.totalElements ?? 0;
  const hiddenCount = reviews.filter((r) => r.status === "HIDDEN").length;

  const goToPage = (nextPage: number) =>
    navigate({ to: MY_REVIEWS_PATH, search: { page: nextPage > 0 ? nextPage + 1 : undefined }, resetScroll: false });

  const onPageChange = (nextPage: number) => {
    goToPage(nextPage);
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  };

  const handleAuthError = async (error: unknown) => {
    if (error instanceof HttpError && error.status === 401) {
      await queryClient.resetQueries({ queryKey: ["me"] });
      return true;
    }
    return false;
  };

  const onEditSaved = (review: Review) => {
    setEditingReview(null);
    setAnnouncement(`Avaliação “${review.title}” atualizada.`);
    toast.success("Avaliação atualizada.");
  };

  const confirmDelete = async () => {
    if (!deletingReview || deleteMutation.isPending) return;
    const review = deletingReview;
    try {
      await deleteMutation.mutateAsync(review.id);
      setDeletingReview(null);
      setAnnouncement(`Avaliação “${review.title}” excluída.`);
      toast.success("Avaliação excluída.");
      // Se era o último item da página, volta uma página
      if (reviews.length === 1 && page > 0) goToPage(page - 1);
      else headingRef.current?.focus({ preventScroll: true });
    } catch (error) {
      if (await handleAuthError(error)) {
        toast.error("Sua sessão expirou. Entre novamente para excluir a avaliação.");
        return;
      }
      toast.error(
        error instanceof HttpError && error.status && error.status < 500
          ? error.message
          : "Não foi possível excluir a avaliação. Tente novamente.",
      );
    }
  };

  return {
    user,
    page,
    reviews,
    totalPages,
    totalElements,
    hiddenCount,
    isLoading: isLoadingUser || reviewsQuery.isPending,
    isFetching: reviewsQuery.isFetching,
    isError: reviewsQuery.isError,
    error: reviewsQuery.error,
    refetch: reviewsQuery.refetch,
    onPageChange,
    headingRef,
    announcement,

    editingReview,
    openEdit: (review: Review) => setEditingReview(review),
    closeEdit: () => {
      if (!isSavingEdit) setEditingReview(null);
    },
    onEditSaved,
    isSavingEdit,
    onEditPendingChange: setIsSavingEdit,

    deletingReview,
    openDelete: (review: Review) => setDeletingReview(review),
    closeDelete: () => {
      if (!deleteMutation.isPending) setDeletingReview(null);
    },
    confirmDelete,
    isDeleting: deleteMutation.isPending,
  };
};
