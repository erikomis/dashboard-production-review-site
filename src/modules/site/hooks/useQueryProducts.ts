import { keepPreviousData, queryOptions, useQuery } from "@tanstack/react-query";
import { ProductsService, SUGGEST_MIN_CHARS } from "@/modules/site/services/products.service";
import type { ProductListParams } from "@/shared/types/product";

export const productKeys = {
  all: ["products"] as const,
  list: (params: ProductListParams) => ["products", params] as const,
  bySlug: (slug: string) => ["product", slug] as const,
  suggest: (term: string) => ["products", "suggest", term] as const,
  following: (page: number, size: number) => ["following", page, size] as const,
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

/** Sugestões do autocompletar (só a partir de 2 caracteres; o termo já chega com debounce). */
export const useQuerySuggestions = (term: string) => {
  const q = term.trim();
  return useQuery({
    queryKey: productKeys.suggest(q.toLowerCase()),
    queryFn: ({ signal }) => ProductsService.suggest(q, 8, signal),
    enabled: q.length >= SUGGEST_MIN_CHARS,
    staleTime: 60_000,
    placeholderData: keepPreviousData,
    retry: false,
  });
};

/** Produtos que o usuário logado segue. */
export const useQueryFollowing = (page: number, size: number, enabled = true) =>
  useQuery({
    queryKey: productKeys.following(page, size),
    queryFn: () => ProductsService.listFollowing(page, size),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 0,
  });
