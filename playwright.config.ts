import { defineConfig, devices } from "@playwright/test";

/**
 * E2E do site.
 * - Padrão: API mockada com page.route (e2e/support/mock-api.ts) — roda no CI sem backend.
 * - E2E_REAL_API=1: usa a API real (VITE_API_URL do servidor do site) e reaproveita a sessão
 *   salva em e2e/.auth/user.json (login uma vez só: o sign-in tem limite de 5/min).
 * Localmente usa o Chrome instalado (channel "chrome"); no CI, o Chromium do Playwright.
 */
const PORT = Number(process.env.E2E_PORT ?? 5174);
const BASE_URL = process.env.E2E_BASE_URL ?? `http://localhost:${PORT}`;
const REAL_API = process.env.E2E_REAL_API === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: !REAL_API,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: REAL_API ? 1 : undefined,
  reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : [["list"]],
  globalSetup: REAL_API ? "./e2e/support/real-api-setup.ts" : undefined,
  use: {
    baseURL: BASE_URL,
    locale: "pt-BR",
    timezoneId: "America/Sao_Paulo",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    channel: process.env.CI ? undefined : "chrome",
    storageState: REAL_API ? "e2e/.auth/user.json" : undefined,
  },
  projects: [
    {
      name: "desktop",
      use: { ...devices["Desktop Chrome"], channel: process.env.CI ? undefined : "chrome" },
      testIgnore: /mobile\.spec\.ts/,
    },
    {
      name: "mobile",
      use: { ...devices["Pixel 7"], channel: process.env.CI ? undefined : "chrome" },
      testMatch: /mobile\.spec\.ts/,
    },
  ],
  webServer: {
    command: `npm run dev -- --port ${PORT} --strictPort`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { VITE_API_URL: process.env.VITE_API_URL ?? "http://localhost:8084/api/v1" },
  },
});
