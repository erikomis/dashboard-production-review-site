import { REAL_API, expect, test } from "./support/test";

test.describe("Home → busca com autocompletar → produto", () => {
  test("sugere produtos a partir de 2 letras e abre o escolhido pelo teclado", async ({ page, api }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { level: 1, name: /Opiniões reais/ })).toBeVisible();

    const search = page.getByRole("combobox", { name: "Buscar produtos" }).first();
    await search.click();
    await search.pressSequentially("c");
    await page.waitForTimeout(400);
    if (!REAL_API) expect(api.calls.some((c) => c.path === "/production/suggest")).toBe(false);

    await search.pressSequentially(REAL_API ? "af" : "afe");
    const listbox = page.getByRole("listbox", { name: "Sugestões de produtos" });
    await expect(listbox).toBeVisible();
    await expect(search).toHaveAttribute("aria-expanded", "true");
    const options = listbox.getByRole("option");
    await expect(options.first()).toBeVisible();
    if (!REAL_API) {
      await expect(options).toHaveCount(2);
      await expect(options.first()).toContainText("Cafeteira Express");
      await expect(options.first()).toContainText("Bebidas");
    }

    await search.press("ArrowDown");
    const firstId = await options.first().getAttribute("id");
    await expect(search).toHaveAttribute("aria-activedescendant", firstId!);
    const name = (await options.first().locator("span.block").first().textContent())!.trim();
    await search.press("Enter");

    await expect(page).toHaveURL(/\/products\/[^/]+$/);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(name);
    await expect(page).toHaveTitle(`${name} | ReviewStore`);
  });

  test("Esc fecha a lista e Enter busca no catálogo", async ({ page }) => {
    await page.goto("/");
    const search = page.getByRole("combobox", { name: "Buscar produtos" }).first();
    await search.fill("cafe");
    await expect(page.getByRole("listbox")).toBeVisible();
    await search.press("Escape");
    await expect(search).toHaveAttribute("aria-expanded", "false");
    await search.press("Enter");
    await expect(page).toHaveURL(/\/products\?q=cafe/);
  });

  test("a página do produto publica SEO e JSON-LD", async ({ page }) => {
    test.skip(REAL_API, "usa o produto das fixtures");
    await page.goto("/products/cafeteira-express");
    await expect(page.getByRole("heading", { level: 1, name: "Cafeteira Express" })).toBeVisible();
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute("href", /\/products\/cafeteira-express$/);
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute("content", "Cafeteira Express | ReviewStore");
    await expect(page.locator('meta[name="description"]')).toHaveAttribute("content", /Nota 4,5 de 5/);
    const jsonLd = JSON.parse((await page.locator("#seo-jsonld").textContent())!);
    expect(jsonLd["@type"]).toBe("Product");
    expect(jsonLd.aggregateRating).toMatchObject({ "@type": "AggregateRating", ratingValue: 4.5, reviewCount: 2 });
    expect(jsonLd.review[0]).toMatchObject({ "@type": "Review", author: { name: "Ana Souza" } });
  });
});
