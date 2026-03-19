import { Link } from "@tanstack/react-router";
import { Eye, Mail, User, AtSign } from "lucide-react";
import { Button } from "@/shared/components/button";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import { useSignUpModel } from "./sign-up.model";

type SignUpViewProps = ReturnType<typeof useSignUpModel>;

export const SignUpView = (props: SignUpViewProps) => {
  const { errors, handleSubmit, onSubmit, register } = props;

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Input
        {...register("name")}
        color="primary"
        type="text"
        autoComplete="name"
        placeholder="João Silva"
        icon={<User size={24} />}
        error={errors.name?.message}
      >
        <Label value="Nome completo:" htmlFor="name" />
      </Input>

      <Input
        {...register("username")}
        color="primary"
        type="text"
        autoComplete="username"
        placeholder="joao_silva"
        icon={<AtSign size={24} />}
        error={errors.username?.message}
      >
        <Label value="Username:" htmlFor="username" />
      </Input>

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
        autoComplete="new-password"
        placeholder="••••••••"
        icon={<Eye size={24} />}
        error={errors.password?.message}
      >
        <Label value="Senha:" htmlFor="password" />
      </Input>

      <div className="mb-5">
        <Button
          type="submit"
          color="default"
          size="lg"
          className="flex w-full p-4 text-white transition border rounded-lg cursor-pointer border-primary bg-primary hover:bg-opacity-90"
        >
          Criar conta
        </Button>
      </div>

      <div className="mt-6 text-center">
        <p>
          Já tem conta?{" "}
          <Link to="/" className="text-primary hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </form>
  );
};
