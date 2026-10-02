import type { FormEvent } from "react";

export interface SearchComboboxProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  className?: string;
  size?: "md" | "lg";
  /** "dark" = sobre o hero índigo */
  tone?: "light" | "dark";
}
