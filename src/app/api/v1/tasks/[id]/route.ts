import { DomainError, createLeme } from "@/server/domain/tasks";
import { requireApiKey } from "@/server/http/auth";

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = requireApiKey(request);
  if (denied) return denied;

  const { id } = await context.params;
  try {
    createLeme().deleteTask(id);
    return new Response(null, { status: 204 });
  } catch (error) {
    if (error instanceof DomainError && error.code === "NOT_FOUND") {
      return Response.json({ error: error.message }, { status: 404 });
    }
    throw error;
  }
}
