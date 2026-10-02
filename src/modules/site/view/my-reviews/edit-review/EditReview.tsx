import { useEditReviewModel } from "./edit-review.model";
import { EditReviewView } from "./edit-review.view";
import type { EditReviewProps } from "./edit-review.type";

export const EditReview = (props: EditReviewProps) => {
  const methods = useEditReviewModel(props);
  return <EditReviewView {...methods} />;
};
