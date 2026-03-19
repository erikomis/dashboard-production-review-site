import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useForgotPasswordModel } from "./forgot-password.model";

type ForgotPasswordViewProps = ReturnType<typeof useForgotPasswordModel>;

export const ForgotPasswordView = ({
  register,
  handleSubmit,
  errors,
  isSubmitting,
  onSubmit,
}: ForgotPasswordViewProps) => {
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <h2 className="text-xl font-bold text-black mb-1">Recuperar senha</h2>
      <p className="text-body text-sm mb-6">
        Digite seu e-mail e enviaremos um código de recuperação.
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

      <div className="mb-5">
        <Button
          type="submit"
          color="default"
          size="lg"
          className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Enviando..." : "Enviar código"}
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
