import { createHash, timingSafeEqual } from "node:crypto";

export function requireApiKey(request: Request): Response | null {
  const expected = process.env.LEME_API_KEY;
  const header = request.headers.get("authorization");
  const token = header?.match(/^Bearer\s+(.+)$/i)?.[1].trim();

  if (
    !expected ||
    !token ||
    !timingSafeEqual(
      createHash("sha256").update(token).digest(),
      createHash("sha256").update(expected).digest()
    )
  ) {
    return Response.json(
      { error: "Não autorizado." },
      { status: 401, headers: { "WWW-Authenticate": "Bearer" } }
    );
  }

  return null;
}
