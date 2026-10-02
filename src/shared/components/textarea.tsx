import React, { useId } from "react";
import { cn } from "../utils/utils";
import { Label } from "./label";
import { FieldMessage } from "./field-message";
import { describedBy } from "../utils/a11y";
import { fieldClassName } from "./input";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
  /** Texto exibido à direita do rótulo, ex. contador de caracteres */
  counter?: string;
  containerClassName?: string;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, counter, id, className, containerClassName, ...props }, ref) => {
    const autoId = useId();
    const fieldId = id ?? `${props.name ?? "field"}-${autoId}`;
    const messageId = `${fieldId}-message`;
    const counterId = `${fieldId}-counter`;
    const describedIds = [describedBy(messageId, error, hint), counter ? counterId : undefined]
      .filter(Boolean)
      .join(" ");

    return (
      <div className={cn("mb-4", containerClassName)}>
        <div className="flex items-baseline justify-between gap-3">
          <Label value={label} htmlFor={fieldId} />
          {counter && (
            <span id={counterId} className="text-xs tabular-nums text-muted">
              {counter}
            </span>
          )}
        </div>
        <textarea
          {...props}
          ref={ref}
          id={fieldId}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedIds || undefined}
          className={cn(
            fieldClassName,
            "min-h-[8rem] resize-y py-3 leading-relaxed",
            error ? "border-danger hover:border-danger" : "border-line-strong",
            className,
          )}
        />
        <FieldMessage id={messageId} error={error} hint={hint} />
      </div>
    );
  },
);

Textarea.displayName = "Textarea";

export { Textarea };
