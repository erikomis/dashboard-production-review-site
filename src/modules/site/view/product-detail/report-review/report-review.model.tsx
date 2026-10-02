import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { markReportedInCache, useMutationReport } from "@/modules/site/hooks/useMutationReport";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError, isRateLimited } from "@/shared/services/http-error";
import { REPORT_DETAILS_MAX, REPORT_REASONS, SchemaReportReview } from "./report-review.schema";
import type { ReportReviewProps, ReportReviewValues } from "./report-review.type";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 401) return "Sua sessão expirou. Entre novamente para denunciar.";
    if (error.status === 400) return error.message || "Você não pode denunciar a sua própria avaliação.";
    if (error.status === 404) return "Esta avaliação não está mais disponível.";
    if (isRateLimited(error)) return error.message;
    if (error.status && error.status >= 500) return "O servidor não conseguiu registrar a denúncia. Tente novamente.";
    return error.message;
  }
  return "Não foi possível enviar a denúncia. Tente novamente.";
};

export const useReportReviewModel = ({ review, onCancel, onReported, onPendingChange }: ReportReviewProps) => {
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ReportReviewValues>({
    resolver: zodResolver(SchemaReportReview),
    defaultValues: { reason: undefined, details: "" },
  });
  const { mutateAsync: report, isPending } = useMutationReport();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const detailsLength = watch("details")?.length ?? 0;
  const reason = watch("reason");

  const onSubmit: SubmitHandler<ReportReviewValues> = async (data) => {
    if (isPending) return;
    setServerError(undefined);
    try {
      await report({ id: review.id, dto: { reason: data.reason, details: data.details } });
      onReported({ ...review, reportedByMe: true });
    } catch (er) {
      if (er instanceof HttpError && er.status === 409) {
        // Já havia denunciado (ex.: em outra aba): mostra o estado "denunciada"
        markReportedInCache(review.id);
        onReported({ ...review, reportedByMe: true });
        return;
      }
      if (er instanceof HttpError && er.status === 401) await queryClient.resetQueries({ queryKey: ["me"] });
      setServerError(getErrorMessage(er));
    }
  };

  return {
    review,
    reasons: REPORT_REASONS,
    reason,
    register,
    handleSubmit,
    onSubmit,
    errors,
    detailsLength,
    detailsMax: REPORT_DETAILS_MAX,
    isPending,
    serverError,
    onCancel,
  };
};
