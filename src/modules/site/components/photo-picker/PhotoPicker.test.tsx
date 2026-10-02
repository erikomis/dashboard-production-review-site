import { useEffect } from "react";
import { describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { usePhotoPickerModel } from "./photo-picker.model";
import { PhotoPicker } from "./PhotoPicker";

const file = (name: string, type = "image/jpeg", size = 1024) => {
  const f = new File(["x"], name, { type });
  Object.defineProperty(f, "size", { value: size });
  return f;
};

const holder: { model?: ReturnType<typeof usePhotoPickerModel> } = {};
const Harness = () => {
  const photos = usePhotoPickerModel([{ id: 9, url: "/api/v1/files/reviews/2/a.jpg" }]);
  useEffect(() => {
    holder.model = photos;
  });
  return <PhotoPicker photos={photos} />;
};

describe("PhotoPicker", () => {
  it("valida tipo, tamanho e limite de 3 antes de enviar", async () => {
    const user = userEvent.setup({ applyAccept: false });
    render(<Harness />);
    expect(screen.getByRole("img", { name: /Prévia da foto 1/ })).toHaveAttribute(
      "src",
      "http://api.test/api/v1/files/reviews/2/a.jpg",
    );
    const input = screen.getByLabelText(/Adicionar foto/);
    await user.upload(input, [file("doc.gif", "image/gif"), file("grande.jpg", "image/jpeg", 6 * 1024 * 1024), file("ok.png", "image/png")]);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("“doc.gif” não é uma imagem JPEG, PNG ou WebP.");
    expect(alert).toHaveTextContent("“grande.jpg” tem 6 MB; o limite é 5 MB por foto.");
    expect(screen.getAllByRole("img")).toHaveLength(2);

    await user.upload(screen.getByLabelText(/Adicionar foto/), [file("b.jpg"), file("c.jpg")]);
    expect(screen.getByRole("alert")).toHaveTextContent("Limite de 3 fotos: “c.jpg” não foi adicionada.");
    expect(screen.getAllByRole("img")).toHaveLength(3);
    expect(screen.queryByLabelText(/Adicionar foto/)).not.toBeInTheDocument();
  });

  it("remove fotos e envia as novas com progresso", async () => {
    const user = userEvent.setup();
    render(<Harness />);
    await user.upload(screen.getByLabelText(/Adicionar foto/), [file("nova.webp", "image/webp")]);
    await user.click(screen.getByRole("button", { name: "Remover foto Foto 1" }));
    const upload = vi.fn(async (_f: File, onProgress: (p: number) => void) => {
      onProgress(50);
      return { id: 33 };
    });
    const remove = vi.fn(async () => {});
    let result;
    await waitFor(async () => {
      result = await holder.model!.sync(upload, remove);
    });
    expect(remove).toHaveBeenCalledWith(9);
    expect(upload).toHaveBeenCalledTimes(1);
    expect(result).toMatchObject({ uploaded: 1, removed: 1, failed: 0 });
  });
});
