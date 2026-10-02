import { Loader2, Package, Search } from "lucide-react";
import { resolveApiUrl } from "@/shared/services/api";
import { highlightMatch } from "@/shared/utils/highlight";
import { cn } from "@/shared/utils/utils";
import type { useSearchComboboxModel } from "./search-combobox.model";

type SearchComboboxViewProps = ReturnType<typeof useSearchComboboxModel>;

export const SearchComboboxView = ({
  id,
  listboxId,
  statusId,
  value,
  onChange,
  onSubmit,
  className,
  size,
  tone,
  term,
  suggestions,
  open,
  noResults,
  activeIndex,
  activeId,
  optionId,
  setActiveIndex,
  isFetching,
  onKeyDown,
  onFocus,
  onBlur,
  select,
  status,
}: SearchComboboxViewProps) => (
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
      type="text"
      name="q"
      role="combobox"
      aria-autocomplete="list"
      aria-expanded={open}
      aria-controls={listboxId}
      aria-activedescendant={activeId}
      aria-describedby={statusId}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onKeyDown={onKeyDown}
      onFocus={onFocus}
      onBlur={onBlur}
      placeholder="Buscar produtos…"
      autoComplete="off"
      autoCapitalize="none"
      spellCheck={false}
      enterKeyHint="search"
      className={cn(
        "w-full rounded-full border pl-10 text-ink placeholder:text-muted focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35",
        size === "lg" ? "h-14 pr-32 text-base" : "h-11 pr-24 text-sm",
        tone === "dark" ? "border-transparent bg-surface shadow-raised dark:border-white/15" : "border-line-strong bg-surface",
      )}
    />
    {isFetching && term.length >= 2 && (
      <Loader2
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 h-4 w-4 -translate-y-1/2 text-muted motion-safe:animate-spin",
          size === "lg" ? "right-36" : "right-[6.5rem]",
        )}
      />
    )}
    <button
      type="submit"
      className={cn(
        "absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary font-semibold text-white transition-colors hover:bg-primary-hover",
        size === "lg" ? "h-11 px-6 text-base" : "h-8 px-4 text-sm",
      )}
    >
      Buscar
    </button>

    <span id={statusId} className="sr-only" aria-live="polite">
      {status}
    </span>

    <ul
      id={listboxId}
      role="listbox"
      aria-label="Sugestões de produtos"
      hidden={!open}
      className="absolute inset-x-0 top-full z-50 mt-2 max-h-[22rem] overflow-y-auto rounded-2xl border border-line bg-surface p-1.5 text-left shadow-raised motion-safe:animate-fade-in"
    >
      {suggestions.map((suggestion, index) => {
        const active = index === activeIndex;
        return (
          <li
            key={suggestion.id}
            id={optionId(index)}
            role="option"
            aria-selected={active}
            // mousedown no lugar de click: o input não perde o foco antes da escolha
            onMouseDown={(e) => {
              e.preventDefault();
              select(suggestion);
            }}
            onMouseMove={() => setActiveIndex(index)}
            className={cn(
              "flex cursor-pointer items-center gap-3 rounded-xl px-2.5 py-2",
              active ? "bg-tint ring-1 ring-inset ring-brand-300/70" : "hover:bg-canvas",
            )}
          >
            <span aria-hidden="true" className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-line bg-white">
              {suggestion.imageUrl ? (
                <img src={resolveApiUrl(suggestion.imageUrl)} alt="" className="h-full w-full object-contain p-0.5" />
              ) : (
                <Package className="h-5 w-5 text-[#3040B8]" strokeWidth={1.5} />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-medium text-ink">
                {highlightMatch(suggestion.name, term).map((part, i) =>
                  part.match ? (
                    <mark key={i} className="rounded-sm bg-transparent font-bold text-brand-800">
                      {part.text}
                    </mark>
                  ) : (
                    <span key={i}>{part.text}</span>
                  ),
                )}
              </span>
              {suggestion.categoryName && <span className="block truncate text-xs text-muted">{suggestion.categoryName}</span>}
            </span>
          </li>
        );
      })}
    </ul>

    {noResults && (
      <div className="absolute inset-x-0 top-full z-50 mt-2 rounded-2xl border border-line bg-surface px-4 py-3 text-left text-sm text-muted shadow-raised">
        Nenhuma sugestão para “{term}”. Pressione Enter para buscar em todo o catálogo.
      </div>
    )}
  </form>
);
