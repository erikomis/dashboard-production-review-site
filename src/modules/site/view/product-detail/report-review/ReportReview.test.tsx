import { describe, expect, it, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/render";
import { makeReview } from "@/test/fixtures/review";
import { ReviewsService } from "@/modules/site/services/reviews.service";
import { HttpError } from "@/shared/services/http-error";
import { Modal } from "@/shared/components/modal";
import { ReportReview } from "./ReportReview";

const setup = async () => {
  const onReported = vi.fn();
  const onCancel = vi.fn();
  const review = makeReview();
  const utils = await renderWithProviders(
    <Modal open onClose={onCancel} title="Denunciar avaliação">
      <ReportReview review={review} onCancel={onCancel} onReported={onReported} />
    </Modal>,
  );
  return { ...utils, onReported, onCancel, review, user: userEvent.setup() };
};

describe("Modal de denúncia", () => {
  beforeEach(() => vi.restoreAllMocks());

  it("lista os motivos da spec e exige um motivo", async () => {
    const report = vi.spyOn(ReviewsService, "report");
    const { user } = await setup();
    expect(screen.getByRole("dialog", { name: "Denunciar avaliação" })).toBeInTheDocument();
    for (const name of ["Spam ou propaganda", "Conteúdo ofensivo", "Informação falsa", "Outro motivo"]) {
      expect(screen.getByRole("radio", { name })).toBeInTheDocument();
    }
    await user.click(screen.getByRole("button", { name: "Enviar denúncia" }));
    expect(await screen.findByText("Escolha o motivo da denúncia.")).toBeInTheDocument();
    expect(report).not.toHaveBeenCalled();
  });

  it("envia motivo e detalhes opcionais", async () => {
    const report = vi.spyOn(ReviewsService, "report").mockResolvedValue({
      id: 1,
      reason: "SPAM",
      details: "Link de loja",
      reporterName: "Usuário Teste",
      createdAt: "2026-10-02T15:00:00Z",
    });
    const { user, onReported, review } = await setup();
    await user.click(screen.getByRole("radio", { name: "Spam ou propaganda" }));
    await user.type(screen.getByRole("textbox", { name: /Detalhes/ }), "Link de loja");
    await user.click(screen.getByRole("button", { name: "Enviar denúncia" }));
    await waitFor(() => expect(report).toHaveBeenCalledWith(review.id, { reason: "SPAM", details: "Link de loja" }));
    expect(onReported).toHaveBeenCalledWith(expect.objectContaining({ id: review.id, reportedByMe: true }));
  });

  it("409 (já denunciada) também mostra o estado denunciada", async () => {
    vi.spyOn(ReviewsService, "report").mockRejectedValue(new HttpError("Você já denunciou esta avaliação", 409));
    const { user, onReported } = await setup();
    await user.click(screen.getByRole("radio", { name: "Conteúdo ofensivo" }));
    await user.click(screen.getByRole("button", { name: "Enviar denúncia" }));
    await waitFor(() => expect(onReported).toHaveBeenCalled());
  });

  it("429 mostra a mensagem com o tempo de espera", async () => {
    vi.spyOn(ReviewsService, "report").mockRejectedValue(
      new HttpError("Muitas tentativas. Tente novamente em 42 segundos.", 429, 42),
    );
    const { user, onReported } = await setup();
    await user.click(screen.getByRole("radio", { name: "Outro motivo" }));
    await user.click(screen.getByRole("button", { name: "Enviar denúncia" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Tente novamente em 42 segundos.");
    expect(onReported).not.toHaveBeenCalled();
  });
});
