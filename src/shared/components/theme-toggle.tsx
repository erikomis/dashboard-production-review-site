import { Moon, Sun } from "lucide-react";
import { useTheme } from "../hooks/useTheme";
import { cn } from "../utils/utils";

interface ThemeToggleProps {
  className?: string;
  /** Mostra o texto ao lado do ícone (menu mobile) */
  showLabel?: boolean;
}

/** Alterna entre tema claro e escuro (a escolha fica salva; "Automático" em Preferências). */
export const ThemeToggle = ({ className, showLabel }: ThemeToggleProps) => {
  const { isDark, toggle } = useTheme();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={isDark}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-full text-ink-soft transition-colors hover:bg-canvas hover:text-ink",
        showLabel ? "px-3 text-base font-semibold" : "w-11",
        className,
      )}
    >
      <span aria-hidden="true" className="relative h-5 w-5">
        <Sun className={cn("absolute inset-0 h-5 w-5 transition-all duration-300", isDark ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100")} />
        <Moon className={cn("absolute inset-0 h-5 w-5 transition-all duration-300", isDark ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-0 opacity-0")} />
      </span>
      <span className={showLabel ? undefined : "sr-only"}>Tema escuro</span>
    </button>
  );
};
