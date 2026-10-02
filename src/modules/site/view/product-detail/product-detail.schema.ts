import { z } from "zod";

export const REVIEW_SORT_VALUES = ["recent", "oldest", "highest", "lowest", "helpful"] as const;

/** Parâmetros de busca da URL de /products/$slug (valores inválidos são ignorados). */
export const SchemaProductDetailSearch = z.object({
  /** Página da lista de avaliações, base 1 (a API usa base 0) */
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  /** Filtra as avaliações por nota exata */
  note: z.coerce.number().int().min(1).max(5).optional().catch(undefined),
  /** Ordenação das avaliações */
  sort: z.enum(REVIEW_SORT_VALUES).optional().catch(undefined),
});
