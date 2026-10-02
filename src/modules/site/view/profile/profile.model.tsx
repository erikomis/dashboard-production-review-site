import { useRef } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";
import { useQueryProfile } from "@/modules/site/hooks/useQueryProfile";
import { useQueryUserReviews } from "@/modules/site/hooks/useQueryReviews";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useSeo } from "@/shared/hooks/useSeo";
import { formatMonthYear, pluralize } from "@/shared/utils/format";

export const PROFILE_REVIEWS_PAGE_SIZE = 8;

export const useProfileModel = () => {
  const { username } = useParams({ from: "/site/u/$username" });
  const search = useSearch({ from: "/site/u/$username" });
  const navigate = useNavigate();
  const page = (search.page ?? 1) - 1;
  const reviewsHeadingRef = useRef<HTMLHeadingElement>(null);

  const { data: me } = useMeQuery();
  const profileQuery = useQueryProfile(username);
  const profile = profileQuery.data;
  const reviewsQuery = useQueryUserReviews(username, page, PROFILE_REVIEWS_PAGE_SIZE);

  useSeo({
    title: profile ? `${profile.name} (@${profile.username})` : profileQuery.isPending ? undefined : "Perfil não encontrado",
    description: profile
      ? `${profile.name} publicou ${pluralize(profile.reviewsCount, "avaliação", "avaliações")} no ReviewStore desde ${formatMonthYear(profile.memberSince)}.`
      : undefined,
    path: `/u/${username}`,
    type: "profile",
    noindex: !profileQuery.isPending && !profile,
  });

  const onPageChange = (nextPage: number) => {
    navigate({
      to: "/u/$username",
      params: { username },
      search: { page: nextPage > 0 ? nextPage + 1 : undefined },
      resetScroll: false,
    });
    reviewsHeadingRef.current?.focus({ preventScroll: true });
    reviewsHeadingRef.current?.scrollIntoView({ block: "start" });
  };

  return {
    username,
    profile,
    isOwnProfile: !!me && me.username === username,
    isLoadingProfile: profileQuery.isPending,
    isErrorProfile: profileQuery.isError,
    profileError: profileQuery.error,
    refetchProfile: profileQuery.refetch,

    reviews: reviewsQuery.data?.content ?? [],
    page,
    totalPages: reviewsQuery.data?.page.totalPages ?? 0,
    totalElements: reviewsQuery.data?.page.totalElements ?? 0,
    isLoadingReviews: reviewsQuery.isPending,
    isFetchingReviews: reviewsQuery.isFetching,
    isErrorReviews: reviewsQuery.isError,
    refetchReviews: reviewsQuery.refetch,
    onPageChange,
    reviewsHeadingRef,
  };
};
