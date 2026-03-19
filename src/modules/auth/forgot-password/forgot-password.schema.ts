import { z } from "zod";

export const SchemaForgotPassword = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
});
