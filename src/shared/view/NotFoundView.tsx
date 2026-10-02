import { Link } from "@tanstack/react-router";
import { Compass } from "lucide-react";
import { buttonVariants } from "../components/button-variants";
import { useDocumentTitle } from "../hooks/useDocumentTitle";

interface NotFoundViewProps {
  path: string;
  message: string;
}

export const NotFoundView = ({ path, message }: NotFoundViewProps) => {
  useDocumentTitle("Página não encontrada");
  return (
    <div className="container-page flex flex-col items-center py-24 text-center">
      <span aria-hidden="true" className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-brand-50 text-brand-700">
        <Compass className="h-8 w-8" />
      </span>
      <p className="font-display text-sm font-semibold uppercase tracking-wider text-brand-700">Erro 404</p>
      <h1 className="mt-2 text-4xl font-bold text-ink">Página não encontrada</h1>
      <p className="mt-3 max-w-md text-muted">O endereço pode estar incorreto ou a página foi removida.</p>
      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to={path} className={buttonVariants({ size: "lg" })}>
          {message}
        </Link>
        <Link to="/products" className={buttonVariants({ size: "lg", color: "outline" })}>
          Ver produtos
        </Link>
      </div>
    </div>
  );
};
