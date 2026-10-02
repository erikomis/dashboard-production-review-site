import { Outlet } from "@tanstack/react-router";
import { SiteHeader } from "./SiteHeader";
import { SiteFooter } from "./SiteFooter";
import type { useLayoutSiteModel } from "./layout-site.model";

type LayoutSiteViewProps = ReturnType<typeof useLayoutSiteModel>;

export const LayoutSiteView = ({ mainRef, categories, ...headerProps }: LayoutSiteViewProps) => (
  <div className="flex min-h-screen flex-col">
    <a
      href="#conteudo"
      className="sr-only z-50 rounded-lg bg-ink px-4 py-3 font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
    >
      Pular para o conteúdo
    </a>
    <SiteHeader {...headerProps} />
    <main id="conteudo" ref={mainRef} tabIndex={-1} className="flex-1 focus:outline-none">
      <Outlet />
    </main>
    <SiteFooter
      categories={categories}
      isAuthenticated={headerProps.isAuthenticated}
      handleLogout={headerProps.handleLogout}
    />
  </div>
);
