import { useId } from "react";
import { AlertCircle, Flag } from "lucide-react";
import { Button } from "@/shared/components/button";
import { FieldMessage } from "@/shared/components/field-message";
import { Textarea } from "@/shared/components/textarea";
import { cn } from "@/shared/utils/utils";
import { useReportReviewModel } from "./report-review.model";

type ReportReviewViewProps = ReturnType<typeof useReportReviewModel>;

export const ReportReviewView = ({
  reasons,
  reason,
  register,
  handleSubmit,
  onSubmit,
  errors,
  detailsLength,
  detailsMax,
  isPending,
  serverError,
  onCancel,
}: ReportReviewViewProps) => {
  const groupId = useId();
  const reasonError = errors.reason?.message;
  return (
    <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isPending}>
      <fieldset
        className="mb-5"
        aria-describedby={reasonError ? `${groupId}-message` : undefined}
        aria-invalid={reasonError ? true : undefined}
      >
        <legend className="mb-2 text-sm font-semibold text-ink">Motivo</legend>
        <div className="space-y-2">
          {reasons.map((option) => {
            const id = `${groupId}-${option.value}`;
            return (
              <div key={option.value}>
                <input
                  {...register("reason")}
                  id={id}
                  type="radio"
                  value={option.value}
                  aria-describedby={`${id}-desc`}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  className={cn(
                    "flex cursor-pointer items-start gap-3 rounded-xl border px-4 py-3 transition-colors",
                    "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]",
                    reason === option.value
                      ? "border-brand-600 bg-tint dark:border-brand-300"
                      : "border-line-strong/50 hover:border-ink",
                  )}
                >
                  <span
                    aria-hidden="true"
                    className={cn(
                      "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2",
                      reason === option.value ? "border-brand-600 dark:border-brand-300" : "border-line-strong",
                    )}
                  >
                    {reason === option.value && <span className="h-2.5 w-2.5 rounded-full bg-brand-600 dark:bg-brand-300" />}
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{option.label}</span>
                    <span id={`${id}-desc`} aria-hidden="true" className="block text-sm text-muted">
                      {option.description}
                    </span>
                  </span>
                </label>
              </div>
            );
          })}
        </div>
        <FieldMessage id={`${groupId}-message`} error={reasonError} />
      </fieldset>

      <Textarea
        {...register("details")}
        label="Detalhes (opcional)"
        rows={3}
        maxLength={detailsMax}
        counter={`${detailsLength}/${detailsMax} caracteres`}
        hint="Ajude a moderação: diga o que está errado nesta avaliação."
        error={errors.details?.message}
      />

      <div role="alert" className="empty:hidden">
        {serverError && (
          <p className="mb-4 flex items-start gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            {serverError}
          </p>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <Button color="outline" onClick={onCancel} disabled={isPending}>
          Cancelar
        </Button>
        <Button type="submit" color="danger" loading={isPending}>
          <Flag aria-hidden="true" className="h-4 w-4" />
          {isPending ? "Enviando…" : "Enviar denúncia"}
        </Button>
      </div>
    </form>
  );
};
