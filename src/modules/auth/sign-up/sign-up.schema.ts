import { z } from "zod";

export const SchemaSignUp = z.object({
  name: z.string().min(2, { message: "Nome precisa ter no mínimo 2 caracteres" }),
  username: z
    .string()
    .min(3, { message: "Username precisa ter no mínimo 3 caracteres" })
    .regex(/^[a-z0-9_]+$/, { message: "Apenas letras minúsculas, números e _" }),
  email: z.string().email({ message: "E-mail inválido" }),
  password: z.string().min(6, { message: "Senha precisa ter no mínimo 6 caracteres" }),
});
