import type { ProductSort } from "@/shared/types/product";

export const PRODUCT_SORT_VALUES = ["recent", "name-asc", "name-desc", "rating", "popular"] as const satisfies readonly ProductSort[];

export const PRODUCT_SORT_OPTIONS: { value: ProductSort; label: string }[] = [
  { value: "recent", label: "Mais recentes" },
  { value: "rating", label: "Mais bem avaliados" },
  { value: "popular", label: "Mais avaliados" },
  { value: "name-asc", label: "Nome (A–Z)" },
  { value: "name-desc", label: "Nome (Z–A)" },
];
