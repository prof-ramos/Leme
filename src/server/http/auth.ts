export function requireApiKey(request: Request): Response | null {
  const expected = process.env.LEME_API_KEY;
  const header = request.headers.get("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice("Bearer ".length) : null;

  if (!expected || !token || token !== expected) {
    return Response.json({ error: "Não autorizado." }, { status: 401 });
  }

  return null;
}
