import { useMutation } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import type { CreateReviewDto } from "@/shared/types/review";
import { reviewKeys } from "./useQueryReviews";

export const useMutationReview = () =>
  useMutation({
    mutationFn: (dto: CreateReviewDto) => ReviewsService.create(dto),
    onSuccess: () =>
      // lista do produto, resumo (média/total) e avaliações recentes da home
      queryClient.invalidateQueries({ queryKey: reviewKeys.all }),
  });
