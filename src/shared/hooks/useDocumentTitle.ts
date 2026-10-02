import { useSeo } from "./useSeo";

/** Atalho para páginas que só precisam de título (ex.: telas de conta, que não são indexadas). */
export const useDocumentTitle = (title?: string, options: { noindex?: boolean } = {}) =>
  useSeo({ title, noindex: options.noindex });
