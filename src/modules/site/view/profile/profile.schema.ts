import { z } from "zod";

/** Página exibida ao usuário, base 1 (a API usa base 0). */
export const SchemaProfileSearch = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
});
