import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { ReactNode } from "react";

export interface BreadcrumbItem {
  label: string;
  /** Elemento de link (ex.: <Link>) ou undefined para a página atual */
  link?: (children: ReactNode, className: string) => ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const linkClass =
  "rounded text-muted underline-offset-4 transition-colors hover:text-ink hover:underline";

export const Breadcrumb = ({ items }: BreadcrumbProps) => (
  <nav aria-label="Você está em" className="text-sm">
    <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
      <li className="flex items-center gap-1.5">
        <Link to="/" className={linkClass}>
          Início
        </Link>
      </li>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        return (
          <li key={`${item.label}-${idx}`} className="flex min-w-0 items-center gap-1.5">
            <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 text-muted" />
            {isLast || !item.link ? (
              <span aria-current={isLast ? "page" : undefined} className={isLast ? "truncate font-semibold text-ink" : "text-muted"}>
                {item.label}
              </span>
            ) : (
              item.link(item.label, linkClass)
            )}
          </li>
        );
      })}
    </ol>
  </nav>
);
