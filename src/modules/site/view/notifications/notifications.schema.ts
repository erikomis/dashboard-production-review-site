import { z } from "zod";

/** Parâmetros de /notificacoes: página (base 1) e filtro "não lidas". */
export const SchemaNotificationsSearch = z.object({
  page: z.coerce.number().int().min(1).optional().catch(undefined),
  filter: z.enum(["unread"]).optional().catch(undefined),
});
