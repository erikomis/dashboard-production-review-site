import { useQuery } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";

export const useQueryReviews = (productId: string) =>
  useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => ReviewsService.listByProduct(productId),
    enabled: !!productId,
  });
