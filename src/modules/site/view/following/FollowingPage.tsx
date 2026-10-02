import { useFollowingModel } from "./following.model";
import { FollowingView } from "./following.view";

const FollowingPage = () => {
  const methods = useFollowingModel();
  return <FollowingView {...methods} />;
};

export default FollowingPage;
