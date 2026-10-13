import { DomainError, createLeme } from "@/server/domain/tasks";
import { requireApiKey } from "@/server/http/auth";

function leme() {
  return createLeme();
}

export async function GET(request: Request) {
  const denied = requireApiKey(request);
  if (denied) return denied;
  return Response.json({ tasks: leme().listTasks() });
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
    const task = leme().createTask(typeof body.title === "string" ? body.title : "");
    return Response.json({ task }, { status: 201 });
  } catch (error) {
    if (error instanceof DomainError) {
      return Response.json({ error: error.message }, { status: 400 });
    }
    throw error;
  }
}
