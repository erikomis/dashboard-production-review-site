import { useRef, useState } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";
import { toast } from "react-toastify";
import {
  useMutationMarkAllRead,
  useMutationMarkRead,
  useQueryNotifications,
  useQueryUnreadCount,
} from "@/modules/site/hooks/useNotifications";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import type { AppNotification } from "@/shared/types/notification";
import { safeRedirectPath } from "@/shared/utils/format";
import type { NotificationsSearch } from "./notifications.type";

export const NOTIFICATIONS_PAGE_SIZE = 15;

export const useNotificationsModel = () => {
  useDocumentTitle("Notificações", { noindex: true });
  const router = useRouter();
  const navigate = useNavigate();
  const search = useSearch({ from: "/site/notificacoes" });
  const page = (search.page ?? 1) - 1;
  const unreadOnly = search.filter === "unread";
  const headingRef = useRef<HTMLHeadingElement>(null);
  const [announcement, setAnnouncement] = useState("");

  const { data: user } = useMeQuery();
  const listQuery = useQueryNotifications({ page, size: NOTIFICATIONS_PAGE_SIZE, unreadOnly }, !!user);
  const countQuery = useQueryUnreadCount(!!user);
  const markRead = useMutationMarkRead();
  const markAll = useMutationMarkAllRead();

  const updateSearch = (next: Partial<NotificationsSearch>) =>
    navigate({
      to: "/notificacoes",
      search: (prev) => {
        const merged = { ...prev, ...next };
        return {
          page: merged.page && merged.page > 1 ? merged.page : undefined,
          filter: merged.filter,
        };
      },
      resetScroll: false,
    });

  const onPageChange = (nextPage: number) => {
    updateSearch({ page: nextPage + 1 });
    headingRef.current?.focus({ preventScroll: true });
    headingRef.current?.scrollIntoView({ block: "start" });
  };

  const onFilterChange = (filter: "all" | "unread") =>
    updateSearch({ filter: filter === "unread" ? "unread" : undefined, page: undefined });

  const onMarkRead = (notification: AppNotification) => {
    if (notification.read) return;
    markRead.mutate(notification.id, {
      onSuccess: () => setAnnouncement(`“${notification.title}” marcada como lida.`),
      onError: () => toast.error("Não foi possível marcar como lida. Tente novamente."),
    });
  };

  const onMarkAllRead = () =>
    markAll.mutate(undefined, {
      onSuccess: () => {
        setAnnouncement("Todas as notificações foram marcadas como lidas.");
        toast.success("Tudo lido!");
      },
      onError: () => toast.error("Não foi possível marcar todas como lidas. Tente novamente."),
    });

  const onOpen = (notification: AppNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    if (notification.link) router.history.push(safeRedirectPath(notification.link));
  };

  return {
    notifications: listQuery.data?.content ?? [],
    page,
    totalPages: listQuery.data?.page.totalPages ?? 0,
    totalElements: listQuery.data?.page.totalElements ?? 0,
    unreadCount: countQuery.data ?? 0,
    unreadOnly,
    isLoading: listQuery.isPending,
    isFetching: listQuery.isFetching,
    isError: listQuery.isError,
    error: listQuery.error,
    refetch: listQuery.refetch,
    onPageChange,
    onFilterChange,
    onMarkRead,
    onMarkAllRead,
    isMarkingAll: markAll.isPending,
    pendingReadId: markRead.isPending ? markRead.variables : undefined,
    onOpen,
    headingRef,
    announcement,
  };
};
