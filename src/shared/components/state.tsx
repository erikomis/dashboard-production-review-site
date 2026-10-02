import type { ReactNode } from "react";
import { AlertTriangle, SearchX } from "lucide-react";
import { Button } from "./button";
import { cn } from "../utils/utils";

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
      "flex flex-col items-center rounded-2xl border border-dashed border-line-strong/60 bg-surface px-6 py-12 text-center",
      className,
    )}
  >
    <span aria-hidden="true" className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-700 [&>svg]:h-7 [&>svg]:w-7">
      {icon ?? <SearchX />}
    </span>
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
