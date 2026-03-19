import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { SchemaSignUp } from "./sign-up.schema";
import { SignUpValues } from "./sign-up.type";
import { useMutationSignUp } from "../hooks/useMutationSignUp";

export const useSignUpModel = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpValues>({
    resolver: zodResolver(SchemaSignUp),
  });

  const { mutateAsync: signUp } = useMutationSignUp();

  const onSubmit: SubmitHandler<SignUpValues> = async (data) => {
    try {
      await signUp(data);
      toast.success("Conta criada! Verifique seu e-mail para ativar a conta.");
      navigate({ to: "/" });
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      toast.error(error.message || "Erro ao criar conta. Tente novamente.");
    }
  };

  return { onSubmit, handleSubmit, register, errors };
};
