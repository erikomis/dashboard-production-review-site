import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { NotificationsService } from "@/modules/site/services/notifications.service";
import { queryClient } from "@/shared/libs/react-query";
import type { NotificationListParams, NotificationPage } from "@/shared/types/notification";

/** Intervalo do polling leve do contador do sino. */
export const UNREAD_POLL_MS = 60_000;

export const notificationKeys = {
  all: ["notifications"] as const,
  unreadCount: ["notifications", "unread-count"] as const,
  list: (params: NotificationListParams) => ["notifications", "list", params] as const,
};

/** Contador de não lidas: busca a cada 60 s (só com a aba visível) e ao voltar o foco para a janela. */
export const useQueryUnreadCount = (enabled: boolean) =>
  useQuery({
    queryKey: notificationKeys.unreadCount,
    queryFn: NotificationsService.unreadCount,
    enabled,
    refetchInterval: UNREAD_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: "always",
    staleTime: 15_000,
    retry: false,
  });

export const useQueryNotifications = (params: NotificationListParams, enabled = true) =>
  useQuery({
    queryKey: notificationKeys.list(params),
    queryFn: () => NotificationsService.list(params),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 0,
    refetchOnWindowFocus: "always",
  });

const isNotificationPage = (data: unknown): data is NotificationPage =>
  !!data && Array.isArray((data as NotificationPage).content);

/** Marca como lidas nas listas em cache e ajusta o contador (atualização otimista). */
const markInCache = (ids: number[] | "all") => {
  queryClient.setQueriesData<NotificationPage>({ queryKey: [...notificationKeys.all, "list"] }, (old) => {
    if (!isNotificationPage(old)) return old;
    return {
      ...old,
      content: old.content.map((n) => {
        if (n.read || (ids !== "all" && !ids.includes(n.id))) return n;
        return { ...n, read: true };
      }),
    };
  });
  queryClient.setQueryData<number>(notificationKeys.unreadCount, (count) =>
    count === undefined ? count : ids === "all" ? 0 : Math.max(0, count - ids.length),
  );
};

const refresh = () => queryClient.invalidateQueries({ queryKey: notificationKeys.all });

/** Só chame para notificações ainda não lidas (o contador desce 1). */
export const useMutationMarkRead = () =>
  useMutation({
    mutationFn: (id: number) => NotificationsService.markRead(id),
    onMutate: (id) => markInCache([id]),
    onSettled: refresh,
  });

export const useMutationMarkAllRead = () =>
  useMutation({
    mutationFn: () => NotificationsService.markAllRead(),
    onMutate: () => markInCache("all"),
    onSettled: refresh,
  });
