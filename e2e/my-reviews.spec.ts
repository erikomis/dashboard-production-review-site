import { REAL_API, expect, test } from "./support/test";

test.describe("Minhas avaliações", () => {
  test.skip(REAL_API, "edita e exclui: só com a API mockada");
  test.use({ loggedIn: true });

  test("edita o texto e exclui uma avaliação", async ({ page, api }) => {
    await page.goto("/minhas-avaliacoes");
    await expect(page.getByRole("heading", { level: 1, name: "Minhas avaliações" })).toBeVisible();
    await expect(page.getByText("2 avaliações")).toBeVisible();

    await page.getByRole("button", { name: "Editar a avaliação “Ok”" }).click();
    const dialog = page.getByRole("dialog", { name: "Editar avaliação" });
    await dialog.getByLabel("Título").fill("Ok, mas esquenta");
    await dialog.getByRole("button", { name: "Salvar alterações" }).click();
    await expect(dialog).toBeHidden();
    await expect(page.getByRole("heading", { name: "Ok, mas esquenta" })).toBeVisible();
    expect(api.reviews.find((r) => r.id === 2)!.title).toBe("Ok, mas esquenta");

    await page.getByRole("button", { name: "Excluir a avaliação “Muito bom”" }).click();
    const confirm = page.getByRole("alertdialog", { name: "Excluir avaliação?" });
    await expect(confirm.getByRole("button", { name: "Cancelar" })).toBeFocused();
    await confirm.getByRole("button", { name: "Excluir avaliação" }).click();
    await expect(confirm).toBeHidden();
    await expect(page.getByRole("heading", { name: "Muito bom" })).toHaveCount(0);
    await expect(page.getByText("1 avaliação", { exact: true })).toBeVisible();
  });
});
