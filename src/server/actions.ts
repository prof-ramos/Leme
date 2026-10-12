"use server";

import { revalidatePath } from "next/cache";
import { DomainError } from "./domain/tasks";
import { getLeme } from "./leme";

export async function createTaskAction(formData: FormData) {
  const title = String(formData.get("title") ?? "");
  try {
    getLeme().createTask(title);
    revalidatePath("/");
    return { ok: true as const };
  } catch (error) {
    const message = error instanceof DomainError ? error.message : "Não foi possível criar a tarefa.";
    return { ok: false as const, error: message };
  }
}

export async function deleteTaskAction(id: string) {
  getLeme().deleteTask(id);
  revalidatePath("/");
}
