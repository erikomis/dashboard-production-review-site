import type { FormEvent } from "react";
import { Search } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface SearchFormProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  size?: "md" | "lg";
  tone?: "light" | "dark";
}

/** Busca de produtos por nome (usa ?search= de /production/list). */
export const SearchForm = ({ id, value, onChange, onSubmit, className, size = "md", tone = "light" }: SearchFormProps) => (
  <form role="search" aria-label="Buscar produtos" onSubmit={onSubmit} className={cn("relative w-full", className)}>
    <label htmlFor={id} className="sr-only">
      Buscar produtos
    </label>
    <Search
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted",
        size === "lg" ? "h-5 w-5" : "h-4 w-4",
      )}
    />
    <input
      id={id}
      type="search"
      name="q"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Buscar produtos…"
      autoComplete="off"
      enterKeyHint="search"
      className={cn(
        "w-full rounded-full border pl-10 text-ink placeholder:text-muted focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35",
        size === "lg" ? "h-14 pr-32 text-base" : "h-11 pr-24 text-sm",
        tone === "dark" ? "border-transparent bg-white" : "border-line-strong bg-surface",
      )}
    />
    <button
      type="submit"
      className={cn(
        "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-brand-600 font-semibold text-white hover:bg-brand-700",
        size === "lg" ? "h-11 px-6 text-base" : "h-8 px-4 text-sm",
      )}
    >
      Buscar
    </button>
  </form>
);
