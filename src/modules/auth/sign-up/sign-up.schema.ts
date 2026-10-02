import { z } from "zod";
import { passwordPolicySchema } from "@/shared/validation/password";

export const SchemaSignUp = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, { message: "Informe seu nome (mínimo 2 caracteres)." })
      .max(100, { message: "O nome pode ter no máximo 100 caracteres." }),
    username: z
      .string()
      .trim()
      .min(3, { message: "O nome de usuário precisa ter pelo menos 3 caracteres." })
      .max(30, { message: "O nome de usuário pode ter no máximo 30 caracteres." })
      .regex(/^[a-z0-9_.]+$/, { message: "Use apenas letras minúsculas, números, ponto e _." }),
    email: z.string().trim().email({ message: "Informe um e-mail válido, ex.: nome@email.com." }),
    // Mesma política da API: 8 a 72 caracteres, com letras e números
    password: passwordPolicySchema,
    confirmPassword: z.string().min(1, { message: "Confirme sua senha." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });
