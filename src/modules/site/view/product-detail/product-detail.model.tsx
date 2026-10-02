import { useMemo, useRef, useState } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useQueryProductBySlug, useQueryProducts } from "@/modules/site/hooks/useQueryProducts";
import { useQueryReviewSummary, useQueryReviewsByProduct } from "@/modules/site/hooks/useQueryReviews";
import { useMutationHelpful, usePendingHelpfulIds } from "@/modules/site/hooks/useMutationHelpful";
import { useMutationFollow } from "@/modules/site/hooks/useMutationFollow";
import { useQuerySeoProduct } from "@/modules/site/hooks/useQuerySeo";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useSeo } from "@/shared/hooks/useSeo";
import { buildProductJsonLd } from "@/shared/utils/json-ld";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError } from "@/shared/services/http-error";
import type { RatingDistribution, Review, ReviewSort } from "@/shared/types/review";
import type { ProductDetailSearch, ReviewSortOption } from "./product-detail.type";

export const REVIEWS_PAGE_SIZE = 10;
export const RELATED_SIZE = 4;

export const REVIEW_SORT_OPTIONS: ReviewSortOption[] = [
  { value: "recent", label: "Mais recentes" },
  { value: "helpful", label: "Mais úteis" },
  { value: "highest", label: "Maior nota" },
  { value: "lowest", label: "Menor nota" },
  { value: "oldest", label: "Mais antigas" },
];

const EMPTY_DISTRIBUTION: RatingDistribution = { "1": 0, "2": 0, "3": 0, "4": 0, "5": 0 };

