import { Link } from "@tanstack/react-router";
import { Bell, BellOff, CheckCheck, Settings } from "lucide-react";
import { NotificationItem } from "@/modules/site/components/NotificationItem";
import { cn } from "@/shared/utils/utils";
import type { useNotificationBellModel } from "./notification-bell.model";

type NotificationBellViewProps = ReturnType<typeof useNotificationBellModel>;

const badgeText = (count: number) => (count > 9 ? "9+" : String(count));

export const NotificationBellView = ({
  enabled,
  panelId,
  open,
  toggle,
  close,
  containerRef,
  buttonRef,
  unreadCount,
  ringKey,
  announcement,
  notifications,
  isLoadingList,
  isErrorList,
  refetchList,
  onMarkRead,
  onMarkAllRead,
  isMarkingAll,
  pendingReadId,
  onOpenNotification,
}: NotificationBellViewProps) => {
  if (!enabled) return null;
  const label =
    unreadCount === 0
      ? "Notificações, nenhuma não lida"
      : `Notificações, ${unreadCount} ${unreadCount === 1 ? "não lida" : "não lidas"}`;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={buttonRef}
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={label}
        className="relative flex h-11 w-11 items-center justify-center rounded-full text-ink-soft transition-colors hover:bg-canvas hover:text-ink aria-expanded:bg-canvas aria-expanded:text-ink"
      >
        <Bell key={ringKey} aria-hidden="true" className={cn("h-5 w-5", ringKey > 0 && "motion-safe:animate-bell-ring")} />
        {unreadCount > 0 && (
          <span
            aria-hidden="true"
            className="absolute right-1 top-1 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-danger-solid px-1 text-[0.7rem] font-bold leading-none text-white ring-2 ring-surface motion-safe:animate-pop-in"
          >
            {badgeText(unreadCount)}
          </span>
        )}
      </button>
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>

      <div
        id={panelId}
        hidden={!open}
        role="region"
        aria-label="Notificações recentes"
        className="fixed inset-x-3 top-[4.25rem] z-50 overflow-hidden rounded-2xl border border-line bg-surface shadow-raised motion-safe:animate-fade-in sm:absolute sm:inset-x-auto sm:right-0 sm:top-full sm:mt-2 sm:w-[24rem]"
      >
        <div className="flex items-center justify-between gap-3 border-b border-line px-4 py-3">
          <h2 className="font-sans text-base font-semibold text-ink">Notificações</h2>
          <button
            type="button"
            onClick={onMarkAllRead}
            disabled={unreadCount === 0 || isMarkingAll}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2.5 text-sm font-semibold text-brand-700 hover:bg-tint disabled:cursor-not-allowed disabled:text-muted disabled:hover:bg-transparent"
          >
            <CheckCheck aria-hidden="true" className="h-4 w-4" />
            Marcar todas como lidas
          </button>
        </div>
        <div className="max-h-[min(26rem,calc(100dvh-10rem))] overflow-y-auto p-1.5">
          {isErrorList ? (
            <div className="px-4 py-6 text-center text-sm text-ink-soft">
              Não foi possível carregar as notificações.{" "}
              <button type="button" onClick={() => refetchList()} className="link">
                Tentar novamente
              </button>
            </div>
          ) : isLoadingList ? (
            <div className="space-y-2 p-2" aria-hidden="true">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex gap-3">
                  <div className="skeleton h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="skeleton h-3.5 w-3/4" />
                    <div className="skeleton h-3 w-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center px-4 py-8 text-center">
              <span aria-hidden="true" className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-tint text-brand-700">
                <BellOff className="h-6 w-6" />
              </span>
              <p className="text-sm font-semibold text-ink">Tudo em dia por aqui</p>
              <p className="mt-1 text-sm text-muted">Avisamos quando alguém achar sua avaliação útil ou a equipe responder.</p>
            </div>
          ) : (
            <ul aria-label="Últimas notificações" className="space-y-0.5">
              {notifications.map((notification) => (
                <li key={notification.id}>
                  <NotificationItem
                    notification={notification}
                    onOpen={onOpenNotification}
                    onMarkRead={onMarkRead}
                    pending={pendingReadId === notification.id}
                    compact
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="flex items-center justify-between gap-2 border-t border-line px-4 py-2.5 text-sm">
          <Link to="/notificacoes" onClick={close} className="link">
            Ver todas as notificações
          </Link>
          <Link
            to="/preferencias"
            onClick={close}
            className="inline-flex h-9 items-center gap-1.5 rounded-lg px-2 font-medium text-ink-soft hover:bg-canvas hover:text-ink"
          >
            <Settings aria-hidden="true" className="h-4 w-4" />
            Preferências
          </Link>
        </div>
      </div>
    </div>
  );
};
