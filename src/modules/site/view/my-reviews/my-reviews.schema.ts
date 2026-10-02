import { z } from "zod";

/** Parâmetros de busca da URL de /minhas-avaliacoes. */
export const SchemaMyReviewsSearch = z.object({
  /** Página exibida ao usuário, base 1 (a API usa base 0) */
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
