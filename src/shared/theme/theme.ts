/**
 * Tema do site: "system" segue o prefers-color-scheme; "light"/"dark" é a escolha manual,
 * salva no localStorage. O script inline do index.html aplica o mesmo cálculo antes da
 * primeira pintura (sem "flash" ao carregar) — mantenha a chave igual nos dois lugares.
 */
export type ThemePreference = "system" | "light" | "dark";
export type ResolvedTheme = "light" | "dark";

export const THEME_STORAGE_KEY = "reviewstore-theme";
const DARK_QUERY = "(prefers-color-scheme: dark)";
const THEME_COLORS: Record<ResolvedTheme, string> = { light: "#3C50E0", dark: "#0B1120" };

const listeners = new Set<() => void>();

const readStored = (): ThemePreference => {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : "system";
  } catch {
    return "system";
  }
};

const systemPrefersDark = () =>
  typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(DARK_QUERY).matches;

let preference: ThemePreference = typeof window === "undefined" ? "system" : readStored();

export const resolveTheme = (pref: ThemePreference): ResolvedTheme =>
  pref === "system" ? (systemPrefersDark() ? "dark" : "light") : pref;

/** Aplica a classe .dark e o color-scheme no <html>. */
export const applyTheme = (pref: ThemePreference = preference) => {
  const resolved = resolveTheme(pref);
  const root = document.documentElement;
  root.classList.toggle("dark", resolved === "dark");
  root.style.colorScheme = resolved;
  document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLORS[resolved]);
  return resolved;
};

const emit = () => listeners.forEach((listener) => listener());

export const getThemePreference = () => preference;

export const setThemePreference = (next: ThemePreference) => {
  preference = next;
  try {
    if (next === "system") window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, next);
  } catch {
    // modo privado/sem storage: vale só para esta visita
  }
  applyTheme(next);
  emit();
};

/** Assina mudanças de preferência (e do tema do sistema, quando a escolha é "system"). */
export const subscribeTheme = (listener: () => void) => {
  listeners.add(listener);
  const media = typeof window.matchMedia === "function" ? window.matchMedia(DARK_QUERY) : null;
  const onSystemChange = () => {
    if (preference === "system") {
      applyTheme("system");
      listener();
    }
  };
  media?.addEventListener?.("change", onSystemChange);
  return () => {
    listeners.delete(listener);
    media?.removeEventListener?.("change", onSystemChange);
  };
};

/** Usado nos testes para voltar ao estado inicial. */
export const resetThemeForTests = () => {
  preference = readStored();
};
