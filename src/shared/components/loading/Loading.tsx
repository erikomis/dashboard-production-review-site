import { Spinner } from "../spinner";

export const Loading = ({ label = "Carregando…" }: { label?: string }) => {
  return (
    <div role="status" className="flex min-h-[50vh] w-full items-center justify-center gap-3 text-brand-600">
      <Spinner className="h-8 w-8" />
      <span className="sr-only">{label}</span>
    </div>
  );
};
