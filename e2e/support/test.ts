import { test as base, expect, type Page } from "@playwright/test";
import { createState, mockApi, type MockState } from "./mock-api";

export const REAL_API = process.env.E2E_REAL_API === "1";

interface Fixtures {
  /** Estado da API falsa (null contra a API real) */
  api: MockState;
  /** Começa já logado como "usuario" (na API real, a sessão do globalSetup) */
  loggedIn: boolean;
  /** Erros de JavaScript da página: o teste falha se houver algum */
  jsErrors: string[];
}

export const test = base.extend<Fixtures>({
  loggedIn: [false, { option: true }],
  // auto: a API falsa vale para todos os testes, mesmo os que não usam o estado
  api: [async ({ page, loggedIn }, use) => {
    const state = createState({ loggedIn });
    if (!REAL_API) await mockApi(page, state);
    // Fontes externas não importam para os fluxos e deixam os testes mais lentos
    await page.route(/fonts\.(googleapis|gstatic)\.com/, (route) => route.abort());
    await page.addInitScript(() => {
      // Esconde o botão do TanStack Router Devtools (só existe em dev)
      const style = document.createElement("style");
      style.textContent = 'button[aria-label="Open TanStack Router Devtools"]{display:none!important}';
      document.addEventListener("DOMContentLoaded", () => document.head.appendChild(style));
    });
    await use(state);
  }, { auto: true }],
  jsErrors: [
    async ({ page }, use) => {
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await use(errors);
      expect(errors, "erros de JavaScript na página").toEqual([]);
    },
    { auto: true },
  ],
});

export { expect };

/** Faz login pelo formulário (só com a API mockada: a real tem limite de 5 logins/min). */
export const signIn = async (page: Page) => {
  await page.getByLabel("E-mail ou nome de usuário").fill("usuario");
  await page.getByLabel("Senha", { exact: true }).fill("Usuario@123");
  await page.getByRole("button", { name: "Entrar", exact: true }).click();
};
