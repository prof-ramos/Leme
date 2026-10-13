import { beforeEach, describe, expect, it, vi } from "vitest";
import { revalidatePath } from "next/cache";
import { deleteTaskAction } from "../src/server/actions";
import { DomainError } from "../src/server/domain/tasks";
import { getLeme } from "../src/server/leme";

vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
vi.mock("../src/server/leme", () => ({ getLeme: vi.fn() }));

describe("ações de tarefa", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("revalida o quadro quando outra conexão já apagou a tarefa", async () => {
    vi.mocked(getLeme).mockReturnValue({
      createTask: vi.fn(),
      listTasks: vi.fn(() => []),
      deleteTask: vi.fn(() => {
        throw new DomainError("NOT_FOUND", "Tarefa não encontrada.");
      }),
    });

    await expect(deleteTaskAction("task-1")).resolves.toEqual({ ok: true });
    expect(revalidatePath).toHaveBeenCalledOnce();
    expect(revalidatePath).toHaveBeenCalledWith("/");
  });

  it("mantém falhas inesperadas como erro sem revalidar o quadro", async () => {
    vi.mocked(getLeme).mockReturnValue({
      createTask: vi.fn(),
      listTasks: vi.fn(() => []),
      deleteTask: vi.fn(() => {
        throw new Error("falha no banco");
      }),
    });

    await expect(deleteTaskAction("task-1")).resolves.toEqual({
      ok: false,
      error: "Não foi possível apagar a tarefa. Tente novamente.",
    });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
