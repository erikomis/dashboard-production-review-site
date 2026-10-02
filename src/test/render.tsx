import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/shared/libs/react-query";
import {
  createMemoryHistory,
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
  RouterProvider,
} from "@tanstack/react-router";

/**
 * Renderiza um componente dentro de QueryClient + router em memória (para <Link> e useNavigate).
 * Devolve o router para conferir navegações (router.state.location).
 */
export const renderWithProviders = async (ui: ReactElement, { path = "/" }: { path?: string } = {}) => {
  // Os hooks atualizam o cache pelo queryClient do app: usa o mesmo, limpo a cada teste
  queryClient.clear();
  queryClient.setDefaultOptions({ queries: { retry: false, staleTime: 0 }, mutations: { retry: false } });
  const rootRoute = createRootRoute({ component: () => <Outlet /> });
  const catchAll = createRoute({ getParentRoute: () => rootRoute, path: "$", component: () => ui });
  const index = createRoute({ getParentRoute: () => rootRoute, path: "/", component: () => ui });
  const router = createRouter({
    routeTree: rootRoute.addChildren([index, catchAll]),
    history: createMemoryHistory({ initialEntries: [path] }),
  });
  const result = render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>,
  );
  await router.load();
  return { ...result, router, queryClient };
};
