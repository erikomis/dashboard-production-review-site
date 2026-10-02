import { useEffect } from "react";

const SITE_NAME = "ReviewStore";

/** Define o <title> da página (anunciado por leitores de tela ao navegar). */
export const useDocumentTitle = (title?: string) => {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : `${SITE_NAME} — Avaliações reais de produtos`;
  }, [title]);
};
