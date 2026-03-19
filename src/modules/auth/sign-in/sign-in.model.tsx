import { SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { SchemaSignIn } from "./sign-in.schema";
import { SignInValues } from "./sign-in.type";
import { useMutationSignIn } from "../hooks/useMutationSignIn";
import { queryClient } from "@/shared/libs/react-query";

export const useSignInModel = () => {
  const navigate = useNavigate();
  const searchStr = useRouterState({ select: (s) => s.location.searchStr });
  const redirect = new URLSearchParams(searchStr).get("redirect") ?? undefined;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SchemaSignIn),
  });

  const { mutateAsync: signIn } = useMutationSignIn();

  const onSubmit: SubmitHandler<SignInValues> = async (data) => {
    try {
      await signIn(data);
      await queryClient.invalidateQueries({ queryKey: ["me"] });
      navigate({ to: redirect ?? "/" } as Parameters<typeof navigate>[0]);
    } catch (er) {
      const error = er as AxiosError<{ message: string }>;
      toast.error(error.message || "E-mail ou senha incorretos.");
    }
  };

  return { onSubmit, handleSubmit, register, errors };
};
