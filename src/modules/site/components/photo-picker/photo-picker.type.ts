export type PhotoStatus = "idle" | "uploading" | "done" | "error";

export interface PhotoItem {
  /** Chave estável da lista */
  key: string;
  /** "existing" = já está na avaliação; "new" = escolhida agora, ainda não enviada */
  kind: "existing" | "new";
  /** id da imagem na API (fotos existentes e já enviadas) */
  id?: number;
  file?: File;
  /** URL para a prévia (objectURL das novas ou URL absoluta da API) */
  previewUrl: string;
  name: string;
  status: PhotoStatus;
  /** 0–100 durante o envio */
  progress: number;
  error?: string;
}

/** Função que envia um arquivo e informa o progresso; devolve o id criado. */
export type UploadPhotoFn = (file: File, onProgress: (percent: number) => void) => Promise<{ id: number }>;
export type DeletePhotoFn = (imageId: number) => Promise<void>;

export interface PhotoBatchResult {
  uploaded: number;
  failed: number;
  removed: number;
  /** Mensagem do primeiro erro, se houver */
  firstError?: string;
}
