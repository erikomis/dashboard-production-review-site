import { z } from "zod";

export const SchemaReview = z.object({
  title: z.string().min(3, { message: "Título precisa ter no mínimo 3 caracteres" }).max(100),
  content: z
    .string()
    .min(10, { message: "Escreva um pouco mais sobre o produto (min. 10 caracteres)" })
    .max(2000),
});
