import { z } from "zod";

export const SchemaSignIn = z.object({
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha precisa ter no mínimo 6 caracteres" }),
});
