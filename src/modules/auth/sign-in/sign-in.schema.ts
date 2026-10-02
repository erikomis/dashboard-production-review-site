import { z } from "zod";

export const SchemaSignIn = z.object({
  // A API aceita username OU e-mail no campo `username`
  username: z.string().trim().min(1, { message: "Informe seu e-mail ou nome de usuário." }),
  password: z.string().min(1, { message: "Informe sua senha." }),
});

export const SchemaSignInSearch = z.object({
  redirect: z.string().optional().catch(undefined),
});
