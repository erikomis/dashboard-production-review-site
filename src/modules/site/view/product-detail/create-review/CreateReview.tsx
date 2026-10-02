import { useCreateReviewModel } from "./create-review.model";
import { CreateReviewView } from "./create-review.view";
import type { CreateReviewProps } from "./create-review.type";

export const CreateReview = (props: CreateReviewProps) => {
  const methods = useCreateReviewModel(props);
  return <CreateReviewView {...methods} />;
};
