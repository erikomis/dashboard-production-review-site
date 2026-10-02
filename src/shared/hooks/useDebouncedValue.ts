import { useEffect, useState } from "react";

/** Devolve `value` só depois de `delay` ms sem mudanças (ex.: busca enquanto digita). */
export const useDebouncedValue = <T,>(value: T, delay = 250) => {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(timer);
  }, [value, delay]);
  return debounced;
};
