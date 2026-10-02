import { z } from "zod";

export const SchemaForgotPassword = z.object({
  email: z.string().trim().email({ message: "Informe um e-mail válido, ex.: nome@email.com." }),
});
