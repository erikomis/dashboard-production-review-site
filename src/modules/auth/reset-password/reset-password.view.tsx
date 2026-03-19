import { Link } from "@tanstack/react-router";
import { Eye, Mail, KeyRound } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useResetPasswordModel } from "./reset-password.model";

type ResetPasswordViewProps = ReturnType<typeof useResetPasswordModel>;

export const ResetPasswordView = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
}: ResetPasswordViewProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold text-black mb-1">Redefinir senha</h2>
      <p className="text-body text-sm mb-6">
        Insira o código recebido por e-mail e defina sua nova senha.
      </p>

      <Input
        {...register("email")}
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        icon={<Mail size={24} />}
        error={errors.email?.message}
      >
        <Label value="E-mail:" htmlFor="email" />
      </Input>

      <Input
        {...register("recoveryCode")}
        type="text"
        placeholder="Código de recuperação"
        icon={<KeyRound size={24} />}
        error={errors.recoveryCode?.message}
      >
        <Label value="Código de recuperação:" htmlFor="recoveryCode" />
      </Input>

      <Input
        {...register("password")}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        icon={<Eye size={24} />}
        error={errors.password?.message}
      >
        <Label value="Nova senha:" htmlFor="password" />
      </Input>

      <Input
        {...register("confirmPassword")}
        type="password"
        autoComplete="new-password"
        placeholder="••••••••"
        icon={<Eye size={24} />}
        error={errors.confirmPassword?.message}
      >
        <Label value="Confirmar senha:" htmlFor="confirmPassword" />
      </Input>

      <div className="mb-5">
        <Button
          type="submit"
          color="default"
          size="lg"
          className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Salvando..." : "Redefinir senha"}
        </Button>
      </div>

      <div className="mt-4 text-center">
        <Link to="/" className="text-primary hover:underline text-sm">
          Voltar para o login
        </Link>
      </div>
    </form>
  );
};
