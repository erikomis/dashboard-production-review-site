import { useMutation } from "@tanstack/react-query";
import { ProductsService } from "@/modules/site/services/products.service";
import { queryClient } from "@/shared/libs/react-query";
import type { ProductDetail } from "@/shared/types/product";
import { productKeys } from "./useQueryProducts";

export interface FollowVariables {
  productId: number;
  slug: string;
  /** Estado atual: true = vai deixar de seguir */
  following: boolean;
}

const patchProduct = (slug: string, patch: Pick<ProductDetail, "followedByMe" | "followersCount">) =>
  queryClient.setQueryData<ProductDetail | null>(productKeys.bySlug(slug), (old) => (old ? { ...old, ...patch } : old));

/** Seguir/deixar de seguir um produto, com atualização otimista do botão e do contador. */
export const useMutationFollow = () =>
  useMutation({
    mutationFn: ({ productId, following }: FollowVariables) =>
      following ? ProductsService.unfollow(productId) : ProductsService.follow(productId),
    onMutate: async ({ slug, following }) => {
      await queryClient.cancelQueries({ queryKey: productKeys.bySlug(slug) });
      const previous = queryClient.getQueryData<ProductDetail | null>(productKeys.bySlug(slug));
      if (previous) {
        patchProduct(slug, {
          followedByMe: !following,
          followersCount: Math.max(0, previous.followersCount + (following ? -1 : 1)),
        });
      }
      return { previous };
    },
    onError: (_error, { slug }, context) => {
      if (context?.previous) queryClient.setQueryData(productKeys.bySlug(slug), context.previous);
    },
    onSuccess: (result, { slug }) => {
      patchProduct(slug, { followedByMe: result.following, followersCount: result.followersCount });
      queryClient.invalidateQueries({ queryKey: ["following"] });
    },
  });
