import { z } from "zod";

/** Parâmetros de busca da URL de /products/$slug. */
export const SchemaProductDetailSearch = z.object({
  /** Página da lista de avaliações, base 1 (a API usa base 0) */
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
