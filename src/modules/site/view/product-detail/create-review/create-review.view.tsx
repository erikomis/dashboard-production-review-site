import { Link } from "@tanstack/react-router";
import { CheckCircle2, LockKeyhole, AlertCircle } from "lucide-react";
import { StarRatingInput } from "@/modules/site/components/StarRatingInput";
import { Button } from "@/shared/components/button";
import { buttonVariants } from "@/shared/components/button-variants";
import { Input } from "@/shared/components/input";
import { Textarea } from "@/shared/components/textarea";
import { useCreateReviewModel } from "./create-review.model";

type CreateReviewViewProps = ReturnType<typeof useCreateReviewModel>;

export const CreateReviewView = ({
  productName,
  isAuthenticated,
  loginRedirect,
  register,
  handleSubmit,
  onSubmit,
  errors,
  note,
  onNoteChange,
  descriptionLength,
  titleMax,
  descriptionMax,
  isPending,
  status,
}: CreateReviewViewProps) => {
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-start gap-4 rounded-2xl border border-line bg-surface p-6 shadow-card sm:flex-row sm:items-center sm:p-8">
        <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
          <LockKeyhole className="h-6 w-6" />
        </span>
        <div className="flex-1">
          <p className="text-lg font-semibold text-ink">Entre para avaliar {productName}</p>
          <p className="mt-1 text-sm text-muted">
            Você precisa estar logado para publicar uma avaliação. Depois de entrar, você volta direto para cá.
          </p>
        </div>
        <div className="flex w-full flex-wrap gap-2 sm:w-auto">
          <Link to="/login" search={{ redirect: loginRedirect }} className={buttonVariants({ className: "flex-1 sm:flex-none" })}>
            Entrar para avaliar
          </Link>
          <Link to="/sign-up" className={buttonVariants({ color: "outline", className: "flex-1 sm:flex-none" })}>
            Criar conta
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      noValidate
      onSubmit={handleSubmit(onSubmit)}
      aria-busy={isPending}
      className="rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-8"
    >
      <p className="mb-6 text-sm text-muted">
        Campos obrigatórios: nota, título e avaliação. Seja honesto e específico — isso ajuda outras pessoas.
      </p>

      <StarRatingInput
        name="note"
        legend="Sua nota"
        value={note}
        onChange={onNoteChange}
        error={errors.note?.message}
      />

      <Input
        {...register("title")}
        label="Título"
        placeholder="Resuma sua experiência em uma frase"
        maxLength={titleMax}
        autoComplete="off"
        error={errors.title?.message}
      />

      <Textarea
        {...register("description")}
        label="Sua avaliação"
        placeholder="O que você gostou? O que poderia ser melhor? Como foi o uso no dia a dia?"
        rows={5}
        maxLength={descriptionMax}
        counter={`${descriptionLength}/${descriptionMax} caracteres`}
        error={errors.description?.message}
      />

      {/* Mensagens assíncronas anunciadas por leitores de tela */}
      <div aria-live="polite" role="status" className="empty:hidden">
        {isPending && (
          <p className="mb-4 rounded-lg bg-brand-50 px-4 py-3 text-sm font-medium text-brand-800">
            Enviando sua avaliação… isso pode levar alguns segundos.
          </p>
        )}
        {!isPending && status.type === "success" && (
          <p className="mb-4 flex items-center gap-2 rounded-lg bg-success-soft px-4 py-3 text-sm font-medium text-success">
            <CheckCircle2 aria-hidden="true" className="h-4 w-4 shrink-0" />
            Avaliação publicada! Ela já aparece na lista acima.
          </p>
        )}
      </div>
      <div role="alert" className="empty:hidden">
        {!isPending && status.type === "error" && (
          <div className="mb-4 flex items-start gap-2 rounded-lg bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
            <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <span>
              {status.message}{" "}
              {status.sessionExpired && (
                <Link to="/login" search={{ redirect: loginRedirect }} className="underline underline-offset-2">
                  Entrar novamente
                </Link>
              )}
            </span>
          </div>
        )}
      </div>

      <Button type="submit" size="lg" loading={isPending} className="w-full sm:w-auto">
        {isPending ? "Enviando avaliação…" : "Publicar avaliação"}
      </Button>
    </form>
  );
};
