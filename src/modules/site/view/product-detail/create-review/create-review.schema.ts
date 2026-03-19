import { z } from "zod";

export const SchemaCreateReview = z.object({
  title: z.string().min(3, { message: "Título precisa ter no mínimo 3 caracteres" }),
  content: z.string().min(10, { message: "Opinião precisa ter no mínimo 10 caracteres" }),
  rating: z
    .number({ invalid_type_error: "Selecione uma nota" })
    .min(1, { message: "Nota mínima é 1" })
    .max(5, { message: "Nota máxima é 5" }),
});
