import { z } from "zod";

export const SchemaActivateAccountParams = z.object({
  token: z.string().trim().min(1),
});
