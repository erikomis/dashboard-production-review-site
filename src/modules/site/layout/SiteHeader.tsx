import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, BellRing, ChevronDown, LogOut, Menu, MessageSquareText, Settings, UserRound, X } from "lucide-react";
import { Logo } from "@/modules/site/components/Logo";
import { buttonVariants } from "@/shared/components/button-variants";
import { ThemeToggle } from "@/shared/components/theme-toggle";
import { cn } from "@/shared/utils/utils";
import { getInitials } from "@/shared/utils/format";
import { SearchCombobox as SearchForm } from "./search-combobox/SearchCombobox";
import { NotificationBell } from "./notification-bell/NotificationBell";
import type { useLayoutSiteModel } from "./layout-site.model";

type SiteHeaderProps = Omit<ReturnType<typeof useLayoutSiteModel>, "mainRef" | "categories">;

const navLinkClass =
  "relative rounded-md px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink data-[status=active]:text-ink after:absolute after:inset-x-3 after:-bottom-[0.6rem] after:h-0.5 after:rounded-full after:bg-primary after:opacity-0 after:transition-opacity data-[status=active]:after:opacity-100 dark:after:bg-brand-300";

const NavLinks = ({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) => {
  const cls = vertical
    ? "block rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-canvas data-[status=active]:bg-tint data-[status=active]:text-brand-800"
    : navLinkClass;
  return (
    <>
      <li>
        <Link to="/" className={cls} activeOptions={{ exact: true, includeHash: false }} onClick={onNavigate}>
          Início
        </Link>
      </li>
      <li>
        <Link to="/products" className={cls} onClick={onNavigate}>
          Produtos
        </Link>
      </li>
      <li>
        <Link to="/ranking" className={cls} onClick={onNavigate}>
          Ranking
        </Link>
      </li>
      <li>
        <Link to="/" hash="categorias" className={cls} activeOptions={{ exact: true, includeHash: true }} onClick={onNavigate}>
          Categorias
        </Link>
      </li>
    </>
  );
};

interface AccountLink {
  to: "/minhas-avaliacoes" | "/seguindo" | "/notificacoes" | "/preferencias";
  label: string;
  icon: ReactNode;
  badge?: number;
}

const accountLinks = (unreadCount: number): AccountLink[] => [
  { to: "/minhas-avaliacoes", label: "Minhas avaliações", icon: <MessageSquareText /> },
  { to: "/seguindo", label: "Seguindo", icon: <BellRing /> },
  { to: "/notificacoes", label: "Notificações", icon: <Bell />, badge: unreadCount },
  { to: "/preferencias", label: "Preferências", icon: <Settings /> },
];

const menuItemClass =
  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink transition-colors hover:bg-canvas data-[status=active]:bg-tint data-[status=active]:text-brand-800 [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-muted";

const CountBadge = ({ count }: { count?: number }) =>
  count ? (
    <span className="ml-auto rounded-full bg-danger-solid px-2 py-0.5 text-xs font-bold text-white">
      {count > 99 ? "99+" : count}
      <span className="sr-only"> não {count === 1 ? "lida" : "lidas"}</span>
    </span>
  ) : null;

export const SiteHeader = ({
  user,
  pathname,
  isAuthenticated,
  isLoadingUser,
  unreadCount,
  loginRedirect,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  mobileOpen,
  toggleMobile,
  closeMobile,
  userMenuOpen,
  toggleUserMenu,
  closeUserMenu,
  handleLogout,
  isLoggingOut,
  userMenuRef,
  userMenuButtonRef,
  mobileButtonRef,
}: SiteHeaderProps) => {
  const links = accountLinks(unreadCount);
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/80">
      <div className="container-page flex h-16 items-center gap-3 lg:gap-6">
        <Link to="/" className="shrink-0 rounded-md" aria-label="ReviewStore — página inicial">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-0.5">
            <NavLinks />
          </ul>
        </nav>

        <SearchForm
          id="header-search"
          value={searchTerm}
          onChange={setSearchTerm}
          onSubmit={onSearchSubmit}
          className="ml-auto hidden max-w-sm lg:block"
        />

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <ThemeToggle className="hidden sm:inline-flex" />
          <NotificationBell enabled={isAuthenticated} />

          {isLoadingUser ? (
            <span className="skeleton ml-1 hidden h-9 w-32 sm:block" aria-hidden="true" />
          ) : isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative ml-1 hidden sm:block">
              <button
                ref={userMenuButtonRef}
                type="button"
                onClick={toggleUserMenu}
                aria-expanded={userMenuOpen}
                aria-controls="user-menu"
                className="flex h-11 items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-semibold text-ink transition-colors hover:border-ink aria-expanded:border-ink"
              >
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {getInitials(user.name)}
                </span>
                <span className="max-w-[9rem] truncate">
                  <span className="sr-only">Conta de </span>
                  {user.name.split(" ")[0]}
                </span>
                <ChevronDown aria-hidden="true" className={cn("h-4 w-4 transition-transform", userMenuOpen && "rotate-180")} />
              </button>
              <div
                id="user-menu"
                hidden={!userMenuOpen}
                className="absolute right-0 top-full mt-2 w-72 overflow-hidden rounded-2xl border border-line bg-surface shadow-raised motion-safe:animate-fade-in"
              >
                <div className="flex items-center gap-3 border-b border-line px-4 py-3.5">
                  <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tint-strong text-sm font-bold text-brand-800">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                  </div>
                </div>
                <nav aria-label="Sua conta" className="p-1.5">
                  <Link
                    to="/u/$username"
                    params={{ username: user.username }}
                    onClick={closeUserMenu}
                    className={menuItemClass}
                  >
                    <UserRound aria-hidden="true" />
                    Meu perfil público
                  </Link>
                  {links.map((link) => (
                    <Link key={link.to} to={link.to} onClick={closeUserMenu} className={menuItemClass}>
                      <span aria-hidden="true" className="contents [&>svg]:h-4 [&>svg]:w-4 [&>svg]:shrink-0 [&>svg]:text-muted">
                        {link.icon}
                      </span>
                      {link.label}
                      <CountBadge count={link.badge} />
                    </Link>
                  ))}
                </nav>
                <div className="border-t border-line p-1.5">
                  <button type="button" onClick={handleLogout} disabled={isLoggingOut} className={cn(menuItemClass, "disabled:opacity-60")}>
                    <LogOut aria-hidden="true" />
                    {isLoggingOut ? "Saindo…" : "Sair da conta"}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="ml-1 hidden items-center gap-2 sm:flex">
              <Link
                to="/login"
                search={loginRedirect ? { redirect: loginRedirect } : {}}
                className={buttonVariants({ color: "ghost", size: "sm" })}
              >
                Entrar
              </Link>
              <Link to="/sign-up" className={buttonVariants({ color: "default", size: "sm" })}>
                Criar conta
              </Link>
            </div>
          )}

          <button
            ref={mobileButtonRef}
            type="button"
            onClick={toggleMobile}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-lg text-ink hover:bg-canvas md:hidden"
          >
            {mobileOpen ? <X aria-hidden="true" className="h-6 w-6" /> : <Menu aria-hidden="true" className="h-6 w-6" />}
            <span className="sr-only">{mobileOpen ? "Fechar menu" : "Abrir menu"}</span>
          </button>
        </div>
      </div>

      {/* Busca sempre visível abaixo de lg (home e listagem já têm busca própria) */}
      {pathname !== "/" && pathname !== "/products" && (
        <div className="container-page pb-3 lg:hidden">
          <SearchForm id="header-search-compact" value={searchTerm} onChange={setSearchTerm} onSubmit={onSearchSubmit} />
        </div>
      )}

      <div id="mobile-menu" hidden={!mobileOpen} className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-line bg-surface md:hidden">
        <nav aria-label="Menu" className="container-page py-3">
          <ul className="space-y-0.5">
            <NavLinks vertical onNavigate={closeMobile} />
          </ul>
          <div className="mt-3 border-t border-line pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-1">
                <div className="mb-3 flex items-center gap-3 px-1">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/u/$username"
                  params={{ username: user.username }}
                  onClick={closeMobile}
                  className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-canvas"
                >
                  <UserRound aria-hidden="true" className="h-5 w-5 text-muted" />
                  Meu perfil público
                </Link>
                {links.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={closeMobile}
                    className="flex items-center gap-2.5 rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-canvas data-[status=active]:bg-tint"
                  >
                    <span aria-hidden="true" className="contents [&>svg]:h-5 [&>svg]:w-5 [&>svg]:text-muted">
                      {link.icon}
                    </span>
                    {link.label}
                    <CountBadge count={link.badge} />
                  </Link>
                ))}
                <ThemeToggle showLabel className="w-full justify-start rounded-lg" />
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(buttonVariants({ color: "outline" }), "mt-2 w-full")}
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  {isLoggingOut ? "Saindo…" : "Sair da conta"}
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                <ThemeToggle showLabel className="w-full justify-start rounded-lg" />
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    search={loginRedirect ? { redirect: loginRedirect } : {}}
                    className={buttonVariants({ color: "outline" })}
                  >
                    Entrar
                  </Link>
                  <Link to="/sign-up" className={buttonVariants({ color: "default" })}>
                    Criar conta
                  </Link>
                </div>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
