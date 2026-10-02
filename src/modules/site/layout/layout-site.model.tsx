import { FormEvent, useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { toast } from "react-toastify";
import { useMeQuery } from "@/shared/hooks/useMeQuery";
import { logoutService } from "@/shared/services/logout";
import { queryClient } from "@/shared/libs/react-query";
import { useQueryCategories } from "@/modules/site/hooks/useQueryCategories";
import { notificationKeys, useQueryUnreadCount } from "@/modules/site/hooks/useNotifications";

export const useLayoutSiteModel = () => {
  const navigate = useNavigate();
  const { data: user, isPending: isLoadingUser } = useMeQuery();
  const { data: categories } = useQueryCategories();
  // Mesmo cache do sino: o contador aparece também no menu do usuário
  const { data: unreadCount = 0 } = useQueryUnreadCount(!!user);

  const location = useRouterState({ select: (s) => s.location });
  const pathname = location.pathname;
  const hash = location.hash;
  const currentHref = location.href;
  const urlQuery = pathname === "/products" ? String((location.search as { q?: string }).q ?? "") : "";

  const [searchTerm, setSearchTerm] = useState(urlQuery);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuButtonRef = useRef<HTMLButtonElement>(null);
  const mobileButtonRef = useRef<HTMLButtonElement>(null);
  const mainRef = useRef<HTMLElement>(null);
  const isFirstRender = useRef(true);

  // Mantém o campo de busca sincronizado com ?q= da listagem
  const [syncedQuery, setSyncedQuery] = useState(urlQuery);
  if (syncedQuery !== urlQuery) {
    setSyncedQuery(urlQuery);
    setSearchTerm(urlQuery);
  }

  // Ao trocar de página: fecha menus e leva o foco para o conteúdo principal
  // (ou para a seção indicada no #hash, ex.: /#categorias)
  useEffect(() => {
    setMobileOpen(false);
    setUserMenuOpen(false);
    if (isFirstRender.current && !hash) {
      isFirstRender.current = false;
      return;
    }
    isFirstRender.current = false;
    // A página de destino pode carregar sob demanda: tenta achar o #hash por até ~2s
    let attempts = 0;
    let timer: number;
    const focusTarget = () => {
      const target = hash ? document.getElementById(hash) : null;
      if (target) {
        target.focus({ preventScroll: true });
        target.scrollIntoView({ block: "start" });
      } else if (hash && attempts++ < 20) {
        timer = window.setTimeout(focusTarget, 100);
      } else {
        mainRef.current?.focus({ preventScroll: true });
        if (!hash) window.scrollTo({ top: 0 });
      }
    };
    timer = window.setTimeout(focusTarget, 50);
    return () => window.clearTimeout(timer);
  }, [pathname, hash]);

  // Menu do usuário: fecha com Esc (devolvendo o foco) e com clique fora
  useEffect(() => {
    if (!userMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setUserMenuOpen(false);
        userMenuButtonRef.current?.focus();
      }
    };
    const onClick = (e: MouseEvent) => {
      if (!userMenuRef.current?.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [userMenuOpen]);

  // Menu mobile: fecha com Esc
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileOpen(false);
        mobileButtonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const onSearchSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const q = searchTerm.trim();
      setMobileOpen(false);
      navigate({ to: "/products", search: q ? { q } : {} });
    },
    [navigate, searchTerm],
  );

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logoutService();
      await queryClient.resetQueries({ queryKey: ["me"] });
      // Dados ligados à conta: "minhas avaliações" e as marcações de "útil"
      queryClient.removeQueries({ queryKey: ["reviews", "me"] });
      queryClient.removeQueries({ queryKey: notificationKeys.all });
      queryClient.removeQueries({ queryKey: ["preferences"] });
      queryClient.removeQueries({ queryKey: ["following"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["product"] });
      // Páginas da conta não fazem sentido sem login
      if (["/minhas-avaliacoes", "/notificacoes", "/preferencias", "/seguindo"].includes(pathname)) {
        navigate({ to: "/" });
      }
      setUserMenuOpen(false);
      setMobileOpen(false);
      toast.info("Você saiu da sua conta.");
    } catch {
      toast.error("Não foi possível sair. Tente novamente.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Telas de login/cadastro voltam para a página atual depois de entrar
  const loginRedirect = pathname === "/" ? undefined : currentHref;

  return {
    user,
    isAuthenticated: !!user,
    isLoadingUser,
    unreadCount,
    closeUserMenu: () => setUserMenuOpen(false),
    closeMobile: () => setMobileOpen(false),
    categories: categories ?? [],
    pathname,
    loginRedirect,
    searchTerm,
    setSearchTerm,
    onSearchSubmit,
    mobileOpen,
    toggleMobile: () => setMobileOpen((v) => !v),
    userMenuOpen,
    toggleUserMenu: () => setUserMenuOpen((v) => !v),
    handleLogout,
    isLoggingOut,
    userMenuRef,
    userMenuButtonRef,
    mobileButtonRef,
    mainRef,
  };
};
