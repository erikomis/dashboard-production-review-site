import { Check } from "lucide-react";
import { cn } from "@/shared/utils/utils";

interface FilterChipsProps {
  /** Nome do grupo, lido por leitores de tela (ex.: "Filtrar por categoria") */
  label: string;
  options: { value: number; label: string }[];
  /** Valor ativo; undefined = "Todas" */
  value?: number;
  onChange: (value: number | undefined) => void;
  allLabel?: string;
  /** id da região atualizada pelo filtro (aria-controls) */
  controls?: string;
  className?: string;
}

/** Grupo de chips de escolha única. O chip ativo leva aria-current="true". */
export const FilterChips = ({
  label,
  options,
  value,
  onChange,
  allLabel = "Todas",
  controls,
  className,
}: FilterChipsProps) => {
  const chips = [{ value: undefined as number | undefined, label: allLabel }, ...options];
  return (
    <div role="group" aria-label={label} className={cn("flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const active = chip.value === value;
        return (
          <button
            key={chip.value ?? "all"}
            type="button"
            onClick={() => onChange(chip.value)}
            aria-current={active ? "true" : undefined}
            aria-controls={controls}
            className={cn(
              "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition-colors",
              active
                ? "border-ink bg-ink text-white"
                : "border-line-strong/50 bg-surface text-ink hover:border-brand-600 hover:text-brand-700",
            )}
          >
            {active && <Check aria-hidden="true" className="h-4 w-4" />}
            {chip.label}
          </button>
        );
      })}
    </div>
  );
};
