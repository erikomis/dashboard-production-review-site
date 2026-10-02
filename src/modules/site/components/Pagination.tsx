import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface PaginationProps {
  /** Página atual, base 0 (como na API) */
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  label?: string;
  className?: string;
}

/** Gera a lista de páginas com reticências: 1 … 4 5 6 … 10 (base 0). */
const getPageItems = (page: number, total: number): (number | "ellipsis")[] => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i);
  const items: (number | "ellipsis")[] = [0];
  const start = Math.max(1, page - 1);
  const end = Math.min(total - 2, page + 1);
  if (start > 1) items.push("ellipsis");
  for (let i = start; i <= end; i++) items.push(i);
  if (end < total - 2) items.push("ellipsis");
  items.push(total - 1);
  return items;
};

const itemClass =
  "inline-flex h-11 min-w-[2.75rem] items-center justify-center rounded-lg px-3 text-sm font-semibold transition-colors";

export const Pagination = ({ page, totalPages, onPageChange, label = "Paginação", className }: PaginationProps) => {
  if (totalPages <= 1) return null;
  const isFirst = page <= 0;
  const isLast = page >= totalPages - 1;

  return (
    <nav aria-label={label} className={cn("flex justify-center", className)}>
      <ul className="flex flex-wrap items-center justify-center gap-1.5">
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={isFirst}
            className={cn(itemClass, "gap-1 border border-line bg-surface text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line")}
          >
            <ChevronLeft aria-hidden="true" className="h-4 w-4" />
            <span>Anterior</span>
          </button>
        </li>
        {getPageItems(page, totalPages).map((item, idx) =>
          item === "ellipsis" ? (
            <li key={`e-${idx}`} aria-hidden="true" className="hidden px-1 text-muted sm:block">
              …
            </li>
          ) : (
            <li key={item} className="hidden sm:block">
              <button
                type="button"
                onClick={() => onPageChange(item)}
                aria-current={item === page ? "page" : undefined}
                aria-label={`Página ${item + 1}`}
                className={cn(
                  itemClass,
                  item === page
                    ? "bg-ink text-surface"
                    : "border border-transparent text-ink hover:border-line hover:bg-surface",
                )}
              >
                {item + 1}
              </button>
            </li>
          ),
        )}
        <li className="px-2 text-sm text-muted sm:hidden" aria-hidden="true">
          {page + 1} de {totalPages}
        </li>
        <li>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={isLast}
            className={cn(itemClass, "gap-1 border border-line bg-surface text-ink hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:border-line")}
          >
            <span>Próxima</span>
            <ChevronRight aria-hidden="true" className="h-4 w-4" />
          </button>
        </li>
      </ul>
    </nav>
  );
};
