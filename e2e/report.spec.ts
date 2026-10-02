import { REAL_API, expect, signIn, test } from "./support/test";

test.describe("Denunciar avaliação", () => {
  test.skip(REAL_API, "cria denúncias: só com a API mockada");

  test("sem login leva ao login e volta para a avaliação", async ({ page }) => {
    await page.goto("/products/cafeteira-express");
    await page.locator("#review-12").getByRole("button", { name: /Denunciar a avaliação de Ana Souza/ }).click();
    await expect(page).toHaveURL(/\/login\?redirect=%2Fproducts%2Fcafeteira-express%23review-12/);
    await signIn(page);
    await expect(page).toHaveURL(/\/products\/cafeteira-express#review-12$/);
  });

  test.describe("logado", () => {
    test.use({ loggedIn: true });

    test("escolhe o motivo, envia e mostra 'Denunciada'; não aparece na própria avaliação", async ({ page, api }) => {
      await page.goto("/products/cafeteira-express");
      const own = page.locator("#review-2");
      await expect(own.getByText("Sua avaliação")).toBeVisible();
      await expect(own.getByRole("button", { name: /Denunciar/ })).toHaveCount(0);

      const card = page.locator("#review-12");
      await expect(card.getByText("Resposta da equipe ReviewStore")).toBeVisible();
      await card.getByRole("button", { name: /Denunciar/ }).click();
      const dialog = page.getByRole("dialog", { name: "Denunciar avaliação" });
      await expect(dialog).toBeVisible();
      await dialog.getByRole("button", { name: "Enviar denúncia" }).click();
      await expect(dialog.getByText("Escolha o motivo da denúncia.")).toBeVisible();

      await dialog.getByText("Informação falsa").click();
      await dialog.getByLabel(/Detalhes/).fill("Não é o mesmo modelo do anúncio.");
      await dialog.getByRole("button", { name: "Enviar denúncia" }).click();
      await expect(dialog).toBeHidden();
      await expect(card.getByText("Denunciada")).toBeVisible();
      expect(api.reports).toEqual([{ reviewId: 12, reason: "FALSE_INFORMATION", details: "Não é o mesmo modelo do anúncio." }]);
    });
  });
});
