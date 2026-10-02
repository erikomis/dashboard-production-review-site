import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Lightbox } from "./lightbox";

const images = [
  { src: "/a.jpg", alt: "Foto 1 da avaliação" },
  { src: "/b.jpg", alt: "Foto 2 da avaliação" },
  { src: "/c.jpg", alt: "Foto 3 da avaliação" },
];

const Harness = ({ onClose = vi.fn() }: { onClose?: () => void }) => {
  const [index, setIndex] = useState<number | null>(null);
  return (
    <>
      <button type="button" onClick={() => setIndex(0)}>
        Abrir fotos
      </button>
      <Lightbox
        images={images}
        index={index}
        onIndexChange={setIndex}
        onClose={() => {
          onClose();
          setIndex(null);
        }}
        label="Fotos da avaliação de Ana"
      />
    </>
  );
};

describe("Lightbox", () => {
  it("abre como diálogo modal com contador, alt e foco no botão de fechar", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir fotos" }));
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAccessibleName(/Foto 1 de 3/);
    expect(screen.getByRole("img", { name: "Foto 1 da avaliação" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Fechar visualização" })).toHaveFocus();
  });

  it("navega com as setas do teclado (com volta ao início)", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir fotos" }));
    await user.keyboard("{ArrowRight}");
    expect(screen.getByRole("img", { name: "Foto 2 da avaliação" })).toBeInTheDocument();
    await user.keyboard("{ArrowLeft}{ArrowLeft}");
    expect(screen.getByRole("img", { name: "Foto 3 da avaliação" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Próxima foto" }));
    expect(screen.getByRole("dialog")).toHaveAccessibleName(/Foto 1 de 3/);
  });

  it("prende o foco: Tab no último botão volta para o primeiro", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.click(screen.getByRole("button", { name: "Abrir fotos" }));
    screen.getByRole("button", { name: "Próxima foto" }).focus();
    await user.tab();
    expect(screen.getByRole("button", { name: "Fechar visualização" })).toHaveFocus();
  });

  it("fecha com Esc e devolve o foco para quem abriu", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<Harness onClose={onClose} />);
    const opener = screen.getByRole("button", { name: "Abrir fotos" });
    await user.click(opener);
    // Esc no <dialog> dispara o evento "cancel"
    fireEvent(screen.getByRole("dialog"), new Event("cancel", { cancelable: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(opener).toHaveFocus();
  });
});
