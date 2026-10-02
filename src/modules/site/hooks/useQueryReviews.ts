import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import type { ProductReviewsParams } from "@/shared/types/review";

export const reviewKeys = {
  all: ["reviews"] as const,
  recent: (size: number) => ["reviews", "recent", size] as const,
  byProduct: (productId: number, params: ProductReviewsParams) =>
    ["reviews", "product", productId, params] as const,
  summary: (productId: number) => ["reviews", "summary", productId] as const,
  mine: ["reviews", "me"] as const,
  minePage: (page: number, size: number) => ["reviews", "me", page, size] as const,
};

export const useQueryReviewsByProduct = (productId: number | undefined, params: ProductReviewsParams) =>
  useQuery({
    queryKey: reviewKeys.byProduct(productId ?? 0, params),
    queryFn: () => ReviewsService.listByProduct(productId!, params),
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

/** Avaliações do usuário logado (inclui as ocultas pela moderação). */
export const useQueryMyReviews = (page: number, size: number, enabled = true) =>
  useQuery({
    queryKey: reviewKeys.minePage(page, size),
    queryFn: () => ReviewsService.listMine(page, size),
    enabled,
    placeholderData: keepPreviousData,
    // dados da conta: sempre confere ao abrir a página
    staleTime: 0,
  });
