import { z } from "zod";

/** Parâmetros de busca da URL de /ranking (valores inválidos são ignorados). */
export const SchemaRankingSearch = z.object({
  /** id da categoria (filtro opcional) */
  cat: z.coerce.number().int().positive().optional().catch(undefined),
  /** Página exibida ao usuário, base 1 (a API usa base 0) */
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
