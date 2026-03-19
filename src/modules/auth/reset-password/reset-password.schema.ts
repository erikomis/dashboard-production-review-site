import { z } from "zod";

export const SchemaResetPassword = z
  .object({
    email: z.string().email({ message: "E-mail inválido" }),
    recoveryCode: z.string().min(1, { message: "Código é obrigatório" }),
    password: z
      .string()
      .min(6, { message: "Senha precisa ter no mínimo 6 caracteres" }),
    confirmPassword: z.string().min(6, { message: "Confirme a senha" }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });
