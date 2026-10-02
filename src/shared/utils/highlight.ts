/** Remove acentos e passa para minúsculas, caractere a caractere (mantém o comprimento). */
const fold = (text: string) =>
  Array.from(text, (ch) => ch.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase().charAt(0) || ch);

/**
 * Divide `text` em partes destacando a primeira ocorrência de `term`, ignorando acentos e
 * maiúsculas ("cafe" destaca "Café"). Sem ocorrência, devolve o texto inteiro sem destaque.
 */
export const highlightMatch = (text: string, term: string): { text: string; match: boolean }[] => {
  const needle = fold(term.trim()).join("");
  if (!needle) return [{ text, match: false }];
  const chars = Array.from(text);
  const haystack = fold(text).join("");
  const index = haystack.indexOf(needle);
  if (index < 0) return [{ text, match: false }];
  const parts = [
    { text: chars.slice(0, index).join(""), match: false },
    { text: chars.slice(index, index + needle.length).join(""), match: true },
    { text: chars.slice(index + needle.length).join(""), match: false },
  ];
  return parts.filter((p) => p.text);
};
