import { Link, Outlet } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Logo } from "@/modules/site/components/Logo";
import { StarRating } from "@/modules/site/components/StarRating";

export const LayoutAuth = () => {
  return (
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.1fr]">
      <a
        href="#conteudo"
        className="sr-only z-50 rounded-lg bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Pular para o conteúdo
      </a>

      {/* Painel da marca (apenas desktop) */}
      <aside aria-hidden="true" className="relative hidden overflow-hidden bg-brand-950 p-12 text-white lg:flex lg:flex-col">
        <div className="pointer-events-none absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-brand-600/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 right-0 h-[22rem] w-[22rem] rounded-full bg-star/20 blur-3xl" />
        <Logo tone="light" className="relative" />
        <div className="relative mt-auto max-w-md">
          <StarRating value={5} size="lg" decorative />
          <p className="mt-6 font-display text-4xl font-bold leading-tight">
            Cada avaliação ajuda alguém a escolher melhor.
          </p>
          <p className="mt-4 text-lg text-brand-100">
            Leia opiniões de quem já usou e compartilhe a sua experiência com a comunidade.
          </p>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col bg-canvas">
        <header className="container-page flex h-20 items-center justify-between lg:px-12">
          <Link to="/" className="rounded-md lg:hidden" aria-label="ReviewStore — página inicial">
            <Logo />
          </Link>
          <Link to="/" className="ml-auto inline-flex items-center gap-1.5 rounded-md text-sm font-semibold text-ink-soft hover:text-ink">
            <ArrowLeft aria-hidden="true" className="h-4 w-4" />
            Voltar ao site
          </Link>
        </header>
        <main id="conteudo" tabIndex={-1} className="flex flex-1 items-start justify-center px-4 pb-12 pt-4 focus:outline-none sm:items-center">
          <div className="w-full max-w-md rounded-2xl border border-line bg-surface p-6 shadow-card sm:p-9">
            <Outlet />
          </div>
        </main>
        <footer className="px-4 pb-6 text-center text-sm text-muted">
          © {new Date().getFullYear()} ReviewStore
        </footer>
      </div>
    </div>
  );
};
