import { useRef } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { rankingParams, useQueryProducts } from "@/modules/site/hooks/useQueryProducts";
import { useQueryCategories } from "@/modules/site/hooks/useQueryCategories";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { RankingSearch } from "./ranking.type";

export const RANKING_PAGE_SIZE = 20;

export const useRankingModel = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/site/ranking" });
  const page = (search.page ?? 1) - 1;
  const categoryId = search.cat;
  const resultsHeadingRef = useRef<HTMLHeadingElement>(null);

  const rankingQuery = useQueryProducts(rankingParams({ page, size: RANKING_PAGE_SIZE, categoryId }));
  const categoriesQuery = useQueryCategories();
  const categories = categoriesQuery.data ?? [];
  const activeCategory = categories.find((c) => c.id === categoryId);

  useDocumentTitle(activeCategory ? `Mais bem avaliados em ${activeCategory.name}` : "Mais bem avaliados");

  const updateSearch = (next: Partial<RankingSearch>) =>
    navigate({
      to: "/ranking",
      search: () => {
        const merged: RankingSearch = { ...search, ...next };
        return {
          cat: merged.cat || undefined,
          page: merged.page && merged.page > 1 ? merged.page : undefined,
        };
      },
      resetScroll: false,
    });

  const onCategoryChange = (id: number | undefined) => updateSearch({ cat: id, page: undefined });

  const onPageChange = (nextPage: number) => {
    updateSearch({ page: nextPage + 1 });
    resultsHeadingRef.current?.focus({ preventScroll: true });
    resultsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  return {
    page,
    categoryId,
    categories,
    activeCategory,
    onCategoryChange,
    onPageChange,
    products: rankingQuery.data?.content ?? [],
    /** Posição do primeiro item da página (base 1) */
    firstPosition: page * RANKING_PAGE_SIZE + 1,
    totalPages: rankingQuery.data?.page.totalPages ?? 0,
    totalElements: rankingQuery.data?.page.totalElements ?? 0,
    isLoading: rankingQuery.isPending,
    isFetching: rankingQuery.isFetching,
    isError: rankingQuery.isError,
    error: rankingQuery.error,
    refetch: rankingQuery.refetch,
    resultsHeadingRef,
  };
};
