import { z } from "zod";

export const TITLE_MAX = 100;
/** A coluna `description` da tabela review é CHAR(255). */
export const DESCRIPTION_MAX = 255;

export const SchemaCreateReview = z.object({
  note: z
    .number({ invalid_type_error: "Selecione uma nota de 1 a 5 estrelas." })
    .int()
    .min(1, { message: "Selecione uma nota de 1 a 5 estrelas." })
    .max(5, { message: "A nota máxima é 5." }),
  title: z
    .string()
    .trim()
    .min(3, { message: "O título precisa ter pelo menos 3 caracteres." })
    .max(TITLE_MAX, { message: `O título pode ter no máximo ${TITLE_MAX} caracteres.` }),
  description: z
    .string()
    .trim()
    .min(10, { message: "Conte um pouco mais: escreva pelo menos 10 caracteres." })
    .max(DESCRIPTION_MAX, { message: `A avaliação pode ter no máximo ${DESCRIPTION_MAX} caracteres.` }),
});
