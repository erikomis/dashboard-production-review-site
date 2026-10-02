import * as React from "react";
import { cn } from "../utils/utils";
import { Spinner } from "./spinner";
import { buttonVariants } from "./button-variants";



export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  color?: "default" | "outline" | "ghost" | "link" | "danger" | "light";
  size?: "default" | "sm" | "lg" | "icon";
  /** Mostra spinner e marca o botão como ocupado. */
  loading?: boolean;
  children?: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ color, size, loading, children, className, type = "button", onClick, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(buttonVariants({ color, size }), className)}
        // Durante o carregamento usamos aria-disabled (e não disabled) para o
        // botão não perder o foco do teclado; o clique é ignorado.
        aria-disabled={loading || undefined}
        aria-busy={loading || undefined}
        onClick={(e) => {
          if (loading) {
            e.preventDefault();
            return;
          }
          onClick?.(e);
        }}
        {...props}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";

export { Button };
