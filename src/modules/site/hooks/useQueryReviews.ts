import { keepPreviousData, useQueries, useQuery } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import type { ReviewSummary } from "@/shared/types/review";

export const reviewKeys = {
  all: ["reviews"] as const,
  recent: (size: number) => ["reviews", "recent", size] as const,
  byProduct: (productId: number, page: number, size: number) =>
    ["reviews", "product", productId, page, size] as const,
  summary: (productId: number) => ["reviews", "summary", productId] as const,
};

export const useQueryReviewsByProduct = (productId: number | undefined, page = 0, size = 10) =>
  useQuery({
    queryKey: reviewKeys.byProduct(productId ?? 0, page, size),
    queryFn: () => ReviewsService.listByProduct(productId!, page, size),
    enabled: !!productId,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

export const useQueryRecentReviews = (size = 6) =>
  useQuery({
    queryKey: reviewKeys.recent(size),
    queryFn: () => ReviewsService.listRecent(0, size),
    staleTime: 30_000,
  });

export const useQueryReviewSummary = (productId: number | undefined) =>
  useQuery({
    queryKey: reviewKeys.summary(productId ?? 0),
    queryFn: () => ReviewsService.getSummary(productId!),
    enabled: !!productId,
    staleTime: 30_000,
  });

/** Busca o resumo (média/total) de vários produtos em paralelo. */
export const useQueryReviewSummaries = (productIds: number[]) =>
  useQueries({
    queries: productIds.map((id) => ({
      queryKey: reviewKeys.summary(id),
      queryFn: () => ReviewsService.getSummary(id),
      staleTime: 30_000,
    })),
    combine: (results) => {
      const map: Record<number, ReviewSummary | undefined> = {};
      results.forEach((r, i) => {
        map[productIds[i]] = r.data;
      });
      return map;
    },
  });
