import { ErrorState } from "../components/state";

/** errorComponent padrão das rotas do site. */
export const RouteError = ({ error }: { error: unknown }) => (
  <div className="container-page py-16">
    <h1 className="sr-only">Erro ao carregar a página</h1>
    <ErrorState
      title="Erro ao carregar a página"
      message={error instanceof Error ? error.message : "Tente novamente mais tarde."}
      onRetry={() => window.location.reload()}
    />
  </div>
);
