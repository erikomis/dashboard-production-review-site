import { AlertCircle } from "lucide-react";

interface FieldMessageProps {
  id: string;
  error?: string;
  hint?: string;
}

/** Texto de ajuda/erro ligado ao campo via aria-describedby. */
export const FieldMessage = ({ id, error, hint }: FieldMessageProps) => {
  if (error) {
    return (
      <p id={id} className="mt-1.5 flex items-start gap-1.5 text-sm font-medium text-danger">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <span>{error}</span>
      </p>
    );
  }
  if (hint) {
    return (
      <p id={id} className="mt-1.5 text-sm text-muted">
        {hint}
      </p>
    );
  }
  return null;
};
