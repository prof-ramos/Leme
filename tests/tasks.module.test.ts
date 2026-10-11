import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { createLeme } from "../src/server/domain/tasks";

function openLeme() {
  const dir = mkdtempSync(join(tmpdir(), "leme-"));
  return createLeme(join(dir, "leme.sqlite"));
}

describe("tarefas", () => {
  it("cria uma tarefa só com o título no fim de A fazer, prioridade média e cor sage", () => {
    const leme = openLeme();
    const primeira = leme.createTask("Escrever o relatório");
    const segunda = leme.createTask("Revisar o texto");

    expect(primeira.title).toBe("Escrever o relatório");
    expect(primeira.column).toBe("todo");
    expect(primeira.position).toBe(0);
    expect(primeira.priority).toBe("media");
    expect(primeira.color).toBe("sage");

    expect(segunda.column).toBe("todo");
    expect(segunda.position).toBe(1);

    const listadas = leme.listTasks();
    expect(listadas.map((tarefa) => tarefa.id)).toEqual([primeira.id, segunda.id]);
  });

  it("recusa título vazio", () => {
    const leme = openLeme();
    expect(() => leme.createTask("   ")).toThrow(/título/i);
  });

  it("apaga a tarefa e reabre o mesmo arquivo com o que ficou", () => {
    const dir = mkdtempSync(join(tmpdir(), "leme-"));
    const path = join(dir, "leme.sqlite");
    const leme = createLeme(path);
    const fica = leme.createTask("Fica");
    const some = leme.createTask("Some");

    leme.deleteTask(some.id);

    const reaberto = createLeme(path);
    const listadas = reaberto.listTasks();
    expect(listadas).toHaveLength(1);
    expect(listadas[0]?.id).toBe(fica.id);
    expect(listadas[0]?.title).toBe("Fica");
    expect(listadas[0]?.position).toBe(0);
  });
});
