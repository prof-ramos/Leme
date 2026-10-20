import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const COLUMNS = ["todo", "doing", "done"] as const;
export type Column = (typeof COLUMNS)[number];

export const PRIORITIES = ["baixa", "media", "alta"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const COLORS = ["sage", "silver", "mist", "clay", "ink"] as const;
export type Color = (typeof COLORS)[number];

export const tasks = sqliteTable("tasks", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  column: text("column", { enum: COLUMNS }).notNull(),
  position: integer("position").notNull(),
  priority: text("priority", { enum: PRIORITIES }).notNull(),
  color: text("color", { enum: COLORS }).notNull(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

export type Task = typeof tasks.$inferSelect;
