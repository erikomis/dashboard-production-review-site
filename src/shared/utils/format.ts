const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const noteFormatter = new Intl.NumberFormat("pt-BR", {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("pt-BR");

/** "2026-10-01T23:14:49" -> "1 de outubro de 2026" */
export const formatDate = (value?: string | null) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormatter.format(date);
};

/** 4 -> "4,0" */
export const formatNote = (value: number) => noteFormatter.format(value);

export const formatInteger = (value: number) => integerFormatter.format(value);

/** pluralize(2, "avaliação", "avaliações") -> "2 avaliações" */
export const pluralize = (count: number, singular: string, plural: string) =>
  `${formatInteger(count)} ${count === 1 ? singular : plural}`;

export const getInitials = (name?: string | null) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase() || "?";
};

/** Só aceita caminhos internos ("/x"), evitando open redirect ("//evil.com"). */
export const safeRedirectPath = (value?: string) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/";
  return value;
};
