import { formatInteger } from "@/shared/utils/format";

interface RatingBreakdownProps {
  /** Quantidade de avaliações por nota: índice 0 = 1 estrela ... 4 = 5 estrelas */
  counts: number[];
  /** Quantidade de avaliações usadas no cálculo */
  sampleSize: number;
}

/** Distribuição das notas (5 → 1) com barras proporcionais. */
export const RatingBreakdown = ({ counts, sampleSize }: RatingBreakdownProps) => (
  <ul className="space-y-2" aria-label="Distribuição das notas">
    {[5, 4, 3, 2, 1].map((note) => {
      const count = counts[note - 1] ?? 0;
      const pct = sampleSize ? Math.round((count / sampleSize) * 100) : 0;
      return (
        <li key={note} className="grid grid-cols-[4.5rem_1fr_3rem] items-center gap-3 text-sm">
          <span className="font-medium text-ink-soft">
            {note} {note === 1 ? "estrela" : "estrelas"}
          </span>
          <span aria-hidden="true" className="h-2.5 overflow-hidden rounded-full bg-[#E2E8F0]">
            <span className="block h-full rounded-full bg-star" style={{ width: `${pct}%` }} />
          </span>
          <span className="text-right tabular-nums text-muted">
            {pct}%<span className="sr-only"> ({formatInteger(count)} {count === 1 ? "avaliação" : "avaliações"})</span>
          </span>
        </li>
      );
    })}
  </ul>
);
