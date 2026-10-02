import { z } from "zod";

export const SchemaResetPassword = z
  .object({
    email: z.string().trim().email({ message: "Informe um e-mail válido, ex.: nome@email.com." }),
    recoveryCode: z
      .string()
      .trim()
      .regex(/^\d{6}$/, { message: "O código tem 6 dígitos numéricos." }),
    // A API aceita de 3 a 20 caracteres; exigimos no mínimo 6 por segurança
    password: z
      .string()
      .min(6, { message: "A senha precisa ter pelo menos 6 caracteres." })
      .max(20, { message: "A senha pode ter no máximo 20 caracteres." }),
    confirmPassword: z.string().min(1, { message: "Confirme a nova senha." }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem.",
    path: ["confirmPassword"],
  });

export const SchemaResetPasswordSearch = z.object({
  email: z.string().optional().catch(undefined),
});
