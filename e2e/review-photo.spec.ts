import path from "node:path";
import { fileURLToPath } from "node:url";
import { REAL_API, expect, signIn, test } from "./support/test";

const photo = path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "foto.jpg");

test.describe("Login → criar avaliação com foto", () => {
  test.skip(REAL_API, "cria dados: só com a API mockada");

  test("entra pelo produto, volta ao formulário e publica com foto", async ({ page, api }) => {
    await page.goto("/products/smartphone-x");
    await page.getByRole("link", { name: "Entrar para avaliar" }).click();
    await expect(page).toHaveURL(/\/login\?redirect=/);
    await signIn(page);

    await expect(page).toHaveURL(/\/products\/smartphone-x#avaliar$/);
    const form = page.locator("#avaliar form");
    await form.locator("label", { hasText: "5 de 5 estrelas" }).click();
    await expect(form.getByRole("radio", { name: "5 de 5 estrelas" })).toBeChecked();
    await form.getByLabel("Título").fill("Câmera excelente");
    await form.getByLabel("Sua avaliação").fill("Fotos noturnas muito boas e bateria para o dia inteiro.");

    // validação antes de enviar: tipo inválido é recusado
    await form.getByLabel(/Adicionar foto/).setInputFiles({ name: "nota.txt", mimeType: "text/plain", buffer: Buffer.from("x") });
    await expect(form.getByRole("alert")).toContainText("não é uma imagem JPEG, PNG ou WebP");
    await form.getByLabel(/Adicionar foto/).setInputFiles(photo);
    await expect(form.getByRole("img", { name: /Prévia da foto 1: foto\.jpg/ })).toBeVisible();

    await form.getByRole("button", { name: "Publicar avaliação" }).click();
    await expect(page.getByText("Avaliação publicada! Ela já aparece na lista acima.")).toBeVisible();

    const created = api.reviews.find((r) => r.title === "Câmera excelente")!;
    expect(created.images).toHaveLength(1);
    expect(api.calls.filter((c) => c.path === `/review/${created.id}/images`)).toHaveLength(1);

    const card = page.locator(`#review-${created.id}`);
    await expect(card).toContainText("Câmera excelente");
    await card.getByRole("button", { name: /Foto 1 de 1 enviada por Usuário Teste/ }).click();
    const lightbox = page.getByRole("dialog", { name: /Foto 1 de 1/ });
    await expect(lightbox).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(lightbox).toBeHidden();
  });
});
