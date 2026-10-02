import { Link } from "@tanstack/react-router";
import { Logo } from "@/modules/site/components/Logo";
import type { useLayoutSiteModel } from "./layout-site.model";

type SiteFooterProps = Pick<ReturnType<typeof useLayoutSiteModel>, "categories" | "isAuthenticated" | "handleLogout">;

const linkClass = "rounded text-sm text-brand-100 transition-colors hover:text-white hover:underline underline-offset-4";

export const SiteFooter = ({ categories, isAuthenticated, handleLogout }: SiteFooterProps) => {
  return (
    <footer className="on-dark mt-20 bg-brand-950 text-brand-100">
      <div className="container-page grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="inline-block rounded-md" aria-label="ReviewStore — página inicial">
            <Logo tone="light" />
          </Link>
          <p className="mt-4 max-w-xs text-sm leading-relaxed">
            Avaliações escritas por quem usou de verdade. Compare notas, leia opiniões e compartilhe a sua experiência.
          </p>
        </div>

        <nav aria-labelledby="footer-explore">
          <h2 id="footer-explore" className="font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Explorar
          </h2>
          <ul className="mt-4 space-y-2.5">
            <li><Link to="/" className={linkClass}>Início</Link></li>
            <li><Link to="/products" className={linkClass}>Todos os produtos</Link></li>
            <li><Link to="/ranking" className={linkClass}>Mais bem avaliados</Link></li>
            <li><Link to="/products" search={{ sort: "popular" }} className={linkClass}>Mais avaliados</Link></li>
            <li><Link to="/" hash="avaliacoes-recentes" className={linkClass}>Avaliações recentes</Link></li>
          </ul>
        </nav>

        <nav aria-labelledby="footer-categories">
          <h2 id="footer-categories" className="font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Categorias
          </h2>
          <ul className="mt-4 space-y-2.5">
            {categories.length === 0 && <li className="text-sm">Em breve</li>}
            {categories.map((category) => (
              <li key={category.id}>
                <Link to="/categorias/$slug" params={{ slug: category.slug }} className={linkClass}>
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-labelledby="footer-account">
          <h2 id="footer-account" className="font-sans text-sm font-semibold uppercase tracking-wider text-white">
            Sua conta
          </h2>
          <ul className="mt-4 space-y-2.5">
            {isAuthenticated ? (
              <>
                <li><Link to="/minhas-avaliacoes" className={linkClass}>Minhas avaliações</Link></li>
                <li>
                  <button type="button" onClick={handleLogout} className={linkClass}>
                    Sair da conta
                  </button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login" className={linkClass}>Entrar</Link></li>
                <li><Link to="/sign-up" className={linkClass}>Criar conta</Link></li>
                <li><Link to="/forgot-password" className={linkClass}>Esqueci minha senha</Link></li>
              </>
            )}
          </ul>
        </nav>
      </div>
      <div className="border-t border-white/10">
        <div className="container-page flex flex-col gap-2 py-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ReviewStore. Todos os direitos reservados.</p>
          <p>As avaliações refletem a opinião de cada usuário.</p>
        </div>
      </div>
    </footer>
  );
};
