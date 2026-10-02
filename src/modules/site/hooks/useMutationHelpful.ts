import { useMutation, useMutationState } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import type { Review, ReviewPage } from "@/shared/types/review";
import { reviewKeys } from "./useQueryReviews";

export const helpfulMutationKey = ["reviews", "helpful"] as const;

/** Estado exibido antes do clique (usado para desfazer em caso de erro). */
export type HelpfulVariables = Pick<Review, "id" | "helpfulCount" | "helpfulByMe">;

const isReviewPage = (data: unknown): data is ReviewPage =>
  !!data && Array.isArray((data as ReviewPage).content);

/** Atualiza a avaliação em todas as listas em cache (produto, recentes...). */
const patchReview = (id: number, patch: Pick<Review, "helpfulCount" | "helpfulByMe">) =>
  queryClient.setQueriesData<ReviewPage>({ queryKey: reviewKeys.all }, (old) =>
    isReviewPage(old)
      ? { ...old, content: old.content.map((r) => (r.id === id ? { ...r, ...patch } : r)) }
      : old,
  );

/** Marca/desmarca "útil" com atualização otimista e rollback se a API falhar. */
export const useMutationHelpful = () =>
  useMutation({
    mutationKey: helpfulMutationKey,
    mutationFn: (review: HelpfulVariables) => ReviewsService.toggleHelpful(review.id),
    onMutate: async (review) => {
      // Evita que uma busca em andamento sobrescreva o valor otimista
      await queryClient.cancelQueries({
        queryKey: reviewKeys.all,
        predicate: (q) => q.state.data !== undefined,
      });
      patchReview(review.id, {
        helpfulByMe: !review.helpfulByMe,
        helpfulCount: Math.max(0, review.helpfulCount + (review.helpfulByMe ? -1 : 1)),
      });
    },
    onError: (_error, review) =>
      patchReview(review.id, { helpfulByMe: review.helpfulByMe, helpfulCount: review.helpfulCount }),
    // Confirma com o valor real do servidor (outras pessoas podem ter votado)
    onSuccess: (result) =>
      patchReview(result.reviewId, { helpfulByMe: result.helpfulByMe, helpfulCount: result.helpfulCount }),
  });

/** ids das avaliações com marcação "útil" em andamento. */
export const usePendingHelpfulIds = () =>
  useMutationState({
    filters: { mutationKey: helpfulMutationKey, status: "pending" },
    select: (mutation) => (mutation.state.variables as HelpfulVariables | undefined)?.id,
  }).filter((id): id is number => typeof id === "number");
