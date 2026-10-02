import { useState, type DragEvent } from "react";
import { AlertCircle, ImagePlus, Loader2, X } from "lucide-react";
import { cn } from "@/shared/utils/utils";
import { PHOTO_ACCEPT, PHOTO_HINT, PHOTO_MAX_COUNT } from "./photo-picker.schema";
import type { PhotoPickerModel } from "./photo-picker.model";

interface PhotoPickerProps {
  photos: PhotoPickerModel;
  disabled?: boolean;
  label?: string;
}

/** Campo de fotos da avaliação (apresentação): botão de escolher, arrastar e soltar, prévias e progresso. */
export const PhotoPicker = ({ photos, disabled, label = "Fotos" }: PhotoPickerProps) => {
  const { inputId, inputRef, items, remaining, canAdd, messages, announcement, addFiles, remove } = photos;
  const [dragging, setDragging] = useState(false);
  const hintId = `${inputId}-hint`;
  const errorId = `${inputId}-error`;
  const blocked = disabled || !canAdd;

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (!blocked) addFiles(e.dataTransfer.files);
  };

  return (
    <div className="mb-5">
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        <p className="text-sm font-semibold text-ink">
          {label} <span className="font-normal text-muted">(opcional)</span>
        </p>
        <span className="text-xs tabular-nums text-muted">
          {items.length}/{PHOTO_MAX_COUNT} fotos
        </span>
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          if (!blocked) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          "rounded-xl border-2 border-dashed p-3 transition-colors",
          dragging ? "border-brand-600 bg-tint" : "border-line-strong/50 bg-canvas/60",
        )}
      >
        <ul className="flex flex-wrap gap-3" aria-label="Fotos escolhidas">
          {items.map((item, idx) => (
            <li
              key={item.key}
              className="relative h-24 w-24 overflow-hidden rounded-lg border border-line bg-surface motion-safe:animate-pop-in"
            >
              <img
                src={item.previewUrl}
                alt={`Prévia da foto ${idx + 1}: ${item.name}`}
                className={cn("h-full w-full object-cover", item.status === "uploading" && "opacity-60")}
              />
              {item.status === "uploading" && (
                <div className="absolute inset-x-1.5 bottom-1.5">
                  <div
                    role="progressbar"
                    aria-label={`Enviando ${item.name}`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={item.progress}
                    className="h-1.5 overflow-hidden rounded-full bg-white/70"
                  >
                    <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${item.progress}%` }} />
                  </div>
                  <Loader2 aria-hidden="true" className="absolute -top-12 left-1/2 h-5 w-5 -translate-x-1/2 text-primary motion-safe:animate-spin" />
                </div>
              )}
              {item.status === "error" && (
                <span className="absolute inset-x-0 bottom-0 bg-danger-solid px-1 py-0.5 text-center text-[0.7rem] font-semibold text-white">
                  Falhou
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(item.key)}
                disabled={disabled || item.status === "uploading"}
                className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-full bg-[#0B1120]/75 text-white hover:bg-[#0B1120] disabled:opacity-50"
              >
                <X aria-hidden="true" className="h-4 w-4" />
                <span className="sr-only">Remover foto {item.name}</span>
              </button>
            </li>
          ))}
          {canAdd && (
            <li>
              <input
                ref={inputRef}
                id={inputId}
                type="file"
                accept={PHOTO_ACCEPT}
                multiple
                disabled={blocked}
                onChange={(e) => addFiles(e.target.files)}
                aria-describedby={[hintId, messages.length ? errorId : ""].filter(Boolean).join(" ")}
                className="peer sr-only"
              />
              <label
                htmlFor={inputId}
                className={cn(
                  "flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-line-strong/60 bg-surface text-center text-xs font-semibold text-brand-700 transition-colors hover:border-brand-600 hover:bg-tint",
                  "peer-focus-visible:outline peer-focus-visible:outline-[3px] peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[var(--focus-ring)]",
                  "peer-disabled:cursor-not-allowed peer-disabled:opacity-60",
                )}
              >
                <ImagePlus aria-hidden="true" className="h-6 w-6" />
                Adicionar foto
                <span className="sr-only">
                  {" "}
                  ({remaining} de {PHOTO_MAX_COUNT} restantes)
                </span>
              </label>
            </li>
          )}
        </ul>
        <p id={hintId} className="mt-2 text-xs text-muted">
          {PHOTO_HINT} Você também pode arrastar as fotos para cá.
        </p>
      </div>

      <div role="alert" className="empty:hidden">
        {messages.length > 0 && (
          <ul id={errorId} className="mt-2 space-y-1 text-sm font-medium text-danger">
            {messages.map((message) => (
              <li key={message} className="flex items-start gap-1.5">
                <AlertCircle aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
                {message}
              </li>
            ))}
          </ul>
        )}
      </div>
      {items.some((i) => i.status === "error") && (
        <p className="mt-2 text-sm text-danger">
          {items.find((i) => i.status === "error")?.error}
        </p>
      )}
      <p className="sr-only" aria-live="polite">
        {announcement}
      </p>
    </div>
  );
};
