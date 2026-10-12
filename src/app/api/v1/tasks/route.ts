import { DomainError } from "@/server/domain/tasks";
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

  let body: { title?: unknown };
  try {
    body = (await request.json()) as { title?: unknown };
  } catch {
    return Response.json({ error: "Corpo inválido." }, { status: 400 });
  }

  try {
    const task = getLeme().createTask(typeof body.title === "string" ? body.title : "");
    return Response.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
