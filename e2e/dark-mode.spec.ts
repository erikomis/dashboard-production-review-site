import { expect, test } from "./support/test";

test.describe("Modo escuro", () => {
  test("segue o sistema, alterna manualmente, persiste e não pisca ao recarregar", async ({ page }) => {
    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/");
    await expect(page.locator("html")).toHaveClass(/dark/);

    const toggle = page.getByRole("button", { name: "Tema escuro" }).first();
    await expect(toggle).toHaveAttribute("aria-pressed", "true");
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    expect(await page.evaluate(() => localStorage.getItem("reviewstore-theme"))).toBe("light");

    await toggle.click();
    await page.emulateMedia({ colorScheme: "light" });
    // Sem "flash": a classe já está no <html> quando o <body> começa a ser lido (script inline do
    // index.html), antes de qualquer CSS/JS do app
    await page.addInitScript(() => {
      new MutationObserver((_, observer) => {
        if (document.body) {
          (window as unknown as { __darkAtBody: boolean }).__darkAtBody = document.documentElement.classList.contains("dark");
          observer.disconnect();
        }
      }).observe(document, { childList: true, subtree: true });
    });
    await page.reload();
    expect(await page.evaluate(() => (window as unknown as { __darkAtBody: boolean }).__darkAtBody)).toBe(true);
    await expect(page.locator("body")).toHaveCSS("background-color", "rgb(11, 17, 32)");
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("telas principais no tema escuro sem erros", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("reviewstore-theme", "dark"));
    for (const url of ["/", "/products", "/ranking", "/login", "/u/ana"]) {
      await page.goto(url);
      await expect(page.locator("html")).toHaveClass(/dark/);
      await expect(page.locator("main")).toBeVisible();
    }
  });
});
