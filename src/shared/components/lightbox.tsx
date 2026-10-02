import { useEffect, useId, useRef } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { cn } from "../utils/utils";

export interface LightboxImage {
  src: string;
  /** Texto alternativo da foto (obrigatório) */
  alt: string;
}

interface LightboxProps {
  images: LightboxImage[];
  /** Foto aberta; null = fechado */
  index: number | null;
  onClose: () => void;
  onIndexChange: (index: number) => void;
  /** Contexto lido antes do contador, ex.: "Fotos da avaliação de Ana" */
  label?: string;
}

const FOCUSABLE = 'button:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])';

/**
 * Visualizador de fotos acessível sobre o <dialog> nativo: foco preso, Esc fecha,
 * setas ← → trocam a foto, cada imagem tem alt e o contador "Foto 2 de 3" é anunciado.
 * O foco volta para a miniatura que abriu o lightbox.
 */
export const Lightbox = ({ images, index, onClose, onIndexChange, label }: LightboxProps) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const open = index !== null && images.length > 0;
  const total = images.length;
  const current = open ? Math.min(Math.max(index ?? 0, 0), total - 1) : 0;
  const image = images[current];

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog || !open) return;
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    if (!dialog.open) dialog.showModal();
    const root = document.documentElement;
    const previousOverflow = root.style.overflow;
    root.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      if (dialog.open) dialog.close();
      root.style.overflow = previousOverflow;
      const back = returnFocusRef.current;
      if (back && document.contains(back)) back.focus();
    };
  }, [open]);

  if (!open || !image) return null;

  const go = (delta: number) => onIndexChange((current + delta + total) % total);

  const onKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "ArrowRight" && total > 1) {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft" && total > 1) {
      e.preventDefault();
      go(-1);
    } else if (e.key === "Home" && total > 1) {
      e.preventDefault();
      onIndexChange(0);
    } else if (e.key === "End" && total > 1) {
      e.preventDefault();
      onIndexChange(total - 1);
    } else if (e.key === "Tab") {
      // Mantém o Tab circulando dentro do lightbox
      const items = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE) ?? []);
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
    }
  };

  const navButton =
    "flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-40";

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={onKeyDown}
      onMouseDown={(e) => {
        if (e.target === dialogRef.current) onClose();
      }}
      className={cn(
        "on-dark m-0 h-[100dvh] max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-white",
        "backdrop:bg-[#0B1120]/90 backdrop:backdrop-blur-sm",
      )}
    >
      <div
        className="flex h-full flex-col"
        onMouseDown={(e) => {
          // clique fora da foto e dos botões fecha
          if (e.target === e.currentTarget) onClose();
        }}
      >
        <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <h2 id={titleId} className="font-sans text-sm font-semibold text-white" aria-live="polite">
            {label ? <span className="sr-only">{label}: </span> : null}
            Foto {current + 1} de {total}
          </h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
          >
            <X aria-hidden="true" className="h-5 w-5" />
            <span className="sr-only">Fechar visualização</span>
          </button>
        </div>

        <div
          className="flex min-h-0 flex-1 items-center justify-center gap-2 px-2 pb-6 sm:gap-4 sm:px-6"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          {total > 1 && (
            <button type="button" onClick={() => go(-1)} className={navButton}>
              <ChevronLeft aria-hidden="true" className="h-6 w-6" />
              <span className="sr-only">Foto anterior</span>
            </button>
          )}
          <figure className="flex h-full min-w-0 flex-1 items-center justify-center">
            <img
              key={image.src}
              src={image.src}
              alt={image.alt}
              className="max-h-full max-w-full rounded-xl object-contain shadow-raised motion-safe:animate-pop-in"
            />
          </figure>
          {total > 1 && (
            <button type="button" onClick={() => go(1)} className={navButton}>
              <ChevronRight aria-hidden="true" className="h-6 w-6" />
              <span className="sr-only">Próxima foto</span>
            </button>
          )}
        </div>
        {total > 1 && (
          <p className="pb-4 text-center text-xs text-brand-100">Use as setas ← → do teclado para navegar e Esc para fechar.</p>
        )}
      </div>
    </dialog>
  );
};
