import { useNotificationsModel } from "./notifications.model";
import { NotificationsView } from "./notifications.view";

const NotificationsPage = () => {
  const methods = useNotificationsModel();
  return <NotificationsView {...methods} />;
};

export default NotificationsPage;
