import { useReportReviewModel } from "./report-review.model";
import { ReportReviewView } from "./report-review.view";
import type { ReportReviewProps } from "./report-review.type";

export const ReportReview = (props: ReportReviewProps) => {
  const methods = useReportReviewModel(props);
  return <ReportReviewView {...methods} />;
};
