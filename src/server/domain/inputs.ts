import { z } from "zod";

export const createTaskInput = z.object({
  title: z.string().trim().min(1, "O título é obrigatório.").describe("Título obrigatório da tarefa"),
});
