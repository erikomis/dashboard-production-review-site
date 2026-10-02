import { request, type FullConfig } from "@playwright/test";
import { existsSync, mkdirSync, statSync } from "node:fs";

/**
 * E2E_REAL_API=1: faz login UMA vez na API real e salva os cookies em e2e/.auth/user.json.
 * A sessão é reaproveitada por até 1 h (o sign-in aceita no máximo 5 tentativas por minuto).
 */
const STATE = "e2e/.auth/user.json";

export default async function globalSetup(config: FullConfig) {
  if (existsSync(STATE) && Date.now() - statSync(STATE).mtimeMs < 60 * 60 * 1000) return;
  mkdirSync("e2e/.auth", { recursive: true });
  const apiUrl = process.env.VITE_API_URL ?? "http://localhost:8084/api/v1";
  const baseURL = config.projects[0].use.baseURL ?? "http://localhost:5174";
  const ctx = await request.newContext();
  const res = await ctx.post(`${apiUrl}/auth/sign-in`, {
    data: { username: process.env.E2E_USER ?? "usuario", password: process.env.E2E_PASSWORD ?? "Usuario@123" },
    headers: { Origin: baseURL },
  });
  if (res.status() === 429) throw new Error(`Rate limit no login: ${(await res.json()).message}`);
  if (!res.ok()) throw new Error(`Falha no login da API real: ${res.status()}`);
  await ctx.storageState({ path: STATE });
  await ctx.dispose();
}
