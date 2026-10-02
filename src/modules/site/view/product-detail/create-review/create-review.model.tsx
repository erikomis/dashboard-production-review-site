import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { useMutationReview } from "@/modules/site/hooks/useMutationReview";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError } from "@/shared/services/http-error";
import { SchemaCreateReview, DESCRIPTION_MAX, TITLE_MAX } from "./create-review.schema";
import type { CreateReviewProps, CreateReviewValues } from "./create-review.type";

type SubmitStatus = { type: "idle" } | { type: "success" } | { type: "error"; message: string; sessionExpired?: boolean };

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 401)
      return { message: "Sua sessão expirou. Entre novamente para publicar a avaliação.", sessionExpired: true };
    if (error.status === 403) return { message: "Você não tem permissão para avaliar este produto." };
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

  const { mutateAsync: createReview, isPending } = useMutationReview();

  const note = watch("note");
  const descriptionLength = watch("description")?.length ?? 0;

  const onNoteChange = (value: number) => {
    setValue("note", value, { shouldValidate: !!errors.note, shouldDirty: true });
  };

  const onSubmit: SubmitHandler<CreateReviewValues> = async (data) => {
    if (isPending) return;
    setStatus({ type: "idle" });
    try {
      await createReview({ ...data, productId });
      reset({ note: 0, title: "", description: "" });
      setStatus({ type: "success" });
      toast.success("Avaliação publicada! Obrigado por compartilhar.");
      onCreated?.();
    } catch (er) {
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
    isPending,
    status,
    dismissStatus: () => setStatus({ type: "idle" }),
  };
};
