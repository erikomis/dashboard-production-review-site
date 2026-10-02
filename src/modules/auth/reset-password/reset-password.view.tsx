import { Link } from "@tanstack/react-router";
import { KeyRound, LockKeyhole, Mail } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { AuthHeading } from "../components/AuthHeading";
import { FormAlert } from "../components/FormAlert";
import { useResetPasswordModel } from "./reset-password.model";

type ResetPasswordViewProps = ReturnType<typeof useResetPasswordModel>;

export const ResetPasswordView = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  serverError,
  hasEmailFromUrl,
}: ResetPasswordViewProps) => {
  return (
    <>
      <p className="mb-2 text-sm font-semibold text-brand-700">Etapa 2 de 2</p>
      <AuthHeading
        title="Criar nova senha"
        description="Digite o código de 6 dígitos que enviamos para o seu e-mail e escolha uma nova senha."
      />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <FormAlert>{serverError}</FormAlert>

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
          {...register("recoveryCode")}
          label="Código de verificação"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={6}
          pattern="\d{6}"
          autoFocus={hasEmailFromUrl}
          icon={<KeyRound />}
          hint="6 dígitos, enviado para o seu e-mail."
          error={errors.recoveryCode?.message}
          className="font-mono tracking-[0.3em]"
        />

        <Input
          {...register("password")}
          label="Nova senha"
          type="password"
          autoComplete="new-password"
          icon={<LockKeyhole />}
          hint="De 6 a 20 caracteres."
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          label="Confirmar nova senha"
          type="password"
          autoComplete="new-password"
          icon={<LockKeyhole />}
          error={errors.confirmPassword?.message}
          containerClassName="mb-6"
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Salvando…" : "Redefinir senha"}
        </Button>
      </form>

      <div className="mt-7 flex flex-col gap-2 border-t border-line pt-6 text-center text-sm text-muted">
        <p>
          Não recebeu o código?{" "}
          <Link to="/forgot-password" className="link">
            Enviar novamente
          </Link>
        </p>
        <p>
          <Link to="/login" className="link">
            Voltar para o login
          </Link>
        </p>
      </div>
    </>
  );
};
