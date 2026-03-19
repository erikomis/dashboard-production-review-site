import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { SchemaForgotPassword } from "./forgot-password.schema";
import { ForgotPasswordValues } from "./forgot-password.type";
import { ForgotPasswordService } from "../services/forgot-password";

export const useForgotPasswordModel = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordValues>({
    resolver: zodResolver(SchemaForgotPassword),
  });

  const onSubmit: SubmitHandler<ForgotPasswordValues> = async ({ email }) => {
    try {
      await ForgotPasswordService(email);
      toast.success("Código de recuperação enviado para o seu e-mail!");
      navigate({ to: "/reset-password" });
    } catch (er) {
      const error = er as Error;
      toast.error(error.message || "Erro ao enviar código. Tente novamente.");
    }
  };

  return { register, handleSubmit, errors, isSubmitting, onSubmit };
};
