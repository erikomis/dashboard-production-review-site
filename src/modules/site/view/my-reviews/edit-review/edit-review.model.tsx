import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutationUpdateReview } from "@/modules/site/hooks/useMutationReview";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError } from "@/shared/services/http-error";
import { DESCRIPTION_MAX, SchemaEditReview, TITLE_MAX } from "./edit-review.schema";
import type { EditReviewProps, EditReviewValues } from "./edit-review.type";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 401) return "Sua sessão expirou. Entre novamente para salvar a avaliação.";
    if (error.status === 403) return "Você não tem permissão para editar esta avaliação.";
    if (error.status === 404) return "Esta avaliação não existe mais.";
    if (error.status && error.status >= 500)
      return "O servidor não conseguiu salvar sua avaliação. Tente novamente em instantes.";
    return error.message;
  }
  return "Não foi possível salvar sua avaliação. Tente novamente.";
};

export const useEditReviewModel = ({ review, onCancel, onSaved, onPendingChange }: EditReviewProps) => {
  const [serverError, setServerError] = useState<string>();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isDirty },
  } = useForm<EditReviewValues>({
    resolver: zodResolver(SchemaEditReview),
    defaultValues: { note: review.note, title: review.title, description: review.description },
  });

  const { mutateAsync: updateReview, isPending } = useMutationUpdateReview();

  useEffect(() => {
    onPendingChange?.(isPending);
  }, [isPending, onPendingChange]);

  const note = watch("note");
  const descriptionLength = watch("description")?.length ?? 0;

  const onNoteChange = (value: number) =>
    setValue("note", value, { shouldValidate: !!errors.note, shouldDirty: true });

  const onSubmit: SubmitHandler<EditReviewValues> = async (data) => {
    if (isPending) return;
    setServerError(undefined);
    try {
      const updated = await updateReview({ id: review.id, dto: { ...data, productId: review.productId } });
      onSaved({ ...review, ...data, ...updated });
    } catch (er) {
      if (er instanceof HttpError && er.status === 401) await queryClient.resetQueries({ queryKey: ["me"] });
      setServerError(getErrorMessage(er));
    }
  };

  return {
    review,
    isHidden: review.status === "HIDDEN",
    register,
    handleSubmit,
    onSubmit,
    errors,
    isDirty,
    note,
    onNoteChange,
    descriptionLength,
    titleMax: TITLE_MAX,
    descriptionMax: DESCRIPTION_MAX,
    isPending,
    serverError,
    onCancel,
  };
};
