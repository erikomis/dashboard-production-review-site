import type { Page } from "./page";

export type NotificationType =
  | "REVIEW_HIDDEN"
  | "REVIEW_RESTORED"
  | "REVIEW_HELPFUL"
  | "REVIEW_REPLIED"
  | "FOLLOWED_PRODUCT_REVIEW";

/** Item de GET /notifications (mais recentes primeiro) */
export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  /** Caminho do site (ex.: "/products/smartphone-x#review-12") ou null */
  link: string | null;
  read: boolean;
  /** ISO-8601 em UTC */
  createdAt: string;
}

export type NotificationPage = Page<AppNotification>;

export interface NotificationListParams {
  page?: number;
  size?: number;
  unreadOnly?: boolean;
}
