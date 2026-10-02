import { useRef, useState } from "react";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useQueryFollowing } from "@/modules/site/hooks/useQueryProducts";
import { useMutationFollow } from "@/modules/site/hooks/useMutationFollow";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { ProductSummary } from "@/shared/types/product";

export const FOLLOWING_PAGE_SIZE = 12;

export const useFollowingModel = () => {
  useDocumentTitle("Produtos que você segue", { noindex: true });
  const navigate = useNavigate();
  const search = useSearch({ from: "/site/seguindo" });
  const page = (search.page ?? 1) - 1;
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [announcement, setAnnouncement] = useState("");

  const { data: user } = useMeQuery();
  const query = useQueryFollowing(page, FOLLOWING_PAGE_SIZE, !!user);
  const followMutation = useMutationFollow();

  const products = query.data?.content ?? [];

  const goToPage = (nextPage: number) =>
    navigate({ to: "/seguindo", search: { page: nextPage > 0 ? nextPage + 1 : undefined }, resetScroll: false });

  const onPageChange = (nextPage: number) => {
    goToPage(nextPage);
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  };

  const onUnfollow = (product: ProductSummary) =>
    followMutation.mutate(
      { productId: product.id, slug: product.slug, following: true },
      {
        onSuccess: () => {
          setAnnouncement(`Você deixou de seguir ${product.name}.`);
          toast.success(`Você deixou de seguir ${product.name}.`);
          if (products.length === 1 && page > 0) goToPage(page - 1);
          headingRef.current?.focus({ preventScroll: true });
        },
        onError: () => toast.error("Não foi possível deixar de seguir. Tente novamente."),
      },
    );

  return {
    products,
    page,
    totalPages: query.data?.page.totalPages ?? 0,
    totalElements: query.data?.page.totalElements ?? 0,
    isLoading: query.isPending,
    isFetching: query.isFetching,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
    onPageChange,
    onUnfollow,
    pendingId: followMutation.isPending ? followMutation.variables?.productId : undefined,
    headingRef,
    announcement,
  };
};
