import { z } from "zod";
import { passwordPolicySchema } from "@/shared/validation/password";

export const SchemaResetPassword = z
  .object({
    email: z.string().trim().email({ message: "Informe um e-mail válido, ex.: nome@email.com." }),
    recoveryCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "O código tem 6 dígitos numéricos." }),
    // Mesma política da API: 8 a 72 caracteres, com letras e números
    password: passwordPolicySchema,
    confirmPassword: z.string().min(1, { message: "Confirme a nova senha." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const SchemaResetPasswordSearch = z.object({
  email: z.string().optional().catch(undefined),
});
