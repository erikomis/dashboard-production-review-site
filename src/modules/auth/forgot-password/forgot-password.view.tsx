import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { AuthHeading } from "../components/AuthHeading";
import { FormAlert } from "../components/FormAlert";
import { useForgotPasswordModel } from "./forgot-password.model";

type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordModel>;

export const ForgotPasswordView = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
  serverError,
}: ForgotPasswordViewProps) => {
  return (
    <>
      <p className="mb-2 text-sm font-semibold text-brand-700">Etapa 1 de 2</p>
      <AuthHeading
        title="Recuperar senha"
        description="Informe o e-mail da sua conta. Vamos enviar um código de 6 dígitos para você criar uma nova senha."
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
          containerClassName="mb-6"
        />

        <Button type="submit" size="lg" loading={isSubmitting} className="w-full">
          {isSubmitting ? "Enviando código…" : "Enviar código"}
        </Button>
      </form>

      <div className="mt-7 flex flex-col gap-2 border-t border-line pt-6 text-center text-sm text-muted">
        <p>
          Já tem um código?{" "}
          <Link to="/reset-password" className="link">
            Redefinir senha
          </Link>
        </p>
        <p>
          Lembrou a senha?{" "}
          <Link to="/login" className="link">
            Voltar para o login
          </Link>
        </p>
      </div>
    </>
  );
};
