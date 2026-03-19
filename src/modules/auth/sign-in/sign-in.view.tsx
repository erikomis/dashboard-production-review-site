import { Link } from "@tanstack/react-router";
import { Eye, Mail } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useSignInModel } from "./sign-in.model";

type SignInViewProps = ReturnType<typeof useSignInModel>;

export const SignInView = (props: SignInViewProps) => {
  const { errors, handleSubmit, onSubmit, register } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("email")}
        color="primary"
        type="email"
        autoComplete="email"
        placeholder="seu@email.com"
        icon={<Mail size={24} />}
        error={errors.email?.message}
      >
        <Label value="E-mail:" htmlFor="email" />
      </Input>

      <Input
        {...register("password")}
        color="primary"
        type="password"
        autoComplete="current-password"
        placeholder="••••••••"
        icon={<Eye size={24} />}
        error={errors.password?.message}
      >
        <Label value="Senha:" htmlFor="password" />
      </Input>

      <div className="flex justify-end mb-2">
        <Link to="/forgot-password" className="text-primary hover:underline text-sm">
          Esqueceu a senha?
        </Link>
      </div>

      <div className="mb-5">
        <Button
          type="submit"
          color="default"
          size="lg"
          className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
        >
          Entrar
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p>
          Você não tem conta?{" "}
          <Link to="/sign-up" className="text-primary hover:underline">
            Criar Conta
          </Link>
        </p>
      </div>
    </form>
  );
};
