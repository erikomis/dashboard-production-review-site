import type { RatingDistribution } from "@/shared/types/review";
import { formatInteger } from "@/shared/utils/format";
import { cn } from "@/shared/utils/utils";

interface RatingBreakdownProps {
  /** Quantidade de avaliações por nota, vinda de /review/product/{id}/summary */
  distribution: RatingDistribution;
  total: number;
  /** Nota filtrada no momento (1 a 5) */
  selected?: number;
  /** Quando informado, cada barra vira um botão que filtra a lista pela nota */
  onSelect?: (note: number | undefined) => void;
  /** id da lista filtrada (aria-controls) */
  controls?: string;
}

const NOTES = [5, 4, 3, 2, 1] as const;

const noteLabel = (note: number) => `${note} ${note === 1 ? "estrela" : "estrelas"}`;

/** Distribuição das notas (5 → 1) com barras proporcionais; opcionalmente um filtro clicável. */
export const RatingBreakdown = ({ distribution, total, selected, onSelect, controls }: RatingBreakdownProps) => {
  const rows = NOTES.map((note) => {
    const count = distribution[String(note) as keyof RatingDistribution] ?? 0;
    const pct = total ? Math.round((count / total) * 100) : 0;
    return { note, count, pct };
  });

  const bar = (pct: number, active: boolean) => (
    <span aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-line">
      <span className={cn("block h-full rounded-full", active ? "bg-brand-600" : "bg-star")} style={{ width: `${pct}%` }} />
    </span>
  );

  if (!onSelect) {
    return (
      <ul className="space-y-2" aria-label="Distribuição das notas">
        {rows.map(({ note, count, pct }) => (
          <li key={note} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-sm">
            <span className="font-medium text-ink-soft">{noteLabel(note)}</span>
            {bar(pct, false)}
            <span className="text-right tabular-nums text-muted">
              {pct}%<span className="sr-only"> ({formatInteger(count)} {count === 1 ? "avaliação" : "avaliações"})</span>
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div role="group" aria-label="Filtrar avaliações por nota" className="-mx-2 space-y-0.5">
      {rows.map(({ note, count, pct }) => {
        const active = selected === note;
        return (
          <button
            key={note}
            type="button"
            onClick={() => onSelect(active ? undefined : note)}
            aria-pressed={active}
            aria-controls={controls}
            disabled={count === 0 && !active}
            className={cn(
              "grid min-h-[2.75rem] w-full grid-cols-[4.5rem_1fr_3rem] items-center gap-3 rounded-lg px-2 text-left text-sm transition-colors",
              "hover:bg-canvas disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-transparent",
              active && "bg-brand-50 ring-1 ring-inset ring-brand-300 hover:bg-brand-50",
            )}
          >
            <span className={cn("font-medium", active ? "font-semibold text-brand-800" : "text-ink-soft")}>
              {noteLabel(note)}
            </span>
            {bar(pct, active)}
            <span className="text-right tabular-nums text-muted">
              {pct}%
              <span className="sr-only">
                , {formatInteger(count)} {count === 1 ? "avaliação" : "avaliações"}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
};
