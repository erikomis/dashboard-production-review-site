import { FormEvent, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQueryProducts } from "@/modules/site/hooks/useQueryProducts";
import { useQueryCategories } from "@/modules/site/hooks/useQueryCategories";
import { useQueryRecentReviews, useQueryReviewSummaries } from "@/modules/site/hooks/useQueryReviews";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export const FEATURED_SIZE = 6;
export const RECENT_REVIEWS_SIZE = 6;

export const useHomeModel = () => {
  useDocumentTitle();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");

  const productsQuery = useQueryProducts({ page: 0, size: FEATURED_SIZE, sort: "recent" });
  const categoriesQuery = useQueryCategories();
  const reviewsQuery = useQueryRecentReviews(RECENT_REVIEWS_SIZE);
  const { data: user } = useMeQuery();

  const products = useMemo(() => productsQuery.data?.content ?? [], [productsQuery.data]);
  const summaries = useQueryReviewSummaries(products.map((p) => p.id));

  const productSlugById = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p.slug])) as Record<number, string>,
    [products],
  );

  const recentReviews = reviewsQuery.data?.content ?? [];
  const highlightReview = recentReviews.find((r) => r.note >= 4) ?? recentReviews[0];

  const onSearchSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = searchTerm.trim();
    navigate({ to: "/products", search: q ? { q } : {} });
  };

  return {
    searchTerm,
    setSearchTerm,
    onSearchSubmit,
    isAuthenticated: !!user,

    products,
    summaries,
    totalProducts: productsQuery.data?.page.totalElements,
    isLoadingProducts: productsQuery.isPending,
    isErrorProducts: productsQuery.isError,
    refetchProducts: productsQuery.refetch,

    categories: categoriesQuery.data ?? [],
    isLoadingCategories: categoriesQuery.isPending,
    isErrorCategories: categoriesQuery.isError,
    refetchCategories: categoriesQuery.refetch,

    recentReviews,
    highlightReview,
    productSlugById,
    totalReviews: reviewsQuery.data?.page.totalElements,
    isLoadingReviews: reviewsQuery.isPending,
    isErrorReviews: reviewsQuery.isError,
    refetchReviews: reviewsQuery.refetch,
  };
};
