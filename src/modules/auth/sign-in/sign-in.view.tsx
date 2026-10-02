import { Link } from "@tanstack/react-router";
import { LockKeyhole, UserRound } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { AuthHeading } from "../components/AuthHeading";
import { FormAlert } from "../components/FormAlert";
import { useSignInModel } from "./sign-in.model";

type SignInViewProps = ReturnType<typeof useSignInModel>;

export const SignInView = ({ errors, handleSubmit, onSubmit, register, isPending, serverError }: SignInViewProps) => {
  return (
    <>
      <AuthHeading title="Entrar" description="Acesse sua conta para publicar avaliações." />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormAlert>{serverError}</FormAlert>

        <Input
          {...register("username")}
          label="E-mail ou nome de usuário"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          icon={<UserRound />}
          error={errors.username?.message}
        />

        <Input
          {...register("password")}
          label="Senha"
          type="password"
          autoComplete="current-password"
          icon={<LockKeyhole />}
          error={errors.password?.message}
          containerClassName="mb-2"
        />

        <div className="mb-6 flex justify-end">
          <Link to="/forgot-password" className="link text-sm">
            Esqueceu a senha?
          </Link>
        </div>

        <Button type="submit" size="lg" loading={isPending} className="w-full">
          {isPending ? "Entrando…" : "Entrar"}
        </Button>
      </form>

      <p className="mt-7 border-t border-line pt-6 text-center text-sm text-muted">
        Ainda não tem conta?{" "}
        <Link to="/sign-up" className="link">
          Criar conta grátis
        </Link>
      </p>
    </>
  );
};
