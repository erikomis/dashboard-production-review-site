import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { invalidateAfterReviewChange, useMutationReview } from "@/modules/site/hooks/useMutationReview";
import { useMutationUploadReviewImage } from "@/modules/site/hooks/useReviewImages";
import { usePhotoPickerModel } from "@/modules/site/components/photo-picker/photo-picker.model";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError, isRateLimited } from "@/shared/services/http-error";
import { SchemaCreateReview, DESCRIPTION_MAX, TITLE_MAX } from "./create-review.schema";
import type { CreateReviewProps, CreateReviewValues } from "./create-review.type";

type SubmitStatus =
  | { type: "idle" }
  | { type: "success"; photoWarning?: string }
  | { type: "error"; message: string; sessionExpired?: boolean };

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 401)
      return { message: "Sua sessão expirou. Entre novamente para publicar a avaliação.", sessionExpired: true };
    if (error.status === 403) return { message: "Você não tem permissão para avaliar este produto." };
    // 429: a mensagem da API já traz o tempo de espera ("Tente novamente em N segundos.")
    if (isRateLimited(error)) return { message: error.message };
    if (error.status && error.status >= 500)
      return { message: "O servidor não conseguiu salvar sua avaliação. Tente novamente em instantes." };
    return { message: error.message };
  }
  return { message: "Não foi possível enviar sua avaliação. Tente novamente." };
};

export const useCreateReviewModel = ({
  productId,
  productName,
  isAuthenticated,
  loginRedirect,
  onCreated,
}: CreateReviewProps) => {
  const [status, setStatus] = useState<SubmitStatus>({ type: "idle" });
  const photos = usePhotoPickerModel();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateReviewValues>({
    resolver: zodResolver(SchemaCreateReview),
    defaultValues: { note: 0, title: "", description: "" },
  });

  const { mutateAsync: createReview, isPending: isCreating } = useMutationReview();
  const { mutateAsync: uploadImage } = useMutationUploadReviewImage();
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const isPending = isCreating || isUploadingPhotos;

  const note = watch("note");
  const descriptionLength = watch("description")?.length ?? 0;

  const onNoteChange = (value: number) => {
    setValue("note", value, { shouldValidate: !!errors.note, shouldDirty: true });
  };

  const onSubmit: SubmitHandler<CreateReviewValues> = async (data) => {
    if (isPending) return;
    setStatus({ type: "idle" });
    try {
      const created = await createReview({ ...data, productId });
      let photoWarning: string | undefined;
      if (photos.items.length > 0) {
        // A avaliação já existe: as fotos vão em seguida, uma por vez, com progresso
        setIsUploadingPhotos(true);
        const result = await photos.sync((file, onProgress) =>
          uploadImage({ reviewId: created.id, file, onProgress }),
        );
        setIsUploadingPhotos(false);
        await invalidateAfterReviewChange();
        if (result.failed > 0) {
          photoWarning = `Sua avaliação foi publicada, mas ${
            result.failed === 1 ? "uma foto não foi enviada" : `${result.failed} fotos não foram enviadas`
          }: ${result.firstError} Você pode adicioná-las depois em “Minhas avaliações”.`;
        }
      }
      reset({ note: 0, title: "", description: "" });
      photos.reset();
      setStatus({ type: "success", photoWarning });
      if (photoWarning) toast.warning("Avaliação publicada, mas algumas fotos não foram enviadas.");
      else toast.success("Avaliação publicada! Obrigado por compartilhar.");
      onCreated?.();
    } catch (er) {
      setIsUploadingPhotos(false);
      const { message, sessionExpired } = getErrorMessage(er);
      if (sessionExpired) await queryClient.resetQueries({ queryKey: ["me"] });
      setStatus({ type: "error", message, sessionExpired });
    }
  };

  return {
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
    titleMax: TITLE_MAX,
    descriptionMax: DESCRIPTION_MAX,
    photos,
    isPending,
    isUploadingPhotos,
    status,
    dismissStatus: () => setStatus({ type: "idle" }),
  };
};
