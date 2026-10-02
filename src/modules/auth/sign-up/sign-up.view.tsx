import { Link } from "@tanstack/react-router";
import { AtSign, LockKeyhole, Mail, MailCheck, UserRound } from "lucide-react";
import { Button } from "@/shared/components/button";
import { formatCountdown } from "@/shared/hooks/useCooldown";
import { buttonVariants } from "@/shared/components/button-variants";
import { Input } from "@/shared/components/input";
import { PasswordRequirements } from "@/shared/components/password-requirements";
import { AuthHeading } from "../components/AuthHeading";
import { FormAlert } from "../components/FormAlert";
import { useSignUpModel } from "./sign-up.model";

type SignUpViewProps = ReturnType<typeof useSignUpModel>;

export const SignUpView = ({
  errors,
  handleSubmit,
  onSubmit,
  register,
  isPending,
  serverError,
  retryIn,
  passwordValue,
  createdEmail,
}: SignUpViewProps) => {
  if (createdEmail) {
    return (
      <div role="status" className="text-center">
        <span aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <MailCheck className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Confirme seu e-mail</h1>
        <p className="mt-3 leading-relaxed text-muted">
          Enviamos um link de ativação para <strong className="text-ink">{createdEmail}</strong>. Abra o e-mail e
          clique no link para ativar sua conta. Depois é só entrar.
        </p>
        <Link to="/login" className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}>
          Ir para o login
        </Link>
      </div>
    );
  }

  return (
    <>
      <AuthHeading title="Criar conta" description="É grátis e leva menos de um minuto." />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormAlert>{serverError}</FormAlert>

        <Input
          {...register("name")}
          label="Nome completo"
          autoComplete="name"
          icon={<UserRound />}
          error={errors.name?.message}
        />

        <Input
          {...register("username")}
          label="Nome de usuário"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          icon={<AtSign />}
          hint="Letras minúsculas, números, ponto e _. Aparece nas suas avaliações."
          error={errors.username?.message}
        />

        <Input
          {...register("email")}
          label="E-mail"
          type="email"
          autoComplete="email"
          inputMode="email"
          icon={<Mail />}
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          label="Senha"
          type="password"
          autoComplete="new-password"
          icon={<LockKeyhole />}
          hint="De 8 a 72 caracteres, com letras e números."
          maxLength={72}
          error={errors.password?.message}
        />
        <PasswordRequirements value={passwordValue} />

        <Input
          {...register("confirmPassword")}
          label="Confirmar senha"
          type="password"
          autoComplete="new-password"
          icon={<LockKeyhole />}
          error={errors.confirmPassword?.message}
          containerClassName="mb-6"
        />

        <Button type="submit" size="lg" loading={isPending} disabled={retryIn > 0} className="w-full">
          {retryIn > 0 ? `Aguarde ${formatCountdown(retryIn)}` : isPending ? "Criando conta…" : "Criar conta"}
        </Button>
      </form>

      <p className="mt-7 border-t border-line pt-6 text-center text-sm text-muted">
        Já tem conta?{" "}
        <Link to="/login" className="link">
          Entrar
        </Link>
      </p>
    </>
  );
};
