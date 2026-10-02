import { Link } from "@tanstack/react-router";
import { ChevronDown, LogOut, Menu, MessageSquareText, X } from "lucide-react";
import { Logo } from "@/modules/site/components/Logo";
import { buttonVariants } from "@/shared/components/button-variants";
import { cn } from "@/shared/utils/utils";
import { getInitials } from "@/shared/utils/format";
import { SearchForm } from "./SearchForm";
import type { useLayoutSiteModel } from "./layout-site.model";

type SiteHeaderProps = Omit<ReturnType<typeof useLayoutSiteModel>, "mainRef" | "categories">;

const navLinkClass =
  "relative rounded-md px-3 py-2 text-sm font-semibold text-ink-soft transition-colors hover:text-ink data-[status=active]:text-ink";

const NavLinks = ({ onNavigate, vertical }: { onNavigate?: () => void; vertical?: boolean }) => {
  const cls = vertical ? "block rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-canvas" : navLinkClass;
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

export const SiteHeader = ({
  user,
  pathname,
  isAuthenticated,
  isLoadingUser,
  loginRedirect,
  searchTerm,
  setSearchTerm,
  onSearchSubmit,
  mobileOpen,
  toggleMobile,
  userMenuOpen,
  toggleUserMenu,
  handleLogout,
  isLoggingOut,
  userMenuRef,
  userMenuButtonRef,
  mobileButtonRef,
}: SiteHeaderProps) => {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/85">
      <div className="container-page flex h-16 items-center gap-4 lg:gap-8">
        <Link to="/" className="shrink-0 rounded-md" aria-label="ReviewStore — página inicial">
          <Logo />
        </Link>

        <nav aria-label="Principal" className="hidden md:block">
          <ul className="flex items-center gap-1">
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

        <div className="ml-auto flex items-center gap-2 lg:ml-0">
          {isLoadingUser ? (
            <span className="skeleton hidden h-9 w-40 sm:block" aria-hidden="true" />
          ) : isAuthenticated && user ? (
            <div ref={userMenuRef} className="relative hidden sm:block">
              <button
                ref={userMenuButtonRef}
                type="button"
                onClick={toggleUserMenu}
                aria-expanded={userMenuOpen}
                aria-controls="user-menu"
                className="flex h-11 items-center gap-2 rounded-full border border-line py-1 pl-1 pr-3 text-sm font-semibold text-ink transition-colors hover:border-ink"
              >
                <span aria-hidden="true" className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
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
                  className="absolute right-0 top-full mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-raised"
                >
                  <div className="border-b border-line px-4 py-3">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                  </div>
                  <div className="p-1.5">
                    <Link
                      to="/minhas-avaliacoes"
                      onClick={toggleUserMenu}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-canvas"
                    >
                      <MessageSquareText aria-hidden="true" className="h-4 w-4" />
                      Minhas avaliações
                    </Link>
                    <button
                      type="button"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-ink hover:bg-canvas disabled:opacity-60"
                    >
                      <LogOut aria-hidden="true" className="h-4 w-4" />
                      {isLoggingOut ? "Saindo…" : "Sair da conta"}
                    </button>
                  </div>
                </div>
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
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

      <div id="mobile-menu" hidden={!mobileOpen} className="border-t border-line bg-surface md:hidden">
        <nav aria-label="Menu" className="container-page py-3">
          <ul className="space-y-0.5">
            <NavLinks vertical onNavigate={toggleMobile} />
          </ul>
          <div className="mt-3 border-t border-line pt-4">
            {isAuthenticated && user ? (
              <div className="space-y-3">
                <div className="flex items-center gap-3 px-1">
                  <span aria-hidden="true" className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                    {getInitials(user.name)}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-ink">{user.name}</p>
                    <p className="truncate text-sm text-muted">{user.email}</p>
                  </div>
                </div>
                <Link
                  to="/minhas-avaliacoes"
                  onClick={toggleMobile}
                  className="flex items-center gap-2 rounded-lg px-3 py-3 text-base font-semibold text-ink hover:bg-canvas"
                >
                  <MessageSquareText aria-hidden="true" className="h-5 w-5" />
                  Minhas avaliações
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={isLoggingOut}
                  className={cn(buttonVariants({ color: "outline" }), "w-full")}
                >
                  <LogOut aria-hidden="true" className="h-4 w-4" />
                  {isLoggingOut ? "Saindo…" : "Sair da conta"}
                </button>
              </div>
            ) : (
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
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};
