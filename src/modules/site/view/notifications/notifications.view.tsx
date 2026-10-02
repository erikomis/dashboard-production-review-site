import { Link } from "@tanstack/react-router";
import { BellOff, CheckCheck, Settings } from "lucide-react";
import { Breadcrumb } from "@/modules/site/components/Breadcrumb";
import { NotificationItem } from "@/modules/site/components/NotificationItem";
import { Pagination } from "@/modules/site/components/Pagination";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { EmptyState, ErrorState } from "@/shared/components/state";
import { pluralize } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";
import { useNotificationsModel } from "./notifications.model";

type NotificationsViewProps = ReturnType<typeof useNotificationsModel>;

const tabClass = (active: boolean) =>
  cn(
    "inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-semibold transition-colors",
    active ? "bg-ink text-surface" : "text-ink-soft hover:bg-surface hover:text-ink",
  );

export const NotificationsView = ({
  notifications,
  page,
  totalPages,
  totalElements,
  unreadCount,
  unreadOnly,
  isLoading,
  isFetching,
  isError,
  error,
  refetch,
  onPageChange,
  onFilterChange,
  onMarkRead,
  onMarkAllRead,
  isMarkingAll,
  pendingReadId,
  onOpen,
  headingRef,
  announcement,
}: NotificationsViewProps) => (
  <div className="container-page py-8 sm:py-10">
    <Breadcrumb items={[{ label: "Notificações" }]} />

    <div className="mt-5 flex max-w-3xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 ref={headingRef} tabIndex={-1} className="text-3xl font-bold text-ink focus:outline-none sm:text-4xl">
          Notificações
        </h1>
        <p className="mt-2 text-muted">
          {unreadCount > 0
            ? `Você tem ${pluralize(unreadCount, "notificação não lida", "notificações não lidas")}.`
            : "Você está em dia com tudo."}
        </p>
      </div>
      <div className="flex flex-wrap gap-2">
        <Button color="outline" size="sm" onClick={onMarkAllRead} disabled={unreadCount === 0} loading={isMarkingAll}>
          <CheckCheck aria-hidden="true" className="h-4 w-4" />
          Marcar todas como lidas
        </Button>
        <Link to="/preferencias" className={buttonVariants({ color: "ghost", size: "sm" })}>
          <Settings aria-hidden="true" className="h-4 w-4" />
          E-mails
        </Link>
      </div>
    </div>

    <div role="group" aria-label="Filtrar notificações" className="mt-6 inline-flex gap-1 rounded-full border border-line bg-canvas p-1">
      <button type="button" aria-pressed={!unreadOnly} onClick={() => onFilterChange("all")} className={tabClass(!unreadOnly)}>
        Todas
      </button>
      <button type="button" aria-pressed={unreadOnly} onClick={() => onFilterChange("unread")} className={tabClass(unreadOnly)}>
        Não lidas
        {unreadCount > 0 && (
          <span className={cn("rounded-full px-1.5 text-xs", unreadOnly ? "bg-surface/20" : "bg-tint text-brand-800")}>{unreadCount}</span>
        )}
      </button>
    </div>

    <p className="sr-only" role="status" aria-live="polite">
      {isLoading ? "" : `${pluralize(totalElements, "notificação", "notificações")}${unreadOnly ? " não lidas" : ""}`}
    </p>
    <p className="sr-only" aria-live="polite">
      {announcement}
    </p>

    <div className="mt-6 max-w-3xl">
      {isError ? (
        <ErrorState message={error?.message ?? "Não conseguimos carregar suas notificações."} onRetry={() => refetch()} />
      ) : isLoading ? (
        <div className="space-y-3" aria-hidden="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton h-24 rounded-xl" />
          ))}
        </div>
      ) : notifications.length === 0 ? (
        <EmptyState
          icon={<BellOff />}
          title={unreadOnly ? "Nenhuma notificação não lida" : "Nenhuma notificação ainda"}
          description="Avisamos aqui quando alguém achar sua avaliação útil, quando a equipe responder ou quando um produto que você segue receber uma avaliação nova."
          action={
            unreadOnly ? (
              <Button color="outline" onClick={() => onFilterChange("all")}>
                Ver todas
              </Button>
            ) : (
              <Link to="/products" className={buttonVariants()}>
                Explorar produtos
              </Link>
            )
          }
        />
      ) : (
        <ul aria-label="Suas notificações" aria-busy={isFetching} className={cn("space-y-3 transition-opacity", isFetching && "opacity-70")}>
          {notifications.map((notification) => (
            <li key={notification.id}>
              <NotificationItem
                notification={notification}
                onOpen={onOpen}
                onMarkRead={onMarkRead}
                pending={pendingReadId === notification.id}
              />
            </li>
          ))}
        </ul>
      )}
      <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} label="Paginação das notificações" className="mt-8" />
    </div>
  </div>
);
