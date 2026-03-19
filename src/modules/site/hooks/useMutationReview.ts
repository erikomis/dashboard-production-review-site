import { useMutation } from "@tanstack/react-query";
import { ReviewsService, CreateReviewDto } from "@/modules/site/services/reviews.service";
import { queryClient } from "@/shared/libs/react-query";

export const useMutationReview = (productId: string) =>
  useMutation({
    mutationFn: (dto: CreateReviewDto) => ReviewsService.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });
