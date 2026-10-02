import { useMutation } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";

export interface UploadImageVariables {
  reviewId: number;
  file: File;
  onProgress?: (percent: number) => void;
}

/** Envia uma foto para a avaliação (as listas são atualizadas por quem chama, ao final do lote). */
export const useMutationUploadReviewImage = () =>
  useMutation({
    mutationFn: ({ reviewId, file, onProgress }: UploadImageVariables) =>
      ReviewsService.uploadImage(reviewId, file, onProgress),
  });

export const useMutationDeleteReviewImage = () =>
  useMutation({
    mutationFn: ({ reviewId, imageId }: { reviewId: number; imageId: number }) =>
      ReviewsService.deleteImage(reviewId, imageId),
  });
