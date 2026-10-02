import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { HttpError } from "@/shared/services/http-error";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { SchemaForgotPassword } from "./forgot-password.schema";
import { ForgotPasswordValues } from "./forgot-password.type";
import { ForgotPasswordService } from "../services/forgot-password";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 404) return "Não encontramos uma conta com esse e-mail.";
    return error.message;
  }
  return "Não foi possível enviar o código. Tente novamente.";
};

export const useForgotPasswordModel = () => {
  useDocumentTitle("Recuperar senha");
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string>();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(SchemaForgotPassword),
    defaultValues: { email: "" },
  });

  const onSubmit: SubmitHandler<ForgotPasswordValues> = async ({ email }) => {
    setServerError(undefined);
    try {
      await ForgotPasswordService(email);
      toast.success("Enviamos um código de 6 dígitos para o seu e-mail.");
      // Etapa 2: e-mail + código + nova senha
      navigate({ to: "/reset-password", search: { email } });
    } catch (er) {
      setServerError(getErrorMessage(er));
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit, serverError };
};
