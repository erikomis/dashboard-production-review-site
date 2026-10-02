import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { PASSWORD_POLICY_MESSAGE, passwordPolicySchema } from "./password";
import { SchemaSignUp } from "@/modules/auth/sign-up/sign-up.schema";
import { SchemaResetPassword } from "@/modules/auth/reset-password/reset-password.schema";
import { PasswordRequirements } from "@/shared/components/password-requirements";

describe("política de senha (igual à API)", () => {
  it.each([
    ["Senha123", true],
    ["açúcar99", true],
    ["12345678", false], // sem letra
    ["abcdefgh", false], // sem número
    ["abc12", false], // curta
    ["a1".repeat(36), true], // 72
    ["a1".repeat(36) + "x", false], // 73
  ])("%s → %s", (value, valid) => {
    expect(passwordPolicySchema.safeParse(value).success).toBe(valid);
  });

  it("usa a mesma mensagem da API", () => {
    const result = passwordPolicySchema.safeParse("curta");
    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(PASSWORD_POLICY_MESSAGE);
  });

  it("vale no cadastro e na redefinição", () => {
    const signUp = SchemaSignUp.safeParse({
      name: "Ana",
      username: "ana",
      email: "ana@email.com",
      password: "abcdefgh",
      confirmPassword: "abcdefgh",
    });
    expect(signUp.success).toBe(false);
    expect(signUp.error?.flatten().fieldErrors.password).toEqual([PASSWORD_POLICY_MESSAGE]);

    const reset = SchemaResetPassword.safeParse({
      email: "ana@email.com",
      recoveryCode: "123456",
      password: "Nova12345",
      confirmPassword: "Nova12345",
    });
    expect(reset.success).toBe(true);
  });

  it("mostra o checklist atualizado", () => {
    render(<PasswordRequirements value="abc1" />);
    expect(screen.getByText(/De 8 a 72 caracteres/)).toHaveTextContent("(pendente)");
    expect(screen.getByText(/Pelo menos uma letra/)).toHaveTextContent("(atendido)");
    expect(screen.getByText(/Pelo menos um número/)).toHaveTextContent("(atendido)");
  });
});
