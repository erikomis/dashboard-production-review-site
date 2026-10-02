import { AlertCircle } from "lucide-react";
import type { ReactNode } from "react";

/** Mensagem de erro do servidor, anunciada imediatamente (role="alert"). */
export const FormAlert = ({ children }: { children?: ReactNode }) => (
  <div role="alert" className="empty:hidden">
    {children && (
      <div className="mb-5 flex items-start gap-2.5 rounded-lg border border-danger/25 bg-danger-soft px-4 py-3 text-sm font-medium text-danger">
        <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
        <div>{children}</div>
      </div>
    )}
  </div>
);
