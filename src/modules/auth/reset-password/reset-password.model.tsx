import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { HttpError, isRateLimited } from "@/shared/services/http-error";
import { useCooldown } from "@/shared/hooks/useCooldown";

import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { SchemaResetPassword } from "./reset-password.schema";
import { ResetPasswordValues } from "./reset-password.type";
import { ResetPasswordService } from "../services/reset-password";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    // A API devolve 404 tanto para e-mail inexistente ("Usuário não encontrado")
    // quanto para código inválido ("Código de recuperação inválido"): usamos a mensagem dela.
    if (error.status === 400 || error.status === 404)
      return error.message || "Código inválido ou expirado. Confira o código ou solicite um novo.";
    return error.message;
  }
  return "Não foi possível redefinir a senha. Tente novamente.";
};

export const useResetPasswordModel = () => {
  useDocumentTitle("Redefinir senha");
  const navigate = useNavigate();
  const { email: emailFromUrl } = useSearch({ from: "/auth/reset-password" });
  const [serverError, setServerError] = useState<string>();
  const cooldown = useCooldown();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(SchemaResetPassword),
    defaultValues: { email: emailFromUrl ?? "", recoveryCode: "", password: "", confirmPassword: "" },
  });

  const onSubmit: SubmitHandler<ResetPasswordValues> = async ({ email, password, recoveryCode }) => {
    setServerError(undefined);
    try {
      await ResetPasswordService(email, password, recoveryCode);
      toast.success("Senha redefinida! Entre com a nova senha.");
      navigate({ to: "/login" });
    } catch (er) {
      setServerError(getErrorMessage(er));
      // 429: bloqueia o envio até acabar o tempo do Retry-After
      if (isRateLimited(er)) cooldown.start((er as HttpError).retryAfter ?? 60);
    }
  };

  return {
    retryIn: cooldown.remaining,
    passwordValue: watch("password") ?? "",
    register,
    handleSubmit,
    errors,
    isSubmitting,
    onSubmit,
    serverError,
    hasEmailFromUrl: !!emailFromUrl,
  };
};
