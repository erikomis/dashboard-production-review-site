import { api } from "@/shared/services/api";
import { toHttpError } from "@/shared/services/http-error";
import type { NotificationListParams, NotificationPage } from "@/shared/types/notification";

export const NotificationsService = {
  /** GET /notifications — mais recentes primeiro. */
  list: async ({ page = 0, size = 10, unreadOnly }: NotificationListParams = {}): Promise<NotificationPage> => {
    try {
      const response = await api.request<NotificationPage>({
        url: "/notifications",
        method: "GET",
        params: { page, size, unreadOnly: unreadOnly || undefined },
      });
      return response.data;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** GET /notifications/unread-count → {count}. */
  unreadCount: async (): Promise<number> => {
    try {
      const response = await api.request<{ count: number }>({ url: "/notifications/unread-count", method: "GET" });
      return response.data.count;
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** PATCH /notifications/{id}/read */
  markRead: async (id: number): Promise<void> => {
    try {
      await api.request({ url: `/notifications/${id}/read`, method: "PATCH" });
    } catch (er) {
      throw toHttpError(er);
    }
  },

  /** PATCH /notifications/read-all */
  markAllRead: async (): Promise<void> => {
    try {
      await api.request({ url: "/notifications/read-all", method: "PATCH" });
    } catch (er) {
      throw toHttpError(er);
    }
  },
};
