import Database from "better-sqlite3";
import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { drizzle, type BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const TASKS_SQL = `
CREATE TABLE IF NOT EXISTS tasks (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  "column" text NOT NULL,
  position integer NOT NULL,
  priority text NOT NULL,
  color text NOT NULL,
  created_at integer NOT NULL,
  updated_at integer NOT NULL
);
`;

export type LemeDatabase = BetterSQLite3Database<typeof schema>;

export function openDatabase(path: string) {
  if (path !== ":memory:") mkdirSync(dirname(path), { recursive: true });
  const sqlite = new Database(path);
  try {
    sqlite.pragma("journal_mode = WAL");
    sqlite.exec(TASKS_SQL);
    return drizzle(sqlite, { schema });
  } catch (error) {
    sqlite.close();
    throw error;
  }
}

export function defaultDatabasePath() {
  return process.env.LEME_DB_PATH ?? "data/leme.sqlite";
}
