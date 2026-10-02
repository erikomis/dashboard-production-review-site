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

const dateTimeFormatter = new Intl.DateTimeFormat("pt-BR", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

const monthYearFormatter = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });

const relativeFormatter = new Intl.RelativeTimeFormat("pt-BR", { numeric: "auto" });

/**
 * A API devolve datas ISO-8601 em UTC com "Z" (ex.: "2026-10-02T02:14:49Z"); o Date converte
 * para o fuso do navegador. Datas antigas sem fuso são tratadas como UTC, como as novas.
 */
export const parseApiDate = (value?: string | null) => {
  if (!value) return null;
  const normalized = /T\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test(value) ? `${value}Z` : value;
  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
};

/** "2026-10-01T23:14:49Z" -> "1 de outubro de 2026" (no fuso do navegador) */
export const formatDate = (value?: string | null) => {
  const date = parseApiDate(value);
  return date ? dateFormatter.format(date) : "";
};

/** "2026-10-02T14:12:27Z" -> "2 de out. de 2026, 11:12" (no fuso do navegador) */
export const formatDateTime = (value?: string | null) => {
  const date = parseApiDate(value);
  return date ? dateTimeFormatter.format(date) : "";
};

/** "2026-10-02T02:14:27Z" -> "outubro de 2026" */
export const formatMonthYear = (value?: string | null) => {
  const date = parseApiDate(value);
  return date ? monthYearFormatter.format(date) : "";
};

const RELATIVE_STEPS: [Intl.RelativeTimeFormatUnit, number][] = [
  ["second", 60],
  ["minute", 60],
  ["hour", 24],
  ["day", 7],
  ["week", 4.35],
  ["month", 12],
  ["year", Number.POSITIVE_INFINITY],
];

/** "há 5 minutos", "ontem", "há 2 semanas" (referência: agora) */
export const formatRelative = (value?: string | null, now: Date = new Date()) => {
  const date = parseApiDate(value);
  if (!date) return "";
  let delta = (date.getTime() - now.getTime()) / 1000;
  if (Math.abs(delta) < 45) return "agora mesmo";
  for (const [unit, size] of RELATIVE_STEPS) {
    if (Math.abs(delta) < size) return relativeFormatter.format(Math.round(delta), unit);
    delta /= size;
  }
  return formatDate(value);
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
