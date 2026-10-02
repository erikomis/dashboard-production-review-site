import { createRootRoute, createRoute, createRouter, redirect } from "@tanstack/react-router";
import { lazy } from "react";

import { queryClient } from "./shared/libs/react-query";
import { me } from "./shared/services/me";
import { withSuspense } from "./shared/components/lazy-page";
import { RootLayout } from "./shared/view/RootLayout";
import { RouteError } from "./shared/view/RouteError";
import { LayoutAuth } from "./modules/auth/Layout/LayoutAuth";
import { LayoutSite } from "./modules/site/layout/LayoutSite";
import { NotFoundView } from "./shared/view/NotFoundView";
import { productBySlugQueryOptions } from "./modules/site/hooks/useQueryProducts";
import { categoryBySlugQueryOptions } from "./modules/site/hooks/useQueryCategories";
import { SchemaProductListSearch } from "./modules/site/view/product-list/product-list.schema";
import { SchemaProductDetailSearch } from "./modules/site/view/product-detail/product-detail.schema";
import { SchemaRankingSearch } from "./modules/site/view/ranking/ranking.schema";
import { SchemaCategorySearch } from "./modules/site/view/category/category.schema";
import { SchemaMyReviewsSearch } from "./modules/site/view/my-reviews/my-reviews.schema";
import { SchemaProfileSearch } from "./modules/site/view/profile/profile.schema";
import { SchemaNotificationsSearch } from "./modules/site/view/notifications/notifications.schema";
import { SchemaFollowingSearch } from "./modules/site/view/following/following.schema";
import { profileQueryOptions } from "./modules/site/hooks/useQueryProfile";
import { SchemaSignInSearch } from "./modules/auth/sign-in/sign-in.schema";
import { SchemaResetPasswordSearch } from "./modules/auth/reset-password/reset-password.schema";

const SignInPage = withSuspense(lazy(() => import("./modules/auth/sign-in/SignInPage")));
const SignUpPage = withSuspense(lazy(() => import("./modules/auth/sign-up/SignUpPage")));
const ForgotPasswordPage = withSuspense(lazy(() => import("./modules/auth/forgot-password/ForgotPasswordPage")));
const ResetPasswordPage = withSuspense(lazy(() => import("./modules/auth/reset-password/ResetPasswordPage")));
const ActivateAccountPage = withSuspense(lazy(() => import("./modules/auth/activate-account/ActivateAccountPage")));
const HomePage = withSuspense(lazy(() => import("./modules/site/view/home/HomePage")));
const ProductListPage = withSuspense(lazy(() => import("./modules/site/view/product-list/ProductListPage")));
const ProductDetailPage = withSuspense(lazy(() => import("./modules/site/view/product-detail/ProductDetailPage")));
const RankingPage = withSuspense(lazy(() => import("./modules/site/view/ranking/RankingPage")));
const CategoryPage = withSuspense(lazy(() => import("./modules/site/view/category/CategoryPage")));
const MyReviewsPage = withSuspense(lazy(() => import("./modules/site/view/my-reviews/MyReviewsPage")));
const ProfilePage = withSuspense(lazy(() => import("./modules/site/view/profile/ProfilePage")));
const NotificationsPage = withSuspense(lazy(() => import("./modules/site/view/notifications/NotificationsPage")));
const PreferencesPage = withSuspense(lazy(() => import("./modules/site/view/preferences/PreferencesPage")));
const FollowingPage = withSuspense(lazy(() => import("./modules/site/view/following/FollowingPage")));

/** Usuário logado (ou null), reaproveitando o cache de ["me"]. */
const getCurrentUser = () =>
  queryClient.ensureQueryData({ queryKey: ["me"], queryFn: me, retry: false }).catch(() => null);

// Root — providers
const rootRoute = createRootRoute({ component: RootLayout });

// Auth layout — redireciona para / se já autenticado
const authLayoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: "auth",
  beforeLoad: async () => {
    // Visitante já confirmado como não logado há pouco: evita outro 401 em /user/me
    const state = queryClient.getQueryState(["me"]);
    if (state?.status === "error" && Date.now() - state.errorUpdatedAt < 60_000) return;
    const user = await getCurrentUser();
    if (user) throw redirect({ to: "/" });
  },
  component: LayoutAuth,
});

const signInRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/login",
  validateSearch: (search) => SchemaSignInSearch.parse(search),
  component: SignInPage,
});

const signUpRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/sign-up",
  component: SignUpPage,
});

const forgotPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/forgot-password",
  component: ForgotPasswordPage,
});

const resetPasswordRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/reset-password",
  validateSearch: (search) => SchemaResetPasswordSearch.parse(search),
  component: ResetPasswordPage,
});

// Link enviado por e-mail no cadastro: {origin}/activate-account/{token}
const activateAccountRoute = createRoute({
  getParentRoute: () => authLayoutRoute,
  path: "/activate-account/$token",
  component: ActivateAccountPage,
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
  component: HomePage,
});

const productListRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/products",
  validateSearch: (search) => SchemaProductListSearch.parse(search),
  errorComponent: RouteError,
  component: ProductListPage,
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
  component: ProductDetailPage,
});

const rankingRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/ranking",
  validateSearch: (search) => SchemaRankingSearch.parse(search),
  errorComponent: RouteError,
  component: RankingPage,
});

const categoryRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/categorias/$slug",
  validateSearch: (search) => SchemaCategorySearch.parse(search),
  loader: ({ params }) => {
    queryClient.prefetchQuery(categoryBySlugQueryOptions(params.slug));
  },
  errorComponent: RouteError,
  component: CategoryPage,
});

/** Rotas da conta: sem sessão, vão para /login e voltam para cá depois de entrar. */
const requireUser = async ({ location }: { location: { href: string } }) => {
  const user = await getCurrentUser();
  if (!user) throw redirect({ to: "/login", search: { redirect: location.href } });
};

const myReviewsRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/minhas-avaliacoes",
  validateSearch: (search) => SchemaMyReviewsSearch.parse(search),
  beforeLoad: requireUser,
  errorComponent: RouteError,
  component: MyReviewsPage,
});

// Perfil público
const profileRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/u/$username",
  validateSearch: (search) => SchemaProfileSearch.parse(search),
  loader: ({ params }) => {
    queryClient.prefetchQuery(profileQueryOptions(params.username));
  },
  errorComponent: RouteError,
  component: ProfilePage,
});

const notificationsRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/notificacoes",
  validateSearch: (search) => SchemaNotificationsSearch.parse(search),
  beforeLoad: requireUser,
  errorComponent: RouteError,
  component: NotificationsPage,
});

// Os e-mails de notificação apontam para {SITE_URL}/preferencias
const preferencesRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/preferencias",
  beforeLoad: requireUser,
  errorComponent: RouteError,
  component: PreferencesPage,
});

const followingRoute = createRoute({
  getParentRoute: () => siteLayoutRoute,
  path: "/seguindo",
  validateSearch: (search) => SchemaFollowingSearch.parse(search),
  beforeLoad: requireUser,
  errorComponent: RouteError,
  component: FollowingPage,
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
    rankingRoute,
    categoryRoute,
    myReviewsRoute,
    profileRoute,
    notificationsRoute,
    preferencesRoute,
    followingRoute,
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
