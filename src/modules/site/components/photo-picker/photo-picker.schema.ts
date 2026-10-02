import {
  REVIEW_IMAGE_MAX_BYTES,
  REVIEW_IMAGE_MAX_COUNT,
  REVIEW_IMAGE_TYPES,
} from "@/modules/site/services/reviews.service";

export const PHOTO_ACCEPT = REVIEW_IMAGE_TYPES.join(",");
export const PHOTO_MAX_COUNT = REVIEW_IMAGE_MAX_COUNT;
export const PHOTO_MAX_BYTES = REVIEW_IMAGE_MAX_BYTES;
export const PHOTO_HINT = "JPEG, PNG ou WebP, até 5 MB cada. Máximo de 3 fotos por avaliação.";

const sizeFormatter = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 1 });
export const formatFileSize = (bytes: number) =>
  bytes >= 1024 * 1024 ? `${sizeFormatter.format(bytes / (1024 * 1024))} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

/** Valida tipo e tamanho antes de enviar (as mesmas regras da API). Devolve a mensagem de erro ou null. */
export const validatePhoto = (file: File): string | null => {
  if (!(REVIEW_IMAGE_TYPES as readonly string[]).includes(file.type)) {
    return `“${file.name}” não é uma imagem JPEG, PNG ou WebP.`;
  }
  if (file.size > PHOTO_MAX_BYTES) {
    return `“${file.name}” tem ${formatFileSize(file.size)}; o limite é 5 MB por foto.`;
  }
  return null;
};
