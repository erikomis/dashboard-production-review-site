import { Check, Circle } from "lucide-react";
import { PASSWORD_RULES } from "../validation/password";
import { cn } from "../utils/utils";

/** Checklist da política de senha, atualizado enquanto a pessoa digita. */
export const PasswordRequirements = ({ value, className }: { value: string; className?: string }) => (
  <ul aria-label="Requisitos da senha" className={cn("-mt-2 mb-4 grid gap-1 text-sm sm:grid-cols-3", className)}>
    {PASSWORD_RULES.map((rule) => {
      const ok = rule.test(value);
      return (
        <li key={rule.id} className={cn("flex items-center gap-1.5", ok ? "text-success" : "text-muted")}>
          {ok ? <Check aria-hidden="true" className="h-4 w-4 shrink-0" /> : <Circle aria-hidden="true" className="h-3.5 w-3.5 shrink-0" />}
          <span>
            {rule.label}
            <span className="sr-only">{ok ? " (atendido)" : " (pendente)"}</span>
          </span>
        </li>
      );
    })}
  </ul>
);
