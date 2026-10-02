import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/site/services/products.service";
import type { ProductListParams } from "@/shared/types/product";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => ["products", params] as const,
  bySlug: (slug: string) => ["product", slug] as const,
};

export const productsQueryOptions = (params: ProductListParams) =>
  queryOptions({
    queryKey: productKeys.list(params),
    queryFn: () => ProductsService.list(params),
  });

export const productBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: productKeys.bySlug(slug),
    queryFn: () => ProductsService.getBySlug(slug),
  });

/** Lista paginada. `enabled` permite esperar um id (ex.: da categoria) antes de buscar. */
export const useQueryProducts = (params: ProductListParams, options: { enabled?: boolean } = {}) =>
  useQuery({
    ...productsQueryOptions(params),
    enabled: options.enabled ?? true,
    placeholderData: keepPreviousData,
  });

/** Ranking: maior nota média primeiro, só produtos com avaliação. */
export const rankingParams = (params: Omit<ProductListParams, "sort" | "onlyRated">): ProductListParams => ({
  ...params,
  sort: "rating",
  onlyRated: true,
});

export const useQueryProductBySlug = (slug: string) =>
  useQuery({
    ...productBySlugQueryOptions(slug),
    enabled: !!slug,
  });
