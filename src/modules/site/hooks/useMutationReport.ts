import { useMutation } from "@tanstack/react-query";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import { queryClient } from "@/shared/libs/react-query";
import type { ReportReviewDto, ReviewPage } from "@/shared/types/review";
import { reviewKeys } from "./useQueryReviews";

const isReviewPage = (data: unknown): data is ReviewPage => !!data && Array.isArray((data as ReviewPage).content);

/** Marca a avaliação como denunciada em todas as listas em cache. */
export const markReportedInCache = (id: number) =>
  queryClient.setQueriesData<ReviewPage>({ queryKey: reviewKeys.all }, (old) =>
    isReviewPage(old)
      ? { ...old, content: old.content.map((r) => (r.id === id ? { ...r, reportedByMe: true } : r)) }
      : old,
  );

export const useMutationReport = () =>
  useMutation({
    mutationFn: ({ id, dto }: { id: number; dto: ReportReviewDto }) => ReviewsService.report(id, dto),
    onSuccess: (_report, { id }) => markReportedInCache(id),
  });
