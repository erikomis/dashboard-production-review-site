import { useState } from "react";
import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { ProductsService } from "@/modules/site/services/products.service";
import { SearchCombobox } from "./SearchCombobox";

const suggestions = [
  { id: 37, name: "Café Em Cápsula Intenso", slug: "cafe-em-capsula", imageUrl: "https://img.test/1.jpg", categoryName: "Bebidas" },
  { id: 40, name: "Café Instantâneo", slug: "cafe-instantaneo", imageUrl: null, categoryName: "Bebidas" },
];

const Search = ({ onSubmit = vi.fn() }: { onSubmit?: () => void }) => {
  const [value, setValue] = useState("");
  return (
    <SearchCombobox
      id="busca"
      value={value}
      onChange={setValue}
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    />
  );
};

describe("SearchCombobox (autocompletar)", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("só busca a partir de 2 caracteres e mostra a lista com miniatura e categoria", async () => {
    const suggest = vi.spyOn(ProductsService, "suggest").mockResolvedValue(suggestions);
    const user = userEvent.setup();
    await renderWithProviders(<Search />);
    const input = screen.getByRole("combobox", { name: "Buscar produtos" });
    expect(input).toHaveAttribute("aria-expanded", "false");

    await user.type(input, "c");
    await new Promise((r) => setTimeout(r, 350));
    expect(suggest).not.toHaveBeenCalled();

    await user.type(input, "a");
    const listbox = await screen.findByRole("listbox", { name: "Sugestões de produtos" });
    expect(suggest).toHaveBeenCalledWith("ca", 8, expect.anything());
    expect(input).toHaveAttribute("aria-expanded", "true");
    expect(input).toHaveAttribute("aria-controls", listbox.id);
    const options = screen.getAllByRole("option");
    expect(options).toHaveLength(2);
    expect(options[0]).toHaveTextContent("Café Em Cápsula Intenso");
    expect(options[0]).toHaveTextContent("Bebidas");
    expect(screen.getByText(/2 sugestões/)).toBeInTheDocument();
  });

  it("setas movem a opção ativa (aria-activedescendant) e Enter abre o produto", async () => {
    vi.spyOn(ProductsService, "suggest").mockResolvedValue(suggestions);
    const user = userEvent.setup();
    const { router } = await renderWithProviders(<Search />);
    const input = screen.getByRole("combobox");
    await user.type(input, "caf");
    await screen.findByRole("listbox");

    await user.keyboard("{ArrowDown}");
    const [first, second] = screen.getAllByRole("option");
    expect(input).toHaveAttribute("aria-activedescendant", first.id);
    expect(first).toHaveAttribute("aria-selected", "true");
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", second.id);
    await user.keyboard("{ArrowDown}");
    expect(input).toHaveAttribute("aria-activedescendant", first.id); // volta ao início
    await user.keyboard("{ArrowUp}");
    expect(input).toHaveAttribute("aria-activedescendant", second.id);

    await user.keyboard("{Enter}");
    await waitFor(() => expect(router.state.location.pathname).toBe("/products/cafe-instantaneo"));
    expect(input).toHaveValue("");
  });

  it("Esc fecha a lista; Enter sem opção ativa envia a busca", async () => {
    vi.spyOn(ProductsService, "suggest").mockResolvedValue(suggestions);
    const onSubmit = vi.fn();
    const user = userEvent.setup();
    await renderWithProviders(<Search onSubmit={onSubmit} />);
    const input = screen.getByRole("combobox");
    await user.type(input, "caf");
    await screen.findByRole("listbox");
    await user.keyboard("{Escape}");
    expect(input).toHaveAttribute("aria-expanded", "false");
    expect(input).not.toHaveAttribute("aria-activedescendant");
    expect(input).toHaveValue("caf");
    await user.keyboard("{Enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
  });

  it("clique numa sugestão abre o produto", async () => {
    vi.spyOn(ProductsService, "suggest").mockResolvedValue(suggestions);
    const user = userEvent.setup();
    const { router } = await renderWithProviders(<Search />);
    await user.type(screen.getByRole("combobox"), "caf");
    await user.click(await screen.findByRole("option", { name: /Café Em Cápsula/ }));
    await waitFor(() => expect(router.state.location.pathname).toBe("/products/cafe-em-capsula"));
  });
});
