import { resolve } from "node:path";
import { defaultDatabasePath, openDatabase } from "./db";
import { createTaskDomain, type Leme } from "./domain/tasks";

export type LemeSession = Leme & { close: () => void };

/** Owns a connection; callers outside the web runtime must close it. */
export function createLeme(path = defaultDatabasePath()): LemeSession {
  const db = openDatabase(path);
  return { ...createTaskDomain(db), close: () => db.$client.close() };
}

// Keep only the native connection across Next reloads, never domain closures.
// Otherwise old DomainError classes can survive a reload and evade adapter catches.
const runtime = globalThis as typeof globalThis & {
  lemeDatabase?: { path: string; db: ReturnType<typeof openDatabase> };
};

export function getLeme(): Leme {
  const path = resolve(defaultDatabasePath());
  if (runtime.lemeDatabase?.path !== path) {
    runtime.lemeDatabase?.db.$client.close();
    runtime.lemeDatabase = { path, db: openDatabase(path) };
  }
  return createTaskDomain(runtime.lemeDatabase.db);
}
