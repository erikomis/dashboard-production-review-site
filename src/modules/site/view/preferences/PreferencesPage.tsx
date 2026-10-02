import { usePreferencesModel } from "./preferences.model";
import { PreferencesView } from "./preferences.view";

const PreferencesPage = () => {
  const methods = usePreferencesModel();
  return <PreferencesView {...methods} />;
};

export default PreferencesPage;
