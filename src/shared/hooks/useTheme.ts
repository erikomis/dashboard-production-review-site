import { useCallback, useSyncExternalStore } from "react";
import {
  getThemePreference,
  resolveTheme,
  setThemePreference,
  subscribeTheme,
  type ResolvedTheme,
  type ThemePreference,
} from "../theme/theme";

// O snapshot inclui o tema efetivo: muda também quando o sistema troca de tema na preferência "system"
const getSnapshot = () => `${getThemePreference()}|${resolveTheme(getThemePreference())}`;
const getServerSnapshot = () => "system|light";

/** Preferência de tema (sistema/claro/escuro), tema efetivo e ações para trocar. */
export const useTheme = () => {
  const snapshot = useSyncExternalStore(subscribeTheme, getSnapshot, getServerSnapshot);
  const [preference, resolved] = snapshot.split("|") as [ThemePreference, ResolvedTheme];

  const toggle = useCallback(() => {
    setThemePreference(resolveTheme(getThemePreference()) === "dark" ? "light" : "dark");
  }, []);

  return {
    preference,
    resolved,
    isDark: resolved === "dark",
    setPreference: setThemePreference,
    toggle,
  };
};
