import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { NotificationsService } from "@/modules/site/services/notifications.service";
import type { AppNotification } from "@/shared/types/notification";
import { NotificationBell } from "./NotificationBell";

const notifications: AppNotification[] = [
  {
    id: 1,
    type: "REVIEW_REPLIED",
    title: "Sua avaliação recebeu uma resposta",
    message: "A equipe ReviewStore respondeu à sua avaliação “Ok”.",
    link: "/products/smartphone-x#review-2",
    read: false,
    createdAt: new Date(Date.now() - 5 * 60_000).toISOString(),
  },
  {
    id: 2,
    type: "REVIEW_HELPFUL",
    title: "Sua avaliação foi útil",
    message: "2 pessoas acharam “Muito bom” útil.",
    link: "/products/smartphone-x#review-1",
    read: false,
    createdAt: new Date(Date.now() - 2 * 3600_000).toISOString(),
  },
];

const page = (content: AppNotification[]) => ({
  content,
  page: { size: 6, number: 0, totalElements: content.length, totalPages: 1 },
});

describe("NotificationBell", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.spyOn(NotificationsService, "unreadCount").mockResolvedValue(2);
    vi.spyOn(NotificationsService, "list").mockResolvedValue(page(notifications));
  });

  it("não aparece sem login", async () => {
    await renderWithProviders(<NotificationBell enabled={false} />);
    expect(screen.queryByRole("button", { name: /Notificações/ })).not.toBeInTheDocument();
    expect(NotificationsService.unreadCount).not.toHaveBeenCalled();
  });

  it("mostra o contador no nome acessível e abre o painel com a lista", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<NotificationBell enabled />);
    const bell = await screen.findByRole("button", { name: "Notificações, 2 não lidas" });
    expect(bell).toHaveAttribute("aria-expanded", "false");
    await user.click(bell);
    expect(bell).toHaveAttribute("aria-expanded", "true");
    const panel = screen.getByRole("region", { name: "Notificações recentes" });
    expect(await within(panel).findByText("Sua avaliação recebeu uma resposta")).toBeInTheDocument();
    expect(within(panel).getByText("há 5 minutos")).toBeInTheDocument();
  });

  it("marca uma como lida (contador desce) e marca todas", async () => {
    const markRead = vi.spyOn(NotificationsService, "markRead").mockResolvedValue();
    const markAll = vi.spyOn(NotificationsService, "markAllRead").mockResolvedValue();
    const user = userEvent.setup();
    await renderWithProviders(<NotificationBell enabled />);
    await user.click(await screen.findByRole("button", { name: /Notificações, 2/ }));
    vi.mocked(NotificationsService.unreadCount).mockResolvedValue(1);
    await user.click(await screen.findByRole("button", { name: "Marcar como lida: Sua avaliação foi útil" }));
    expect(markRead).toHaveBeenCalledWith(2);
    await waitFor(() => expect(markRead).toHaveBeenCalled());
    expect(await screen.findByRole("button", { name: "Notificações, 1 não lida" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Marcar todas como lidas" }));
    expect(markAll).toHaveBeenCalledTimes(1);
  });

  it("clicar na notificação marca como lida e leva ao link", async () => {
    const markRead = vi.spyOn(NotificationsService, "markRead").mockResolvedValue();
    const user = userEvent.setup();
    const { router } = await renderWithProviders(<NotificationBell enabled />);
    await user.click(await screen.findByRole("button", { name: /Notificações, 2/ }));
    await user.click(await screen.findByRole("button", { name: /^Não lida: Sua avaliação recebeu uma resposta/ }));
    expect(markRead).toHaveBeenCalledWith(1);
    await waitFor(() => expect(router.state.location.pathname).toBe("/products/smartphone-x"));
    expect(router.state.location.hash).toBe("review-2");
    expect(screen.getByRole("button", { name: /Notificações/ })).toHaveAttribute("aria-expanded", "false");
  });

  it("Esc fecha o painel e devolve o foco ao sino", async () => {
    const user = userEvent.setup();
    await renderWithProviders(<NotificationBell enabled />);
    const bell = await screen.findByRole("button", { name: /Notificações, 2/ });
    await user.click(bell);
    await user.keyboard("{Escape}");
    expect(bell).toHaveAttribute("aria-expanded", "false");
    expect(bell).toHaveFocus();
  });
});
