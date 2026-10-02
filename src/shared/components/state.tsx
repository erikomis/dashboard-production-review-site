import type { ReactNode } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import { Button } from "./button";
import { cn } from "../utils/utils";

/**
 * Ilustração dos estados vazios: um "cartão de avaliação" com estrelas e o ícone do contexto
 * num selo. Decorativa (aria-hidden) e desenhada com os tokens de cor, então acompanha o tema.
 */
export const EmptyIllustration = ({ icon, className }: { icon?: ReactNode; className?: string }) => (
  <span aria-hidden="true" className={cn("relative mb-5 inline-block h-28 w-40", className)}>
    <svg viewBox="0 0 160 112" className="h-full w-full" fill="none">
      <ellipse cx="80" cy="104" rx="50" ry="6" className="fill-line" />
      <circle cx="28" cy="24" r="10" className="fill-tint-strong" />
      <circle cx="138" cy="70" r="6" className="fill-tint-strong" />
      <rect x="34" y="14" width="92" height="76" rx="14" className="fill-surface stroke-line" strokeWidth="2" />
      <circle cx="54" cy="36" r="8" className="fill-tint-strong" />
      <rect x="68" y="31" width="40" height="5" rx="2.5" className="fill-line" />
      <rect x="68" y="40" width="26" height="4" rx="2" className="fill-line" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          d="M0 -5.5l1.6 3.3 3.7.5-2.7 2.6.6 3.6L0 2.8l-3.2 1.7.6-3.6-2.7-2.6 3.7-.5z"
          transform={`translate(${52 + i * 12} 58)`}
          className={i < 4 ? "fill-star" : "fill-star-empty"}
        />
      ))}
      <rect x="46" y="70" width="68" height="4" rx="2" className="fill-line" />
      <rect x="46" y="78" width="48" height="4" rx="2" className="fill-line" />
    </svg>
    <span className="absolute -bottom-1 right-1 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-white shadow-raised ring-4 ring-canvas [&>svg]:h-6 [&>svg]:w-6">
      {icon ?? <SearchX />}
    </span>
  </span>
);

interface EmptyStateProps {
  title: string;
  description?: ReactNode;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  headingLevel?: "h1" | "h2" | "h3";
}

export const EmptyState = ({
  title,
  description,
  icon,
  action,
  className,
  headingLevel: Heading = "h2",
}: EmptyStateProps) => (
  <div
    className={cn(
      "flex flex-col items-center rounded-2xl border border-dashed border-line-strong/60 bg-surface px-6 py-12 text-center motion-safe:animate-fade-in",
      className,
    )}
  >
    <EmptyIllustration icon={icon} />
    <Heading className="text-lg font-semibold text-ink">{title}</Heading>
    {description && <div className="mt-1.5 max-w-md text-sm leading-relaxed text-muted">{description}</div>}
    {action && <div className="mt-5">{action}</div>}
  </div>
);

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState = ({
  title = "Não foi possível carregar",
  message = "Tente novamente em alguns instantes.",
  onRetry,
  className,
}: ErrorStateProps) => (
  <div role="alert" className={cn("flex flex-col items-center rounded-2xl border border-danger/30 bg-danger-soft px-6 py-10 text-center", className)}>
    <AlertTriangle aria-hidden="true" className="mb-3 h-8 w-8 text-danger" />
    <p className="text-lg font-semibold text-ink">{title}</p>
    <p className="mt-1 max-w-md text-sm text-ink-soft">{message}</p>
    {onRetry && (
      <Button color="outline" size="sm" className="mt-4" onClick={onRetry}>
        Tentar novamente
      </Button>
    )}
  </div>
);
