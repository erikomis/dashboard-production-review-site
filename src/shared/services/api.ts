import axios from "axios";
import { environment } from "@/environment/environment";

export const api = axios.create({
  baseURL: environment.apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

/** Origem da API (VITE_API_URL sem o /api/v1), ex.: "http://localhost:8084". */
export const apiOrigin = (() => {
  try {
    return new URL(environment.apiUrl).origin;
  } catch {
    return "";
  }
})();

/**
 * URLs de arquivos servidos pela API vêm relativas ("/api/v1/files/reviews/12/x.jpg"):
 * prefixa com a origem da API. URLs absolutas (http/https/data/blob) passam direto.
 */
export const resolveApiUrl = (url?: string | null) => {
  if (!url) return "";
  if (/^(https?:|data:|blob:)/i.test(url)) return url;
  return `${apiOrigin}${url.startsWith("/") ? "" : "/"}${url}`;
};
