import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { StarRatingInput } from "./StarRatingInput";

const Controlled = ({ onChange, error }: { onChange?: (n: number) => void; error?: string }) => {
  const [value, setValue] = useState(0);
  return (
    <StarRatingInput
      name="note"
      legend="Sua nota"
      value={value}
      error={error}
      onChange={(n) => {
        setValue(n);
        onChange?.(n);
      }}
    />
  );
};

describe("StarRatingInput", () => {
  it("expõe um grupo de 5 rádios nomeados como 'N de 5 estrelas'", () => {
    render(<Controlled />);
    expect(screen.getByRole("group", { name: "Sua nota" })).toBeInTheDocument();
    const radios = screen.getAllByRole("radio");
    expect(radios).toHaveLength(5);
    expect(screen.getByRole("radio", { name: "3 de 5 estrelas" })).not.toBeChecked();
  });

  it("marca a nota escolhida com o mouse e com o teclado", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);
    await user.click(screen.getByText("4 de 5 estrelas"));
    expect(onChange).toHaveBeenLastCalledWith(4);
    expect(screen.getByRole("radio", { name: "4 de 5 estrelas" })).toBeChecked();
    expect(screen.getByText("4/5 · Bom")).toBeInTheDocument();

    await user.keyboard("{ArrowRight}");
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(screen.getByRole("radio", { name: "5 de 5 estrelas" })).toBeChecked();
  });

  it("liga a mensagem de erro ao grupo (aria-invalid + aria-describedby)", () => {
    render(<Controlled error="Selecione uma nota de 1 a 5 estrelas." />);
    const group = screen.getByRole("group", { name: "Sua nota" });
    expect(group).toHaveAttribute("aria-invalid", "true");
    expect(group).toHaveAccessibleDescription("Selecione uma nota de 1 a 5 estrelas.");
  });
});
