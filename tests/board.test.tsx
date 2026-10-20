// @vitest-environment jsdom
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board } from "@/components/Board";
import { createTaskAction, deleteTaskAction } from "@/server/actions";
import type { Task } from "@/server/schema";

vi.mock("@/server/actions", () => ({ createTaskAction: vi.fn(), deleteTaskAction: vi.fn() }));
// jsdom has no top layer. Only supply the platform open/close plumbing;
// keyboard containment and Escape are checked in a real browser.
beforeEach(() => {
  vi.resetAllMocks();
  HTMLDialogElement.prototype.showModal = function () { this.open = true; };
  HTMLDialogElement.prototype.close = function () {
    this.open = false;
    this.dispatchEvent(new Event("close"));
  };
});
afterEach(() => { cleanup(); vi.restoreAllMocks(); });

const task: Task = { id: "task-1", title: "Preparar relatório", description: null, column: "todo", position: 0, priority: "media", color: "sage", createdAt: 0, updatedAt: 0 };

test("o formulário tem nome de diálogo e devolve o foco ao fechar", async () => {
  const user = userEvent.setup();
  render(<Board tasks={[]} />);
  const trigger = screen.getByRole("button", { name: /Nova tarefa/ });
  await user.click(trigger);
  expect(screen.getByRole("dialog", { name: "Nova tarefa" })).toBeDefined();
  await user.click(screen.getByRole("button", { name: "Cancelar" }));
  expect(screen.queryByRole("dialog")).toBeNull();
  expect(document.activeElement).toBe(trigger);
});

test("erro de título é anunciado e associado ao campo", async () => {
  vi.mocked(createTaskAction).mockResolvedValue({ ok: false, error: "O título é obrigatório." });
  const user = userEvent.setup();
  render(<Board tasks={[]} />);
  await user.click(screen.getByRole("button", { name: /Nova tarefa/ }));
  await user.click(screen.getByRole("button", { name: "Criar" }));
  const alert = await screen.findByRole("alert");
  const input = screen.getByRole("textbox", { name: "Título" });
  expect(input.getAttribute("aria-invalid")).toBe("true");
  expect(input.getAttribute("aria-describedby")).toBe(alert.id);
});

test("Tab e Shift+Tab circulam pelos controles do diálogo", async () => {
  const user = userEvent.setup();
  render(<Board tasks={[]} />);
  await user.click(screen.getByRole("button", { name: /Nova tarefa/ }));
  const input = screen.getByRole("textbox");
  await user.tab({ shift: true });
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Criar" }));
  await user.tab();
  expect(document.activeElement).toBe(input);
});

test("criação informa andamento e bloqueia outro envio", async () => {
  let finish!: (value: { ok: true }) => void;
  vi.mocked(createTaskAction).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const user = userEvent.setup();
  render(<Board tasks={[]} />);
  await user.click(screen.getByRole("button", { name: /Nova tarefa/ }));
  await user.type(screen.getByRole("textbox"), "Preparar relatório");
  await user.click(screen.getByRole("button", { name: "Criar" }));
  expect((await screen.findByRole("button", { name: "Criando…" }) as HTMLButtonElement).disabled).toBe(true);
  finish({ ok: true });
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

test("falha de criação preserva o título e permite repetir o envio", async () => {
  vi.mocked(createTaskAction).mockRejectedValue(new Error("offline"));
  const user = userEvent.setup();
  render(<Board tasks={[]} />);
  await user.click(screen.getByRole("button", { name: /Nova tarefa/ }));
  await user.type(screen.getByRole("textbox"), "Preparar relatório");
  await user.click(screen.getByRole("button", { name: "Criar" }));
  expect((await screen.findByRole("alert")).textContent).toContain("Não foi possível criar");
  expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe("Preparar relatório");
  expect((screen.getByRole("button", { name: "Criar" }) as HTMLButtonElement).disabled).toBe(false);
  vi.mocked(createTaskAction).mockResolvedValue({ ok: true });
  await user.click(screen.getByRole("button", { name: "Criar" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
});

test("exclusão informa andamento e apresenta a falha retornada pelo servidor", async () => {
  let finish!: (value: { ok: false; error: string }) => void;
  vi.mocked(deleteTaskAction).mockImplementation(() => new Promise(resolve => { finish = resolve; }));
  const user = userEvent.setup();
  render(<Board tasks={[task]} />);
  await user.click(screen.getByRole("button", { name: /Apagar/ }));
  expect((screen.getByRole("button", { name: /Apagando/ }) as HTMLButtonElement).disabled).toBe(true);
  finish({ ok: false, error: "Tarefa não encontrada." });
  expect((await screen.findByRole("alert")).textContent).toBe("Tarefa não encontrada.");
});

test("falha de exclusão mantém a tarefa e permite tentar novamente", async () => {
  vi.mocked(deleteTaskAction).mockRejectedValue(new Error("offline"));
  const user = userEvent.setup();
  render(<Board tasks={[task]} />);
  await user.click(screen.getByRole("button", { name: /Apagar/ }));
  expect((await screen.findByRole("alert")).textContent).toContain("Não foi possível apagar");
  expect(screen.getByText(task.title)).toBeDefined();
  expect((screen.getByRole("button", { name: /Apagar/ }) as HTMLButtonElement).disabled).toBe(false);
});
