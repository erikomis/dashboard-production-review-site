import { Suspense, type ComponentType } from "react";
import { Loading } from "./loading/Loading";

/** Envolve uma página carregada sob demanda (React.lazy) com o carregamento padrão. */
export const withSuspense = (Page: ComponentType) => {
  const SuspensePage = () => (
    <Suspense fallback={<Loading />}>
      <Page />
    </Suspense>
  );
  return SuspensePage;
};
