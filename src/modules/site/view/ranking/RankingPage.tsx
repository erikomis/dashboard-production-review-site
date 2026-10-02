import { useRankingModel } from "./ranking.model";
import { RankingView } from "./ranking.view";

const RankingPage = () => {
  const methods = useRankingModel();
  return <RankingView {...methods} />;
};

export default RankingPage;
