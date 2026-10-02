import { Link } from "@tanstack/react-router";
import { CircleCheck, CircleX } from "lucide-react";
import { buttonVariants } from "@/shared/components/button-variants";
import { Spinner } from "@/shared/components/spinner";
import { useActivateAccountModel } from "./activate-account.model";

type ActivateAccountViewProps = ReturnType<typeof useActivateAccountModel>;

export const ActivateAccountView = ({ isLoading, isSuccess }: ActivateAccountViewProps) => {
  if (isLoading) {
    return (
      <div role="status" className="flex flex-col items-center py-6 text-center">
        <Spinner className="h-8 w-8 text-brand-600" />
        <h1 className="mt-5 text-2xl font-bold text-ink">Ativando sua conta…</h1>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div role="status" className="text-center">
        <span aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success-soft text-success">
          <CircleCheck className="h-7 w-7" />
        </span>
        <h1 className="text-3xl font-bold text-ink">Conta ativada!</h1>
        <p className="mt-3 text-muted">Tudo pronto. Entre para começar a avaliar produtos.</p>
        <Link to="/login" className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}>
          Entrar
        </Link>
      </div>
    );
  }

  return (
    <div role="alert" className="text-center">
      <span aria-hidden="true" className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-danger-soft text-danger">
        <CircleX className="h-7 w-7" />
      </span>
      <h1 className="text-3xl font-bold text-ink">Link inválido ou expirado</h1>
      <p className="mt-3 text-muted">
        Não conseguimos ativar sua conta com este link. Tente entrar: se a conta ainda não estiver ativa, enviaremos um
        novo link para o seu e-mail.
      </p>
      <Link to="/login" className={buttonVariants({ size: "lg", className: "mt-7 w-full" })}>
        Ir para o login
      </Link>
    </div>
  );
};
