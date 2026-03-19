import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SchemaResetPassword } from "./reset-password.schema";
import { ResetPasswordValues } from "./reset-password.type";
import { ResetPasswordService } from "../services/reset-password";

export const useResetPasswordModel = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordValues>({
    resolver: zodResolver(SchemaResetPassword),
  });

  const onSubmit: SubmitHandler<ResetPasswordValues> = async ({
    email,
    password,
    recoveryCode,
  }) => {
    try {
      await ResetPasswordService(email, password, recoveryCode);
      toast.success("Senha redefinida com sucesso! Faça login.");
      navigate({ to: "/" });
    } catch (er) {
      const error = er as Error;
      toast.error(error.message || "Erro ao redefinir senha. Tente novamente.");
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit };
};
