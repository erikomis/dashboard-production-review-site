import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { useRouter, useSearch } from "@tanstack/react-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { queryClient } from "@/shared/libs/react-query";
import { HttpError, isRateLimited } from "@/shared/services/http-error";
import { useCooldown } from "@/shared/hooks/useCooldown";

import { me } from "@/shared/services/me";
import { useDocumentTitle } from "@/shared/hooks/useDocumentTitle";
import { safeRedirectPath } from "@/shared/utils/format";
import { SchemaSignIn } from "./sign-in.schema";
import { SignInValues } from "./sign-in.type";
import { useMutationSignIn } from "../hooks/useMutationSignIn";

const getErrorMessage = (error: unknown) => {
  if (error instanceof HttpError) {
    if (error.status === 401) return "E-mail, usuário ou senha incorretos.";
    if (error.status === 403)
      return "Sua conta ainda não foi ativada. Reenviamos o link de ativação para o seu e-mail.";
    return error.message;
  }
  return "Não foi possível entrar. Tente novamente.";
};

export const useSignInModel = () => {
  useDocumentTitle("Entrar");
  const router = useRouter();
  const { redirect } = useSearch({ from: "/auth/login" });
  const [serverError, setServerError] = useState<string>();
  const cooldown = useCooldown();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInValues>({
    resolver: zodResolver(SchemaSignIn),
    defaultValues: { username: "", password: "" },
  });

  const { mutateAsync: signIn, isPending } = useMutationSignIn();

  const onSubmit: SubmitHandler<SignInValues> = async (data) => {
    setServerError(undefined);
    try {
      await signIn(data);
      const user = await queryClient.fetchQuery({ queryKey: ["me"], queryFn: me, staleTime: 0 });
      // As listas de avaliações trazem "helpfulByMe", que depende de quem está logado
      queryClient.removeQueries({ queryKey: ["reviews", "me"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      // Seguir e notificações também dependem da conta
      queryClient.removeQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      toast.success(`Bem-vindo(a), ${user.name.split(" ")[0]}!`);
      // Respeita ?redirect= (apenas caminhos internos); pode conter #hash
      router.history.push(safeRedirectPath(redirect));
    } catch (er) {
      setServerError(getErrorMessage(er));
      // 429: bloqueia o envio até acabar o tempo do Retry-After
      if (isRateLimited(er)) cooldown.start((er as HttpError).retryAfter ?? 60);
    }
  };

  return {
    retryIn: cooldown.remaining,
    onSubmit,
    handleSubmit,
    register,
    errors,
    isPending,
    serverError,
    redirect,
  };
};
