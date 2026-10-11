import Database from "better-sqlite3";
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

export function openDatabase(path: string): LemeDatabase {
  const sqlite = new Database(path);
  sqlite.pragma("journal_mode = WAL");
  sqlite.exec(TASKS_SQL);
  return drizzle(sqlite, { schema });
}

export function defaultDatabasePath() {
  return process.env.LEME_DB_PATH ?? "data/leme.sqlite";
}
