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
import { ErrorState } from "./shared/components/state";
import { LayoutAuth } from "./modules/auth/Layout/LayoutAuth";
import { LayoutSite } from "./modules/site/layout/LayoutSite";
import { NotFoundView } from "./shared/view/NotFoundView";
import { productBySlugQueryOptions } from "./modules/site/hooks/useQueryProducts";
import { SchemaProductListSearch } from "./modules/site/view/product-list/product-list.schema";
import { SchemaProductDetailSearch } from "./modules/site/view/product-detail/product-detail.schema";
import { SchemaSignInSearch } from "./modules/auth/sign-in/sign-in.schema";
import { SchemaResetPasswordSearch } from "./modules/auth/reset-password/reset-password.schema";

const SignInPage = lazy(() => import("./modules/auth/sign-in/SignInPage"));
const SignUpPage = lazy(() => import("./modules/auth/sign-up/SignUpPage"));
const ForgotPasswordPage = lazy(
  () => import("./modules/auth/forgot-password/ForgotPasswordPage")
);
const ResetPasswordPage = lazy(
  () => import("./modules/auth/reset-password/ResetPasswordPage")
);
const ActivateAccountPage = lazy(
  () => import("./modules/auth/activate-account/ActivateAccountPage")
);
const HomePage = lazy(() => import("./modules/site/view/home/HomePage"));
const ProductListPage = lazy(
  () => import("./modules/site/view/product-list/ProductListPage")
);
const ProductDetailPage = lazy(
  () => import("./modules/site/view/product-detail/ProductDetailPage")
);

const RouteError = ({ error }: { error: unknown }) => (
  <div className="container-page py-16">
    <h1 className="sr-only">Erro ao carregar a página</h1>
    <ErrorState
      title="Erro ao carregar a página"
      message={error instanceof Error ? error.message : "Tente novamente mais tarde."}
      onRetry={() => window.location.reload()}
    />
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
        newestOnTop={false}
        closeOnClick={false}
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
    // Visitante já confirmado como não logado há pouco: evita outro 401 em /user/me
    const state = queryClient.getQueryState(["me"]);
    if (state?.status === "error" && Date.now() - state.errorUpdatedAt < 60_000) return;
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
  validateSearch: (search) => SchemaSignInSearch.parse(search),
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
  validateSearch: (search) => SchemaResetPasswordSearch.parse(search),
  component: () => (
    <Suspense fallback={<Loading />}>
      <ResetPasswordPage />
    </Suspense>
  ),
});

// Link enviado por e-mail no cadastro: {origin}/activate-account/{token}
const activateAccountRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/activate-account/$token",
  component: () => (
    <Suspense fallback={<Loading />}>
      <ActivateAccountPage />
    </Suspense>
  ),
});

// Site layout — público. O id "site" entra no id das rotas filhas
// (ex.: "/site/products/$slug"), usado em useParams/useSearch({ from }).
const siteLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "site",
  component: LayoutSite,
});

const homeRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/",
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
  validateSearch: (search) => SchemaProductListSearch.parse(search),
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
  validateSearch: (search) => SchemaProductDetailSearch.parse(search),
  // Pré-carrega o produto (ex.: ao passar o mouse no link) sem bloquear a navegação
  loader: ({ params }) => {
    queryClient.prefetchQuery(productBySlugQueryOptions(params.slug));
  },
  errorComponent: RouteError,
  component: () => (
    <Suspense fallback={<Loading />}>
      <ProductDetailPage />
    </Suspense>
  ),
});

const notFoundRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "*",
  component: () => <NotFoundView path="/" message="Voltar para o início" />,
});

const routeTree = rootRoute.addChildren([
  authLayoutRoute.addChildren([
    signInRoute,
    signUpRoute,
    forgotPasswordRoute,
    resetPasswordRoute,
    activateAccountRoute,
  ]),
  siteLayoutRoute.addChildren([
    homeRoute,
    productListRoute,
    productDetailRoute,
    notFoundRoute,
  ]),
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
