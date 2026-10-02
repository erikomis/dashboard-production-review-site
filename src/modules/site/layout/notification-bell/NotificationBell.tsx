import { useNotificationBellModel } from "./notification-bell.model";
import { NotificationBellView } from "./notification-bell.view";

export const NotificationBell = ({ enabled }: { enabled: boolean }) => {
  const methods = useNotificationBellModel({ enabled });
  return <NotificationBellView {...methods} />;
};
