import { REAL_API, expect, test } from "./support/test";

test.describe("Seguir produto", () => {
  test.skip(REAL_API, "altera follows: só com a API mockada");
  test.use({ loggedIn: true });

  test("segue no produto, aparece em /seguindo e deixa de seguir", async ({ page }) => {
    await page.goto("/products/cafeteira-express");
    const follow = page.getByRole("button", { name: /^Seguir Cafeteira Express/ });
    await expect(follow).toHaveAttribute("aria-pressed", "false");
    await expect(page.getByText("3 seguidores")).toBeVisible();
    await follow.click();
    await expect(page.getByRole("button", { name: /^Seguindo Cafeteira Express/ })).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText("4 seguidores")).toBeVisible();

    await page.getByRole("button", { name: /Conta de Usuário/ }).click();
    await page.getByRole("navigation", { name: "Sua conta" }).getByRole("link", { name: "Seguindo" }).click();
    await expect(page).toHaveURL(/\/seguindo$/);
    await expect(page.getByRole("heading", { level: 1, name: "Produtos que você segue" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Cafeteira Express" })).toBeVisible();

    await page.getByRole("button", { name: "Deixar de seguir Cafeteira Express" }).click();
    await expect(page.getByRole("heading", { name: "Você ainda não segue nenhum produto" })).toBeVisible();
  });
});
