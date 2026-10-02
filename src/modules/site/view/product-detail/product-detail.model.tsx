import { useMemo, useRef } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryProductBySlug } from "@/modules/site/hooks/useQueryProducts";
import { useQueryCategories } from "@/modules/site/hooks/useQueryCategories";
import { useQueryReviewSummary, useQueryReviewsByProduct } from "@/modules/site/hooks/useQueryReviews";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";

export const REVIEWS_PAGE_SIZE = 10;
/** Maior página aceita pela API; usada para calcular a distribuição das notas. */
export const DISTRIBUTION_SAMPLE_SIZE = 100;

export const useProductDetailModel = () => {
  // A rota fica sob o layout de id "site": o id completo é "/site/products/$slug"
  const { slug } = useParams({ from: "/site/products/$slug" });
  const search = useSearch({ from: "/site/products/$slug" });
  const navigate = useNavigate();
  const reviewsPage = (search.page ?? 1) - 1;
  const reviewsHeadingRef = useRef<HTMLHeadingElement>(null);

  const { data: user } = useMeQuery();
  const productQuery = useQueryProductBySlug(slug);
  const product = productQuery.data;
  const productId = product?.id;

  const { data: categories } = useQueryCategories();
  const summaryQuery = useQueryReviewSummary(productId);
  const reviewsQuery = useQueryReviewsByProduct(productId, reviewsPage, REVIEWS_PAGE_SIZE);
  const sampleQuery = useQueryReviewsByProduct(productId, 0, DISTRIBUTION_SAMPLE_SIZE);

  useDocumentTitle(product ? product.name : productQuery.isPending ? undefined : "Produto não encontrado");

  const subCategorieId = product?.subCategorieId;
  const category = (categories ?? []).find((c) => c.subCategories.some((s) => s.id === subCategorieId));
  const subCategory = category?.subCategories.find((s) => s.id === subCategorieId);

  // Distribuição das notas calculada a partir das avaliações carregadas
  const distribution = useMemo(() => {
    const sample = sampleQuery.data?.content ?? [];
    const counts = [0, 0, 0, 0, 0];
    sample.forEach((r) => {
      if (r.note >= 1 && r.note <= 5) counts[r.note - 1] += 1;
    });
    return { counts, sampleSize: sample.length };
  }, [sampleQuery.data]);

  const totalReviews = summaryQuery.data?.totalReviews ?? 0;
  const averageNote = summaryQuery.data?.averageNote ?? 0;

  const onReviewsPageChange = (nextPage: number) => {
    navigate({
      to: "/products/$slug",
      params: { slug },
      search: { page: nextPage > 0 ? nextPage + 1 : undefined },
      resetScroll: false,
    });
    reviewsHeadingRef.current?.focus({ preventScroll: true });
    reviewsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  // Depois de publicar, volta para a 1ª página para a avaliação nova aparecer
  const onReviewCreated = () => {
    if (reviewsPage !== 0) onReviewsPageChange(0);
  };

  return {
    slug,
    product,
    isLoadingProduct: productQuery.isPending,
    isErrorProduct: productQuery.isError,
    productError: productQuery.error,
    refetchProduct: productQuery.refetch,
    category,
    subCategory,

    totalReviews,
    averageNote,
    isLoadingSummary: summaryQuery.isPending,

    reviews: reviewsQuery.data?.content ?? [],
    reviewsPage,
    reviewsTotalPages: reviewsQuery.data?.page.totalPages ?? 0,
    isLoadingReviews: reviewsQuery.isPending,
    isFetchingReviews: reviewsQuery.isFetching,
    isErrorReviews: reviewsQuery.isError,
    refetchReviews: reviewsQuery.refetch,
    onReviewsPageChange,
    reviewsHeadingRef,

    distribution,
    isLoadingDistribution: sampleQuery.isPending,

    isAuthenticated: !!user,
    loginRedirect: `/products/${slug}#avaliar`,
    onReviewCreated,
  };
};
