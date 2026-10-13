import { createTaskInput } from "@/server/domain/inputs";
import { getLeme } from "@/server/leme";
import { requireApiKey } from "@/server/http/auth";

export async function GET(request: Request) {
  const denied = requireApiKey(request);
  if (denied) return denied;
  return Response.json({ tasks: getLeme().listTasks() });
}

export async function POST(request: Request) {
  const denied = requireApiKey(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Corpo inválido." }, { status: 400 });
  }

  const parsed = createTaskInput.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Corpo inválido: informe um título não vazio." }, { status: 400 });
  }
  const task = getLeme().createTask(parsed.data.title);
  return Response.json({ task }, { status: 201 });
}
