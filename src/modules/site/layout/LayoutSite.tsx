import { useLayoutSiteModel } from "./layout-site.model";
import { LayoutSiteView } from "./layout-site.view";

export const LayoutSite = () => {
  const methods = useLayoutSiteModel();
  return <LayoutSiteView {...methods} />;
};
