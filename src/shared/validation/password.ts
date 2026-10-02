import { z } from "zod";

/** Mesma mensagem da API (PasswordPolicy): cadastro e redefinição de senha. */
export const PASSWORD_POLICY_MESSAGE = "A senha deve ter de 8 a 72 caracteres, com letras e números";
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 72;

/** Regras exibidas como checklist ao lado do campo (mesmas da API: \p{L} e \p{Nd}). */
export const PASSWORD_RULES = [
  { id: "length", label: `De ${PASSWORD_MIN} a ${PASSWORD_MAX} caracteres`, test: (v: string) => v.length >= PASSWORD_MIN && v.length <= PASSWORD_MAX },
  { id: "letter", label: "Pelo menos uma letra", test: (v: string) => /\p{L}/u.test(v) },
  { id: "number", label: "Pelo menos um número", test: (v: string) => /\p{Nd}/u.test(v) },
] as const;

/** Espelha o REGEX da API: ^(?=.*\p{L})(?=.*\p{Nd}).{8,72}$ */
export const PASSWORD_REGEX = /^(?=.*\p{L})(?=.*\p{Nd}).{8,72}$/u;

export const passwordPolicySchema = z
  .string()
  .regex(PASSWORD_REGEX, { message: PASSWORD_POLICY_MESSAGE });
