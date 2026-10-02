import { useMutation } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import type { CreateReviewDto, UpdateReviewDto } from "@/shared/types/review";
import { reviewKeys } from "./useQueryReviews";
import { productKeys } from "./useQueryProducts";

/**
 * Uma avaliação nova/editada/excluída muda listas, resumo, minhas avaliações
 * e também a nota média/total que vem pronta na listagem e no detalhe do produto.
 */
export const invalidateAfterReviewChange = () =>
  Promise.all([
    queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
    queryClient.invalidateQueries({ queryKey: productKeys.all }),
    queryClient.invalidateQueries({ queryKey: ["product"] }),
  ]);

export const useMutationReview = () =>
  useMutation({
    mutationFn: (dto: CreateReviewDto) => ReviewsService.create(dto),
    onSuccess: () => invalidateAfterReviewChange(),
  });

export const useMutationUpdateReview = () =>
  useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: UpdateReviewDto }) => ReviewsService.update(id, dto),
    onSuccess: () => invalidateAfterReviewChange(),
  });

export const useMutationDeleteReview = () =>
  useMutation({
    mutationFn: (id: number) => ReviewsService.remove(id),
    onSuccess: () => invalidateAfterReviewChange(),
  });
