import { REAL_API, expect, test } from "./support/test";

test.describe("Mobile", () => {
  test.use({ loggedIn: true });

  test("menu com itens da conta e alternância de tema", async ({ page }) => {
    test.skip(REAL_API, "usa as fixtures");
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Notificações, 2 não lidas" })).toBeVisible();
    await page.getByRole("button", { name: "Abrir menu" }).click();
    const menu = page.locator("#mobile-menu");
    for (const name of ["Meu perfil público", "Minhas avaliações", "Seguindo", "Notificações", "Preferências"]) {
      await expect(menu.getByRole("link", { name: new RegExp(name) })).toBeVisible();
    }
    await menu.getByRole("button", { name: "Tema escuro" }).click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
