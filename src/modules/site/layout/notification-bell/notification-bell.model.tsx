import { useEffect, useId, useRef, useState } from "react";
import { useRouter } from "@tanstack/react-router";
import {
  useMutationMarkAllRead,
  useMutationMarkRead,
  useQueryNotifications,
  useQueryUnreadCount,
} from "@/modules/site/hooks/useNotifications";
import type { AppNotification } from "@/shared/types/notification";
import { safeRedirectPath } from "@/shared/utils/format";

export const BELL_PANEL_SIZE = 6;

/** Sino do header: contador com polling leve, painel com as últimas notificações e ações. */
export const useNotificationBellModel = ({ enabled }: { enabled: boolean }) => {
  const router = useRouter();
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState("");
  const [ringKey, setRingKey] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const countQuery = useQueryUnreadCount(enabled);
  const unreadCount = countQuery.data ?? 0;
  const listQuery = useQueryNotifications({ page: 0, size: BELL_PANEL_SIZE }, enabled && open);
  const markRead = useMutationMarkRead();
  const markAll = useMutationMarkAllRead();

  // Chegou notificação nova: anuncia (educadamente) e balança o sino
  const [lastCount, setLastCount] = useState<number | undefined>(undefined);
  if (countQuery.data !== undefined && countQuery.data !== lastCount) {
    if (lastCount !== undefined && countQuery.data > lastCount) {
      const diff = countQuery.data - lastCount;
      setAnnouncement(diff === 1 ? "Você tem 1 notificação nova." : `Você tem ${diff} notificações novas.`);
      setRingKey((k) => k + 1);
    }
    setLastCount(countQuery.data);
  }

  // Fecha com Esc (devolvendo o foco ao sino) e com clique fora
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  const onMarkRead = (notification: AppNotification) => {
    if (notification.read) return;
    markRead.mutate(notification.id);
    setAnnouncement(`“${notification.title}” marcada como lida.`);
  };

  const onMarkAllRead = () => {
    markAll.mutate(undefined, { onSuccess: () => setAnnouncement("Todas as notificações foram marcadas como lidas.") });
  };

  /** Clique na notificação: marca como lida e vai para o link (caminho do site). */
  const onOpenNotification = (notification: AppNotification) => {
    if (!notification.read) markRead.mutate(notification.id);
    setOpen(false);
    if (notification.link) router.history.push(safeRedirectPath(notification.link));
  };

  return {
    enabled,
    panelId,
    open,
    toggle: () => setOpen((v) => !v),
    close: () => setOpen(false),
    containerRef,
    buttonRef,
    unreadCount,
    ringKey,
    announcement,
    notifications: listQuery.data?.content ?? [],
    isLoadingList: listQuery.isPending,
    isErrorList: listQuery.isError,
    refetchList: listQuery.refetch,
    onMarkRead,
    onMarkAllRead,
    isMarkingAll: markAll.isPending,
    pendingReadId: markRead.isPending ? markRead.variables : undefined,
    onOpenNotification,
  };
};
