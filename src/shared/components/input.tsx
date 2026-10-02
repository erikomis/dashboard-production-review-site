import { Eye, EyeOff } from "lucide-react";
import React, { useId, useState } from "react";
import { cn } from "../utils/utils";
import { Label } from "./label";
import { FieldMessage } from "./field-message";
import { describedBy } from "../utils/a11y";

export const fieldClassName =
  "block w-full rounded-lg border bg-surface px-3.5 text-base text-ink placeholder:text-muted/80 transition-colors hover:border-ink focus:border-brand-600 focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand-600/35 disabled:cursor-not-allowed disabled:bg-canvas";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Ícone decorativo à esquerda */
  icon?: React.ReactNode;
  optional?: boolean;
  containerClassName?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { label, error, hint, icon, optional, id, type = "text", className, containerClassName, ...props },
    ref,
  ) => {
    const autoId = useId();
    const inputId = id ?? `${props.name ?? "field"}-${autoId}`;
    const messageId = `${inputId}-message`;
    const [visible, setVisible] = useState(false);
    const isPassword = type === "password";

    return (
      <div className={cn("mb-4", containerClassName)}>
        <Label value={label} htmlFor={inputId} optional={optional} />
        <div className="relative">
          {icon && (
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-muted [&>svg]:h-5 [&>svg]:w-5"
            >
              {icon}
            </span>
          )}
          <input
            {...props}
            ref={ref}
            id={inputId}
            type={isPassword && visible ? "text" : type}
            aria-invalid={error ? true : undefined}
            aria-describedby={describedBy(messageId, error, hint)}
            className={cn(
              fieldClassName,
              "h-12",
              icon && "pl-11",
              isPassword && "pr-12",
              error ? "border-danger hover:border-danger" : "border-line-strong",
              className,
            )}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setVisible((v) => !v)}
              aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={visible}
              aria-controls={inputId}
              className="absolute inset-y-0 right-1 my-1 flex w-10 items-center justify-center rounded-md text-muted hover:text-ink"
            >
              {visible ? (
                <EyeOff aria-hidden="true" className="h-5 w-5" />
              ) : (
                <Eye aria-hidden="true" className="h-5 w-5" />
              )}
            </button>
          )}
        </div>
        <FieldMessage id={messageId} error={error} hint={hint} />
      </div>
    );
  },
);

Input.displayName = "Input";

export { Input };
