import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { ProductsService } from "@/modules/site/services/products.service";
import type { ProductListParams } from "@/shared/types/product";

export const productsQueryOptions = (params: ProductListParams) =>
  queryOptions({
    queryKey: ["products", params],
    queryFn: () => ProductsService.list(params),
  });

export const productBySlugQueryOptions = (slug: string) =>
  queryOptions({
    queryKey: ["product", slug],
    queryFn: () => ProductsService.getBySlug(slug),
  });

export const useQueryProducts = (params: ProductListParams) =>
  useQuery({
    ...productsQueryOptions(params),
    placeholderData: keepPreviousData,
  });

export const useQueryProductBySlug = (slug: string) =>
  useQuery({
    ...productBySlugQueryOptions(slug),
    enabled: !!slug,
  });
