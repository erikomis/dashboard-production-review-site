import { useCallback, useEffect, useId, useRef, useState } from "react";
import { resolveApiUrl } from "@/shared/services/api";
import { HttpError } from "@/shared/services/http-error";
import type { ReviewImage } from "@/shared/types/review";
import { PHOTO_MAX_COUNT, validatePhoto } from "./photo-picker.schema";
import type { DeletePhotoFn, PhotoBatchResult, PhotoItem, UploadPhotoFn } from "./photo-picker.type";

const fromExisting = (images: ReviewImage[]): PhotoItem[] =>
  images.map((image, idx) => ({
    key: `existing-${image.id}`,
    kind: "existing",
    id: image.id,
    previewUrl: resolveApiUrl(image.url),
    name: `Foto ${idx + 1}`,
    status: "done",
    progress: 100,
  }));

const errorMessage = (error: unknown) =>
  error instanceof HttpError ? error.message : "Não foi possível enviar a foto. Tente novamente.";

/**
 * Seleção de fotos da avaliação: prévia, remoção, limite de 3, validação de tipo/tamanho
 * antes de enviar e progresso do envio. O envio acontece depois que a avaliação é salva.
 */
export const usePhotoPickerModel = (existing: ReviewImage[] = []) => {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<PhotoItem[]>(() => fromExisting(existing));
  const [removedIds, setRemovedIds] = useState<number[]>([]);
  const [messages, setMessages] = useState<string[]>([]);
  const [announcement, setAnnouncement] = useState("");
  const objectUrls = useRef(new Set<string>());

  // Libera as prévias (objectURL) ao desmontar
  useEffect(() => {
    const urls = objectUrls.current;
    return () => urls.forEach((url) => URL.revokeObjectURL(url));
  }, []);

  const remaining = PHOTO_MAX_COUNT - items.length;

  const addFiles = useCallback(
    (fileList: FileList | File[] | null) => {
      const files = Array.from(fileList ?? []);
      if (files.length === 0) return;
      const errors: string[] = [];
      const accepted: PhotoItem[] = [];
      let slots = PHOTO_MAX_COUNT - items.length;
      for (const file of files) {
        const invalid = validatePhoto(file);
        if (invalid) {
          errors.push(invalid);
          continue;
        }
        if (slots <= 0) {
          errors.push(`Limite de ${PHOTO_MAX_COUNT} fotos: “${file.name}” não foi adicionada.`);
          continue;
        }
        slots--;
        const previewUrl = URL.createObjectURL(file);
        objectUrls.current.add(previewUrl);
        accepted.push({
          key: `new-${previewUrl}`,
          kind: "new",
          file,
          previewUrl,
          name: file.name,
          status: "idle",
          progress: 0,
        });
      }
      if (accepted.length) setItems((prev) => [...prev, ...accepted]);
      setMessages(errors);
      setAnnouncement(
        accepted.length
          ? `${accepted.length === 1 ? "1 foto adicionada" : `${accepted.length} fotos adicionadas`}. ${
              PHOTO_MAX_COUNT - items.length - accepted.length
            } de ${PHOTO_MAX_COUNT} vagas restantes.`
          : "",
      );
      // Permite escolher o mesmo arquivo de novo depois de removê-lo
      if (inputRef.current) inputRef.current.value = "";
    },
    [items.length],
  );

  const remove = useCallback(
    (key: string) => {
      const item = items.find((i) => i.key === key);
      if (!item) return;
      if (item.kind === "new" && item.status !== "done") {
        URL.revokeObjectURL(item.previewUrl);
        objectUrls.current.delete(item.previewUrl);
      }
      const removedId = item.id;
      if (removedId !== undefined && (item.kind === "existing" || item.status === "done")) {
        setRemovedIds((ids) => [...ids, removedId]);
      }
      setItems((prev) => prev.filter((i) => i.key !== key));
      setAnnouncement(`Foto ${item.name} removida.`);
      setMessages([]);
    },
    [items],
  );

  const patch = (key: string, data: Partial<PhotoItem>) =>
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, ...data } : i)));

  /** Remove na API as fotos existentes que a pessoa tirou e envia as novas, uma por vez. */
  const sync = useCallback(
    async (upload: UploadPhotoFn, removeFn?: DeletePhotoFn): Promise<PhotoBatchResult> => {
      const result: PhotoBatchResult = { uploaded: 0, failed: 0, removed: 0 };
      if (removeFn) {
        for (const id of removedIds) {
          try {
            await removeFn(id);
            result.removed++;
          } catch (error) {
            result.failed++;
            result.firstError ??= errorMessage(error);
          }
        }
        setRemovedIds([]);
      }
      const pending = items.filter((i) => i.kind === "new" && i.status !== "done" && i.file);
      for (const item of pending) {
        patch(item.key, { status: "uploading", progress: 0, error: undefined });
        setAnnouncement(`Enviando ${item.name}…`);
        try {
          const created = await upload(item.file!, (progress) => patch(item.key, { progress }));
          patch(item.key, { status: "done", progress: 100, id: created.id });
          result.uploaded++;
        } catch (error) {
          const message = errorMessage(error);
          patch(item.key, { status: "error", error: message });
          result.failed++;
          result.firstError ??= message;
        }
      }
      if (pending.length) {
        setAnnouncement(
          result.failed ? `${result.failed} foto(s) não foram enviadas.` : `${pending.length === 1 ? "Foto enviada" : "Fotos enviadas"}.`,
        );
      }
      return result;
    },
    [items, removedIds],
  );

  /** Limpa a seleção (depois de publicar). */
  const reset = useCallback(() => {
    objectUrls.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrls.current.clear();
    setItems([]);
    setRemovedIds([]);
    setMessages([]);
  }, []);

  const isUploading = items.some((i) => i.status === "uploading");

  return {
    inputId,
    inputRef,
    items,
    remaining,
    canAdd: remaining > 0,
    messages,
    announcement,
    addFiles,
    remove,
    sync,
    reset,
    isUploading,
    hasChanges: removedIds.length > 0 || items.some((i) => i.kind === "new" && i.status !== "done"),
  };
};

export type PhotoPickerModel = ReturnType<typeof usePhotoPickerModel>;
