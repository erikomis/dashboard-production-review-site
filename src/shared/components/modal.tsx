import { useEffect, useId, useRef, type ReactNode, type RefObject } from "react";
import { X } from "lucide-react";
import { cn } from "../utils/utils";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: ReactNode;
  children?: ReactNode;
  /** Elemento que recebe o foco ao abrir (padrão: primeiro campo/botão) */
  initialFocusRef?: RefObject<HTMLElement | null>;
  /** Impede fechar (Esc, X, fundo) enquanto algo está sendo salvo */
  closeDisabled?: boolean;
  /** "alertdialog" para confirmações destrutivas */
  role?: "dialog" | "alertdialog";
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Diálogo modal acessível sobre o <dialog> nativo (showModal deixa o resto da página inerte):
 * foco preso dentro do diálogo, Esc fecha, título/descrição ligados por aria e o foco
 * volta para quem abriu o diálogo ao fechar.
 */
export const Modal = ({
  open,
  onClose,
  title,
  description,
  children,
  initialFocusRef,
  closeDisabled,
  role = "dialog",
  className,
}: ModalProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    const target = initialFocusRef?.current ?? dialog.querySelector<HTMLElement>(FOCUSABLE);
    target?.focus();
    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      const back = returnFocusRef.current;
      if (back && document.contains(back)) back.focus();
    };
  }, [open, initialFocusRef]);

  const requestClose = () => {
    if (!closeDisabled) onClose();
  };

  // Mantém o Tab circulando dentro do diálogo
  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key !== "Tab") return;
    const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []).filter(
      (el) => el.offsetParent !== null,
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  if (!open) return null;

  return (
    <dialog
      ref={dialogRef}
      role={role === "alertdialog" ? "alertdialog" : undefined}
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      onCancel={(e) => {
        // Esc: o fechamento é controlado pelo estado do React
        e.preventDefault();
        requestClose();
      }}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        // clique no fundo escurecido (fora da caixa) fecha
        if (e.target === dialogRef.current) requestClose();
      }}
      className={cn(
        "m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-2xl border-0 bg-surface p-0 text-ink shadow-raised",
        "backdrop:bg-[#0B1120]/65 backdrop:backdrop-blur-[2px] motion-safe:animate-pop-in dark:border dark:border-line",
        className,
      )}
    >
      <div className="p-6 sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-xl font-bold text-ink sm:text-2xl">
            {title}
          </h2>
          <button
            type="button"
            onClick={requestClose}
            disabled={closeDisabled}
            className="-mr-2 -mt-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-muted hover:bg-canvas hover:text-ink disabled:opacity-50"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Fechar</span>
          </button>
        </div>
        {description && (
          <div id={descriptionId} className="mt-2 text-sm leading-relaxed text-muted">
            {description}
          </div>
        )}
        <div className="mt-5">{children}</div>
      </div>
    </dialog>
  );
};
