import { REAL_API, expect, test } from "./support/test";

test.describe("Perfil público", () => {
  test("o nome do autor leva ao perfil com estatísticas e avaliações", async ({ page }) => {
    test.skip(REAL_API, "usa as fixtures");
    await page.goto("/products/cafeteira-express");
    await page.locator("#review-12").getByRole("link", { name: /Ana Souza/ }).click();
    await expect(page).toHaveURL(/\/u\/ana$/);
    await expect(page.getByRole("heading", { level: 1, name: "Ana Souza" })).toBeVisible();
    await expect(page.getByText("@ana")).toBeVisible();
    await expect(page.getByText(/Membro desde setembro de 2026/)).toBeVisible();
    await expect(page.getByText("marcações de útil recebidas")).toBeVisible();
    await expect(page.getByRole("heading", { name: "Ótimo café" })).toBeVisible();
    await expect(page).toHaveTitle("Ana Souza (@ana) | ReviewStore");
  });

  test("perfil inexistente mostra o estado vazio", async ({ page }) => {
    await page.goto("/u/ninguem-por-aqui-123");
    await expect(page.getByRole("heading", { level: 1, name: "Perfil não encontrado" })).toBeVisible();
  });

  test("API real: perfil do usuário de teste", async ({ page }) => {
    test.skip(!REAL_API, "só com E2E_REAL_API=1");
    await page.goto("/u/usuario");
    await expect(page.getByRole("heading", { level: 1, name: "Usuário Teste" })).toBeVisible();
  });
});