export const useProductDetailModel = () => {
  // A rota fica sob o layout de id "site": o id completo é "/site/products/$slug"
  const { slug } = useParams({ from: "/site/products/$slug" });
  const search = useSearch({ from: "/site/products/$slug" });
  const navigate = useNavigate();
  const reviewsPage = (search.page ?? 1) - 1;
  const noteFilter = search.note;
  const reviewSort: ReviewSort = search.sort ?? "recent";
  const reviewsHeadingRef = useRef<HTMLHeadingElement>(null);
  // Foto escolhida na galeria (volta para a primeira ao trocar de produto)
  const [imageChoice, setImageChoice] = useState({ slug, index: 0 });
  const selectedImage = imageChoice.slug === slug ? imageChoice.index : 0;
  const setSelectedImage = (index: number) => setImageChoice({ slug, index });
  const [helpfulAnnouncement, setHelpfulAnnouncement] = useState("");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [reportingReview, setReportingReview] = useState<Review | null>(null);
  const [isReporting, setIsReporting] = useState(false);

  const { data: user } = useMeQuery();
  const productQuery = useQueryProductBySlug(slug);
  const product = productQuery.data;
  const productId = product?.id;

  const summaryQuery = useQueryReviewSummary(productId);
  const reviewsQuery = useQueryReviewsByProduct(productId, {
    page: reviewsPage,
    size: REVIEWS_PAGE_SIZE,
    note: noteFilter,
    sort: reviewSort,
  });

  // "Outros produtos da mesma subcategoria", os mais bem avaliados primeiro
  const relatedQuery = useQueryProducts(
    { page: 0, size: RELATED_SIZE + 1, sort: "rating", subCategorieId: product?.subCategorieId },
    { enabled: !!product?.subCategorieId },
  );
  const relatedProducts = useMemo(
    () => (relatedQuery.data?.content ?? []).filter((p) => p.id !== productId).slice(0, RELATED_SIZE),
    [relatedQuery.data, productId],
  );

  const helpfulMutation = useMutationHelpful();
  const pendingHelpfulIds = usePendingHelpfulIds();

  const followMutation = useMutationFollow();
  const seoQuery = useQuerySeoProduct(slug);

  // SEO: título, descrição, canonical, Open Graph e JSON-LD Product/AggregateRating/Review
  useSeo({
    title: product ? product.name : productQuery.isPending ? undefined : "Produto não encontrado",
    description: product
      ? `${product.description} ${
          product.totalReviews
            ? `Nota ${product.averageNote?.toFixed(1).replace(".", ",")} de 5 em ${product.totalReviews} ${
                product.totalReviews === 1 ? "avaliação" : "avaliações"
              } no ReviewStore.`
            : "Veja e escreva avaliações no ReviewStore."
        }`
      : undefined,
    path: `/products/${slug}`,
    image: product?.imageUrl,
    type: product ? "product" : "website",
    noindex: !productQuery.isPending && !product,
    jsonLd: product && seoQuery.data ? buildProductJsonLd(seoQuery.data) : null,
  });

  // O detalhe traz só o id da categoria; o slug (para o link) vem da lista de categorias
  const categorySlug = product?.categorySlug ?? undefined;

  const images = useMemo(() => {
    if (!product) return [];
    if (product.images?.length) return product.images;
    return product.imageUrl ? [{ id: 0, urlImage: product.imageUrl }] : [];
  }, [product]);
  const currentImage = images[Math.min(selectedImage, Math.max(0, images.length - 1))];

  const summary = summaryQuery.data;
  const totalReviews = summary?.totalReviews ?? product?.totalReviews ?? 0;
  const averageNote = summary?.averageNote ?? product?.averageNote ?? 0;
  const distribution = summary?.distribution ?? EMPTY_DISTRIBUTION;

  const updateReviewSearch = (next: Partial<ProductDetailSearch>) =>
    navigate({
      to: "/products/$slug",
      params: { slug },
      search: () => {
        const merged: ProductDetailSearch = { ...search, ...next };
        return {
          page: merged.page && merged.page > 1 ? merged.page : undefined,
          note: merged.note || undefined,
          sort: merged.sort && merged.sort !== "recent" ? merged.sort : undefined,
        };
      },
      resetScroll: false,
    });

  const onReviewsPageChange = (nextPage: number) => {
    updateReviewSearch({ page: nextPage + 1 });
    reviewsHeadingRef.current?.focus({ preventScroll: true });
    reviewsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  const onNoteFilterChange = (note: number | undefined) => updateReviewSearch({ note, page: undefined });
  const onReviewSortChange = (value: string) =>
    updateReviewSearch({ sort: value as ReviewSort, page: undefined });
  const clearReviewFilters = () => updateReviewSearch({ note: undefined, sort: undefined, page: undefined });

  const loginRedirect = `/products/${slug}#avaliar`;

  const onToggleHelpful = (review: Review) => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/products/${slug}#avaliacoes` } });
      return;
    }
    const willMark = !review.helpfulByMe;
    setHelpfulAnnouncement("");
    helpfulMutation.mutate(review, {
      onSuccess: (result) =>
        setHelpfulAnnouncement(
          result.helpfulByMe
            ? `Você marcou “${review.title}” como útil.`
            : `Você removeu a marcação de útil de “${review.title}”.`,
        ),
      onError: async (error) => {
        if (error instanceof HttpError && error.status === 401) {
          await queryClient.resetQueries({ queryKey: ["me"] });
          toast.error("Sua sessão expirou. Entre novamente para marcar avaliações como úteis.");
          return;
        }
        toast.error(
          error instanceof HttpError && error.status && error.status < 500
            ? error.message
            : `Não foi possível ${willMark ? "marcar" : "desmarcar"} a avaliação como útil. Tente novamente.`,
        );
      },
    });
  };

  // Depois de publicar, mostra a lista sem filtros para a avaliação nova aparecer
  const onReviewCreated = () => {
    if (reviewsPage !== 0 || noteFilter || reviewSort !== "recent") clearReviewFilters();
  };

  const reviewsTotalElements = reviewsQuery.data?.page.totalElements ?? 0;

  // Seguir o produto: sem login, vai para o login e volta para cá
  const onToggleFollow = () => {
    if (!product) return;
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/products/${slug}` } });
      return;
    }
    const following = product.followedByMe;
    followMutation.mutate(
      { productId: product.id, slug, following },
      {
        onSuccess: (result) =>
          toast.success(
            result.following
              ? `Você está seguindo ${product.name}. Vamos avisar quando chegar uma avaliação nova.`
              : `Você deixou de seguir ${product.name}.`,
          ),
        onError: async (error) => {
          if (error instanceof HttpError && error.status === 401) {
            await queryClient.resetQueries({ queryKey: ["me"] });
            toast.error("Sua sessão expirou. Entre novamente para seguir produtos.");
            return;
          }
          toast.error(error instanceof HttpError && error.status && error.status < 500 ? error.message : "Não foi possível atualizar. Tente novamente.");
        },
      },
    );
  };

  // Denunciar: sem login, vai para o login e volta para a avaliação
  const openReport = (review: Review) => {
    if (!user) {
      navigate({ to: "/login", search: { redirect: `/products/${slug}#review-${review.id}` } });
      return;
    }
    setReportingReview(review);
  };

  const onReported = (review: Review) => {
    setReportingReview(null);
    setHelpfulAnnouncement(`Denúncia da avaliação “${review.title}” enviada.`);
    toast.success("Denúncia enviada. Obrigado por ajudar a manter as avaliações confiáveis.");
  };

  return {
    slug,
    product,
    isLoadingProduct: productQuery.isPending,
    isErrorProduct: productQuery.isError,
    productError: productQuery.error,
    refetchProduct: productQuery.refetch,
    categorySlug,

    images,
    currentImage,
    lightboxIndex,
    openLightbox: (index: number) => setLightboxIndex(index),
    closeLightbox: () => setLightboxIndex(null),
    setLightboxIndex,
    selectedImage,
    setSelectedImage,

    totalReviews,
    averageNote,
    distribution,
    isLoadingSummary: summaryQuery.isPending,

    reviews: reviewsQuery.data?.content ?? [],
    reviewsPage,
    reviewsTotalPages: reviewsQuery.data?.page.totalPages ?? 0,
    reviewsTotalElements,
    isLoadingReviews: reviewsQuery.isPending,
    isFetchingReviews: reviewsQuery.isFetching,
    isErrorReviews: reviewsQuery.isError,
    refetchReviews: reviewsQuery.refetch,
    onReviewsPageChange,
    reviewsHeadingRef,

    noteFilter,
    reviewSort,
    reviewSortOptions: REVIEW_SORT_OPTIONS,
    onNoteFilterChange,
    onReviewSortChange,
    clearReviewFilters,
    isReviewFiltered: !!noteFilter,

    helpful: {
      isAuthenticated: !!user,
      currentUserId: user?.id,
      pendingIds: pendingHelpfulIds,
      onToggle: onToggleHelpful,
    },
    helpfulAnnouncement,
    report: { currentUserId: user?.id, onReport: openReport },
    reportingReview,
    closeReport: () => {
      if (!isReporting) setReportingReview(null);
    },
    onReported,
    isReporting,
    onReportPendingChange: setIsReporting,

    following: product?.followedByMe ?? false,
    followersCount: product?.followersCount ?? 0,
    onToggleFollow,
    isFollowPending: followMutation.isPending,

    relatedProducts,
    isLoadingRelated: !!product?.subCategorieId && relatedQuery.isPending,

    isAuthenticated: !!user,
    loginRedirect,
    onReviewCreated,
  };
};
