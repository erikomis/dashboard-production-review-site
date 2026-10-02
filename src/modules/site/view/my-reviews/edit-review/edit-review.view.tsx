import { AlertCircle, Info } from "lucide-react";
import { StarRatingInput } from "@/modules/site/components/StarRatingInput";
import { PhotoPicker } from "@/modules/site/components/photo-picker/PhotoPicker";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Textarea } from "@/shared/components/textarea";
import { useEditReviewModel } from "./edit-review.model";

type EditReviewViewProps = ReturnType<typeof useEditReviewModel>;

export const EditReviewView = ({
  review,
  isHidden,
  register,
  handleSubmit,
  onSubmit,
  errors,
  note,
  onNoteChange,
  descriptionLength,
  titleMax,
  descriptionMax,
  photos,
  isPending,
  isSyncingPhotos,
  serverError,
  onCancel,
}: EditReviewViewProps) => (
  <form noValidate onSubmit={handleSubmit(onSubmit)} aria-busy={isPending}>
    {isHidden && (
      <p className="mb-5 flex items-start gap-2 rounded-lg bg-canvas px-4 py-3 text-sm text-ink-soft">
        <Info aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0 text-brand-700" />
        Editar não muda a moderação: esta avaliação continua oculta para outras pessoas.
      </p>
    )}

    <StarRatingInput
      name={`edit-note-${review.id}`}
      legend="Sua nota"
      value={note}
      onChange={onNoteChange}
      error={errors.note?.message}
    />

    <Input
      {...register("title")}
      label="Título"
      maxLength={titleMax}
      autoComplete="off"
      error={errors.title?.message}
    />

    <Textarea
      {...register("description")}
      label="Sua avaliação"
      rows={5}
      maxLength={descriptionMax}
      counter={`${descriptionLength}/${descriptionMax} caracteres`}
      error={errors.description?.message}
    />

    <PhotoPicker photos={photos} disabled={isPending} />

    <p className="sr-only" role="status" aria-live="polite">
      {isSyncingPhotos ? "Salvando as fotos…" : ""}
    </p>

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
      <Button type="submit" loading={isPending}>
        {isSyncingPhotos ? "Salvando fotos…" : isPending ? "Salvando…" : "Salvar alterações"}
      </Button>
    </div>
  </form>
);
