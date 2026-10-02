import { BadgeCheck, BellRing, Check, Eye, EyeOff, ThumbsUp } from "lucide-react";
import type { AppNotification, NotificationType } from "@/shared/types/notification";
import { formatDateTime, formatRelative } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";

const TYPE_STYLES: Record<NotificationType, { icon: typeof Eye; className: string; label: string }> = {
  REVIEW_HIDDEN: { icon: EyeOff, className: "bg-danger-soft text-danger", label: "Avaliação ocultada" },
  REVIEW_RESTORED: { icon: Eye, className: "bg-success-soft text-success", label: "Avaliação restaurada" },
  REVIEW_HELPFUL: { icon: ThumbsUp, className: "bg-tint text-brand-700", label: "Marcação de útil" },
  REVIEW_REPLIED: { icon: BadgeCheck, className: "bg-tint text-brand-700", label: "Resposta da equipe" },
  FOLLOWED_PRODUCT_REVIEW: { icon: BellRing, className: "bg-cream text-ink", label: "Produto seguido" },
};

interface NotificationItemProps {
  notification: AppNotification;
  /** Abre o link (e marca como lida) */
  onOpen: (notification: AppNotification) => void;
  onMarkRead: (notification: AppNotification) => void;
  /** Versão do painel do sino (mais compacta) */
  compact?: boolean;
  pending?: boolean;
}

/** Linha de notificação: ícone pelo tipo, título, mensagem, data relativa e "marcar como lida". */
export const NotificationItem = ({ notification, onOpen, onMarkRead, compact, pending }: NotificationItemProps) => {
  const style = TYPE_STYLES[notification.type] ?? TYPE_STYLES.REVIEW_HELPFUL;
  const Icon = style.icon;
  const unread = !notification.read;
  return (
    <div
      className={cn(
        "group relative flex items-start gap-3 rounded-xl transition-colors",
        compact ? "px-2.5 py-2.5" : "border border-line bg-surface p-4 shadow-card sm:p-5",
        unread && (compact ? "bg-tint/60" : "border-brand-300/60 dark:border-brand-300/30"),
        "hover:bg-canvas",
      )}
    >
      <span aria-hidden="true" className={cn("mt-0.5 flex shrink-0 items-center justify-center rounded-full", compact ? "h-9 w-9" : "h-11 w-11", style.className)}>
        <Icon className={compact ? "h-4 w-4" : "h-5 w-5"} />
      </span>
      <button
        type="button"
        onClick={() => onOpen(notification)}
        className="min-w-0 flex-1 rounded-md text-left after:absolute after:inset-0 after:rounded-xl after:content-[''] focus-visible:outline-none focus-visible:after:outline focus-visible:after:outline-[3px] focus-visible:after:outline-offset-1 focus-visible:after:outline-[var(--focus-ring)]"
      >
        <span className="sr-only">{unread ? "Não lida:" : ""}</span>{" "}
        <span className={cn("block text-sm text-ink", unread ? "font-semibold" : "font-medium")}>{notification.title}</span>{" "}
        <span className={cn("mt-0.5 block text-sm text-ink-soft", compact && "line-clamp-2")}>{notification.message}</span>{" "}
        <span className="mt-1 block text-xs text-muted">
          <span className="sr-only">{style.label} · </span>
          <time dateTime={notification.createdAt} title={formatDateTime(notification.createdAt)}>
            {formatRelative(notification.createdAt)}
          </time>
        </span>
      </button>
      {unread ? (
        <button
          type="button"
          onClick={() => onMarkRead(notification)}
          disabled={pending}
          className={cn(
            "relative z-10 flex shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-tint hover:text-brand-700 disabled:opacity-50",
            compact ? "h-9 w-9" : "h-10 gap-1.5 px-3 text-sm font-semibold",
          )}
        >
          <Check aria-hidden="true" className="h-4 w-4" />
          <span className={compact ? "sr-only" : "sr-only sm:not-sr-only"}>Marcar como lida</span>
          <span className="sr-only">: {notification.title}</span>
        </button>
      ) : (
        !compact && <span className="mt-1 shrink-0 text-xs font-medium text-muted">Lida</span>
      )}
      {unread && (
        <span aria-hidden="true" className="absolute left-1 top-1 h-2 w-2 rounded-full bg-primary dark:bg-brand-300" />
      )}
    </div>
  );
};
