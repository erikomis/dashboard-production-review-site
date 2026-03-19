import {
  createRootRoute,
  createRoute,
  createRouter,
  redirect,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { queryClient } from "./shared/libs/react-query";
import { me } from "./shared/services/me";
import { Loading } from "./shared/components/loading/Loading";
import { LayoutAuth } from "./modules/auth/Layout/LayoutAuth";
import { LayoutSite } from "./modules/site/layout/LayoutSite";
import { NotFoundView } from "./shared/view/NotFoundView";
import { ProductsService } from "./modules/site/services/products.service";

const SignInPage = lazy(() => import("./modules/auth/sign-in/SignInPage"));
const SignUpPage = lazy(() => import("./modules/auth/sign-up/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("./modules/auth/forgot-password/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("./modules/auth/reset-password/ResetPasswordPage")
);
const HomePage = lazy(() => import("./modules/site/view/home/HomePage"));
const ProductListPage = lazy(
  () => import("./modules/site/view/product-list/ProductListPage")
);
const ProductDetailPage = lazy(
  () => import("./modules/site/view/product-detail/ProductDetailPage")
);

const RouteError = ({ error }: { error: unknown }) => (
  <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
    <p className="text-lg font-semibold text-danger">Erro ao carregar página</p>
    <p className="text-sm text-body">
      {error instanceof Error ? error.message : "Tente novamente mais tarde."}
    </p>
  </div>
);

// Root — wraps providers
const rootRoute = createRootRoute({
  component: () => (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      {import.meta.env.DEV && <TanStackRouterDevtools />}
    </QueryClientProvider>
  ),
});

// Auth layout — redireciona para / se já autenticado
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  beforeLoad: async () => {
    const user = await queryClient
      .ensureQueryData({ queryKey: ["me"], queryFn: me })
      .catch(() => null);
    if (user) throw redirect({ to: "/" });
  },
  component: LayoutAuth,
});

const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: search.redirect ? String(search.redirect) : undefined,
  }),
  component: () => (
    <Suspense fallback={<Loading />}>
      <SignInPage />
    </Suspense>
  ),
});

const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/sign-up",
  component: () => (
    <Suspense fallback={<Loading />}>
      <SignUpPage />
    </Suspense>
  ),
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/forgot-password",
  component: () => (
    <Suspense fallback={<Loading />}>
      <ForgotPasswordPage />
    </Suspense>
  ),
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/reset-password",
  component: () => (
    <Suspense fallback={<Loading />}>
      <ResetPasswordPage />
    </Suspense>
  ),
});

// Site layout — público, rota principal é /
const siteLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "site",
  component: LayoutSite,
});

const homeRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/",
  loader: () =>
    queryClient.ensureQueryData({
      queryKey: ["products", 0, 6],
      queryFn: () => ProductsService.fetchProducts(0, 6),
    }),
  pendingComponent: Loading,
  errorComponent: RouteError,
  component: () => (
    <Suspense fallback={<Loading />}>
      <HomePage />
    </Suspense>
  ),
});

const productListRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/products",
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page ?? 0),
    q: String(search.q ?? ""),
  }),
  loaderDeps: ({ search: { page } }) => ({ page }),
  loader: ({ deps: { page } }) =>
    queryClient.ensureQueryData({
      queryKey: ["products", page, 12],
      queryFn: () => ProductsService.fetchProducts(page, 12),
    }),
  pendingComponent: Loading,
  errorComponent: RouteError,
  component: () => (
    <Suspense fallback={<Loading />}>
      <ProductListPage />
    </Suspense>
  ),
});

const productDetailRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/products/$slug",
  loader: ({ params }) =>
    queryClient.ensureQueryData({
      queryKey: ["product", params.slug],
      queryFn: () => ProductsService.getBySlug(params.slug),
    }),
  pendingComponent: Loading,
  errorComponent: RouteError,
  component: () => (
    <Suspense fallback={<Loading />}>
      <ProductDetailPage />
    </Suspense>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "*",
  component: () => <NotFoundView path="/" message="Voltar para início" />,
});

const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([
    signInRoute,
    signUpRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
  ]),
  siteLayoutRoute.addChildren([
    homeRoute,
    productListRoute,
    productDetailRoute,
  ]),
  notFoundRoute,
]);

export const router = createRouter({
  routeTree,
  defaultPreload: "intent",
});

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}
