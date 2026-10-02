import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HttpError, isRateLimited } from "@/shared/services/http-error";
import { useCooldown } from "@/shared/hooks/useCooldown";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { SchemaSignUp } from "./sign-up.schema";
import { SignUpValues } from "./sign-up.type";
import { useMutationSignUp } from "../hooks/useMutationSignUp";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 409) return "Já existe uma conta com esse e-mail ou nome de usuário.";
    return error.message;
  }
  return "Não foi possível criar a conta. Tente novamente.";
};

export const useSignUpModel = () => {
  useDocumentTitle("Criar conta");
  const [serverError, setServerError] = useState<string>();
  const cooldown = useCooldown();
  /** E-mail para o qual o link de ativação foi enviado (tela de sucesso) */
  const [createdEmail, setCreatedEmail] = useState<string>();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SchemaSignUp),
    defaultValues: { name: "", username: "", email: "", password: "", confirmPassword: "" },
  });

  const { mutateAsync: signUp, isPending } = useMutationSignUp();

  const onSubmit: SubmitHandler<SignUpValues> = async ({ name, username, email, password }) => {
    setServerError(undefined);
    try {
      await signUp({ name, username, email, password });
      setCreatedEmail(email);
    } catch (er) {
      setServerError(getErrorMessage(er));
      // 429: bloqueia o envio até acabar o tempo do Retry-After
      if (isRateLimited(er)) cooldown.start((er as HttpError).retryAfter ?? 60);
    }
  };

  return {
    retryIn: cooldown.remaining,
    passwordValue: watch("password") ?? "", onSubmit, handleSubmit, register, errors, isPending, serverError, createdEmail };
};
