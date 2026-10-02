import { useId, useState, type FormEvent, type KeyboardEvent } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useQuerySuggestions } from "@/modules/site/hooks/useQueryProducts";
import { SUGGEST_MIN_CHARS } from "@/modules/site/services/products.service";
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue";
import type { ProductSuggestion } from "@/shared/types/product";
import type { SearchComboboxProps } from "./search-combobox.type";

export const SUGGEST_DEBOUNCE_MS = 250;

/**
 * Autocompletar da busca (padrão ARIA combobox + listbox): sugestões com debounce a partir de
 * 2 caracteres, setas para navegar, Enter para abrir o produto ativo (ou buscar), Esc para fechar.
 */
export const useSearchComboboxModel = ({ id, value, onChange, onSubmit, className, size = "md", tone = "light" }: SearchComboboxProps) => {
  const navigate = useNavigate();
  const listboxId = `${id}-sugestoes`;
  const statusId = useId();
  const [focused, setFocused] = useState(false);
  const [dismissed, setDismissed] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  const term = value.trim();
  const debounced = useDebouncedValue(term, SUGGEST_DEBOUNCE_MS);
  const enabled = debounced.length >= SUGGEST_MIN_CHARS && term.length >= SUGGEST_MIN_CHARS;
  const query = useQuerySuggestions(enabled ? debounced : "");
  const suggestions: ProductSuggestion[] = enabled ? (query.data ?? []) : [];

  const open = focused && !dismissed && enabled && suggestions.length > 0;
  const noResults = focused && !dismissed && enabled && !query.isFetching && query.isSuccess && suggestions.length === 0;

  // Lista nova: nenhuma opção ativa
  const [listKey, setListKey] = useState("");
  const currentKey = suggestions.map((s) => s.id).join(",");
  if (currentKey !== listKey) {
    setListKey(currentKey);
    setActiveIndex(-1);
  }

  // Volta a mostrar a lista quando a pessoa digita de novo depois de um Esc
  const [lastTerm, setLastTerm] = useState(term);
  if (term !== lastTerm) {
    setLastTerm(term);
    setDismissed(false);
  }

  const select = (suggestion: ProductSuggestion) => {
    setDismissed(true);
    setActiveIndex(-1);
    onChange("");
    navigate({ to: "/products/$slug", params: { slug: suggestion.slug } });
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const count = suggestions.length;
    switch (e.key) {
      case "ArrowDown":
        if (!enabled || count === 0) return;
        e.preventDefault();
        setDismissed(false);
        setActiveIndex((i) => (open ? (i + 1) % count : 0));
        break;
      case "ArrowUp":
        if (!enabled || count === 0) return;
        e.preventDefault();
        setDismissed(false);
        setActiveIndex((i) => (open ? (i <= 0 ? count - 1 : i - 1) : count - 1));
        break;
      case "Enter":
        if (open && activeIndex >= 0 && suggestions[activeIndex]) {
          e.preventDefault();
          select(suggestions[activeIndex]);
        }
        // sem opção ativa: o Enter envia o formulário (busca na listagem)
        break;
      case "Escape":
        if (open || noResults) {
          e.preventDefault();
          setDismissed(true);
          setActiveIndex(-1);
        } else if (value) {
          e.preventDefault();
          onChange("");
        }
        break;
      case "Tab":
        setDismissed(true);
        break;
    }
  };

  const status = !focused || !enabled
    ? ""
    : open
      ? `${suggestions.length} ${suggestions.length === 1 ? "sugestão" : "sugestões"}. Use as setas para navegar e Enter para abrir.`
      : noResults
        ? "Nenhuma sugestão. Pressione Enter para buscar."
        : "";

  return {
    id,
    listboxId,
    statusId,
    value,
    onChange,
    onSubmit: (e: FormEvent<HTMLFormElement>) => {
      setDismissed(true);
      onSubmit(e);
    },
    className,
    size,
    tone,
    term,
    suggestions,
    open,
    noResults,
    activeIndex,
    activeId: open && activeIndex >= 0 ? `${id}-opcao-${activeIndex}` : undefined,
    optionId: (index: number) => `${id}-opcao-${index}`,
    setActiveIndex,
    isFetching: query.isFetching,
    onKeyDown,
    onFocus: () => setFocused(true),
    onBlur: () => {
      setFocused(false);
      setActiveIndex(-1);
    },
    select,
    status,
  };
};
