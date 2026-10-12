import { asc, eq, max } from "drizzle-orm";
import type { LemeDatabase } from "../db";
import { tasks, type Task } from "../schema";

export class DomainError extends Error {
  constructor(
    public readonly code: "BAD_REQUEST" | "NOT_FOUND",
    message: string
  ) {
    super(message);
    this.name = "DomainError";
  }
}

export type Leme = {
  createTask: (title: string) => Task;
  listTasks: () => Task[];
  deleteTask: (id: string) => void;
};

function nextPosition(db: LemeDatabase, column: Task["column"]) {
  const [row] = db
    .select({ last: max(tasks.position) })
    .from(tasks)
    .where(eq(tasks.column, column))
    .all();
  return row?.last == null ? 0 : row.last + 1;
}

function reindexColumn(db: LemeDatabase, column: Task["column"]) {
  const remaining = db
    .select()
    .from(tasks)
    .where(eq(tasks.column, column))
    .orderBy(asc(tasks.position))
    .all();

  remaining.forEach((tarefa, position) => {
    if (tarefa.position !== position) {
      db.update(tasks).set({ position }).where(eq(tasks.id, tarefa.id)).run();
    }
  });
}

export function createTaskDomain(db: LemeDatabase): Leme {
  return {
    createTask(title: string) {
      const trimmed = title.trim();
      if (!trimmed) {
        throw new DomainError("BAD_REQUEST", "O título é obrigatório.");
      }

      return db.transaction((tx) => {
        const now = Date.now();
        const tarefa: Task = {
          id: crypto.randomUUID(),
          title: trimmed,
          description: null,
          column: "todo",
          position: nextPosition(tx, "todo"),
          priority: "media",
          color: "sage",
          createdAt: now,
          updatedAt: now,
        };

        tx.insert(tasks).values(tarefa).run();
        return tarefa;
      }, { behavior: "immediate" });
    },

    listTasks() {
      return db.select().from(tasks).orderBy(asc(tasks.column), asc(tasks.position)).all();
    },

    deleteTask(id: string) {
      db.transaction((tx) => {
        const [existing] = tx.select().from(tasks).where(eq(tasks.id, id)).all();
        if (!existing) {
          throw new DomainError("NOT_FOUND", "Tarefa não encontrada.");
        }
        tx.delete(tasks).where(eq(tasks.id, id)).run();
        reindexColumn(tx, existing.column);
      }, { behavior: "immediate" });
    },
  };
}
