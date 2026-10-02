import { z } from "zod";
import type { ReportReason } from "@/shared/types/review";

export const REPORT_DETAILS_MAX = 500;

export const REPORT_REASONS: { value: ReportReason; label: string; description: string }[] = [
  { value: "SPAM", label: "Spam ou propaganda", description: "Divulgação, links ou conteúdo repetido." },
  { value: "OFFENSIVE", label: "Conteúdo ofensivo", description: "Ofensas, discurso de ódio ou assédio." },
  {
    value: "FALSE_INFORMATION",
    label: "Informação falsa",
    description: "Afirmações enganosas ou que não condizem com o produto.",
  },
  { value: "OTHER", label: "Outro motivo", description: "Conte o que aconteceu no campo de detalhes." },
];

export const SchemaReportReview = z.object({
  reason: z.enum(["SPAM", "OFFENSIVE", "FALSE_INFORMATION", "OTHER"], {
    errorMap: () => ({ message: "Escolha o motivo da denúncia." }),
  }),
  details: z
    .string()
    .trim()
    .max(REPORT_DETAILS_MAX, { message: `Os detalhes podem ter no máximo ${REPORT_DETAILS_MAX} caracteres.` })
    .optional(),
});
