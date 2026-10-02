import { z } from "zod";
import { PRODUCT_SORT_VALUES } from "@/modules/site/constants/product-sort";

/** Parâmetros de busca da URL de /categorias/$slug (valores inválidos são ignorados). */
export const SchemaCategorySearch = z.object({
  /** id da subcategoria (filtro opcional) */
  sub: z.coerce.number().int().positive().optional().catch(undefined),
  sort: z.enum(PRODUCT_SORT_VALUES).optional().catch(undefined),
  /** Página exibida ao usuário, base 1 (a API usa base 0) */
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
