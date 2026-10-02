import { useId, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { FieldMessage } from "@/shared/components/field-message";

interface StarRatingInputProps {
  name: string;
  value: number;
  onChange: (value: number) => void;
  legend: string;
  error?: string;
  disabled?: boolean;
}

const NOTE_LABELS = ["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"];

/**
 * Seletor de nota acessível: grupo de rádios nativos (setas do teclado mudam a
 * nota, Tab entra/sai do grupo). Cada opção é anunciada como "3 de 5 estrelas".
 */
export const StarRatingInput = ({
  name,
  value,
  onChange,
  legend,
  error,
  disabled,
}: StarRatingInputProps) => {
  const groupId = useId();
  const messageId = `${groupId}-message`;
  const [hover, setHover] = useState(0);
  const display = hover || value;

  return (
    <fieldset
      className="mb-5"
      aria-describedby={error ? messageId : undefined}
      aria-invalid={error ? true : undefined}
      disabled={disabled}
    >
      <legend className="mb-1.5 text-sm font-semibold text-ink">{legend}</legend>
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
        <div className="flex" onMouseLeave={() => setHover(0)}>
          {[1, 2, 3, 4, 5].map((n) => {
            const id = `${groupId}-${n}`;
            const active = n <= display;
            return (
              <span key={n} className="relative">
                <input
                  id={id}
                  type="radio"
                  name={name}
                  value={n}
                  checked={value === n}
                  onChange={() => onChange(n)}
                  aria-invalid={error ? true : undefined}
                  className="peer sr-only"
                />
                <label
                  htmlFor={id}
                  onMouseEnter={() => setHover(n)}
                  className={cn(
                    "flex h-11 w-11 cursor-pointer items-center justify-center rounded-md transition-transform",
                    "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-1 peer-focus-visible:outline-brand-600",
                    "motion-safe:hover:scale-110 peer-disabled:cursor-not-allowed",
                  )}
                >
                  <Star
                    aria-hidden="true"
                    strokeWidth={1.5}
                    className={cn(
                      "h-8 w-8 transition-colors",
                      active ? "fill-star text-star" : "fill-transparent text-line-strong",
                    )}
                  />
                  <span className="sr-only">
                    {n} de 5 estrelas
                  </span>
                </label>
              </span>
            );
          })}
        </div>
        <span className="min-w-[6rem] text-sm font-medium text-ink-soft" aria-hidden="true">
          {display ? `${display}/5 · ${NOTE_LABELS[display]}` : "Selecione"}
        </span>
      </div>
      <FieldMessage id={messageId} error={error} />
    </fieldset>
  );
};
