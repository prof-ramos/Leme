import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { createLeme, type LemeSession } from "../src/server/leme";

const sessions: LemeSession[] = [];
const directories: string[] = [];

afterEach(() => {
  sessions.splice(0).forEach((session) => session.close());
  directories.splice(0).forEach((dir) => rmSync(dir, { recursive: true, force: true }));
});

function openSession(path: string) {
  const session = createLeme(path);
  sessions.push(session);
  return session;
}

function openLeme() {
  const dir = mkdtempSync(join(tmpdir(), "leme-"));
  directories.push(dir);
  return openSession(join(dir, "leme.sqlite"));
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

  it("duas conexões compartilham tarefas e mantêm posições após apagar", () => {
    const dir = mkdtempSync(join(tmpdir(), "leme-"));
    directories.push(dir);
    const path = join(dir, "leme.sqlite");
    const web = openSession(path);
    const mcp = openSession(path);
    const primeira = web.createTask("Primeira");
    const segunda = mcp.createTask("Segunda");
    expect(web.listTasks().map((t) => t.position)).toEqual([0, 1]);
    mcp.deleteTask(primeira.id);
    const terceira = web.createTask("Terceira");
    expect(mcp.listTasks().map((t) => [t.id, t.position])).toEqual([
      [segunda.id, 0], [terceira.id, 1],
    ]);
    expect(() => web.deleteTask(primeira.id)).toThrow(/não encontrada/i);
  });

  it("recusa título vazio", () => {
    const leme = openLeme();
    expect(() => leme.createTask("   ")).toThrow(/título/i);
  });

  it("apaga a tarefa e reabre o mesmo arquivo com o que ficou", () => {
    const dir = mkdtempSync(join(tmpdir(), "leme-"));
    directories.push(dir);
    const path = join(dir, "leme.sqlite");
    const leme = openSession(path);
    const fica = leme.createTask("Fica");
    const some = leme.createTask("Some");
    const ultima = leme.createTask("Última");

    leme.deleteTask(some.id);

    leme.close();
    const reaberto = openSession(path);
    const listadas = reaberto.listTasks();
    expect(listadas).toHaveLength(2);
    expect(listadas[0]?.id).toBe(fica.id);
    expect(listadas[0]?.title).toBe("Fica");
    expect(listadas[0]?.position).toBe(0);
    expect(listadas[1]?.id).toBe(ultima.id);
    expect(listadas[1]?.position).toBe(1);
  });
});
