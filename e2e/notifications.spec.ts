import { REAL_API, expect, test } from "./support/test";

test.describe("Notificações", () => {
  test.use({ loggedIn: true });

  test("sino com contador, abrir notificação leva ao link e marca como lida", async ({ page }) => {
    test.skip(REAL_API, "marca notificações como lidas: só com a API mockada");
    await page.goto("/");
    const bell = page.getByRole("button", { name: "Notificações, 2 não lidas" });
    await expect(bell).toBeVisible();
    await bell.click();
    const panel = page.getByRole("region", { name: "Notificações recentes" });
    await expect(panel.getByText("Sua avaliação recebeu uma resposta", { exact: true })).toBeVisible();
    await panel.getByRole("button", { name: /^Não lida: Sua avaliação recebeu uma resposta/ }).click();
    await expect(page).toHaveURL(/\/products\/cafeteira-express#review-2$/);
    await expect(page.locator("#review-2")).toBeFocused();
    await expect(page.getByRole("button", { name: "Notificações, 1 não lida" })).toBeVisible();
  });

  test("página /notificacoes: filtro, marcar uma e marcar todas", async ({ page }) => {
    test.skip(REAL_API, "marca notificações como lidas: só com a API mockada");
    await page.goto("/notificacoes");
    await expect(page.getByRole("heading", { level: 1, name: "Notificações" })).toBeVisible();
    await expect(page.getByText("Você tem 2 notificações não lidas.")).toBeVisible();
    await page.getByRole("button", { name: /Não lidas/ }).click();
    await expect(page).toHaveURL(/filter=unread/);
    await expect(page.getByRole("list", { name: "Suas notificações" }).getByRole("listitem")).toHaveCount(2);
    await page.getByRole("button", { name: /Marcar como lida.*Sua avaliação foi útil/ }).click();
    await expect(page.getByText("Você tem 1 notificação não lida.")).toBeVisible();
    await page.getByRole("button", { name: "Marcar todas como lidas" }).click();
    await expect(page.getByText("Você está em dia com tudo.")).toBeVisible();
    await expect(page.getByRole("button", { name: "Notificações, nenhuma não lida" })).toBeVisible();
  });

  test("preferências: desativa os e-mails", async ({ page, api }) => {
    test.skip(REAL_API, "altera preferências: só com a API mockada");
    await page.goto("/preferencias");
    const toggle = page.getByRole("switch", { name: "Receber notificações por e-mail" });
    await expect(toggle).toHaveAttribute("aria-checked", "true");
    await toggle.click();
    await expect(toggle).toHaveAttribute("aria-checked", "false");
    expect(api.preferences.emailNotifications).toBe(false);
  });

  test("API real: o sino e a página carregam com a sessão salva", async ({ page }) => {
    test.skip(!REAL_API, "só com E2E_REAL_API=1");
    await page.goto("/notificacoes");
    await expect(page.getByRole("heading", { level: 1, name: "Notificações" })).toBeVisible();
    await expect(page.getByRole("button", { name: /^Notificações, / })).toBeVisible();
  });
});
