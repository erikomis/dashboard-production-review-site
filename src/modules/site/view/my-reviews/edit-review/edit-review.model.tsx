import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invalidateAfterReviewChange, useMutationUpdateReview } from "@/modules/site/hooks/useMutationReview";
import {
  useMutationDeleteReviewImage,
  useMutationUploadReviewImage,
} from "@/modules/site/hooks/useReviewImages";
import { usePhotoPickerModel } from "@/modules/site/components/photo-picker/photo-picker.model";
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
  const photos = usePhotoPickerModel(review.images ?? []);

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

  const { mutateAsync: updateReview, isPending: isUpdating } = useMutationUpdateReview();
  const { mutateAsync: uploadImage } = useMutationUploadReviewImage();
  const { mutateAsync: deleteImage } = useMutationDeleteReviewImage();
  const [isSyncingPhotos, setIsSyncingPhotos] = useState(false);
  const isPending = isUpdating || isSyncingPhotos;

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
      if (photos.hasChanges) {
        setIsSyncingPhotos(true);
        const result = await photos.sync(
          (file, onProgress) => uploadImage({ reviewId: review.id, file, onProgress }),
          (imageId) => deleteImage({ reviewId: review.id, imageId }),
        );
        setIsSyncingPhotos(false);
        await invalidateAfterReviewChange();
        if (result.failed > 0) {
          // O texto foi salvo; mantém o diálogo aberto para a pessoa ver o que falhou
          setServerError(`O texto foi salvo, mas houve um problema com as fotos: ${result.firstError}`);
          return;
        }
      }
      onSaved({ ...review, ...data, ...updated });
    } catch (er) {
      setIsSyncingPhotos(false);
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
    photos,
    isPending,
    isSyncingPhotos,
    serverError,
    onCancel,
  };
};
