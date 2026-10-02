/** id da mensagem de ajuda/erro para aria-describedby, quando houver mensagem. */
export const describedBy = (id: string, error?: string, hint?: string) =>
  error || hint ? id : undefined;
