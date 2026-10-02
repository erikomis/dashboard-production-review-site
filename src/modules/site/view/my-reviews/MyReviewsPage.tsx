import { useMyReviewsModel } from "./my-reviews.model";
import { MyReviewsView } from "./my-reviews.view";

const MyReviewsPage = () => {
  const methods = useMyReviewsModel();
  return <MyReviewsView {...methods} />;
};

export default MyReviewsPage;
