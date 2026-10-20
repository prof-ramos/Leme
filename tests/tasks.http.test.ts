import { afterEach, describe, expect, it } from "vitest";

const KEY = "leme-teste-chave";

afterEach(() => {
  delete process.env.LEME_API_KEY;
});

describe("porta HTTP /api/v1/tasks", () => {
  it("responde 401 sem a chave e com a chave errada", async () => {
    process.env.LEME_API_KEY = KEY;
    const { GET, POST } = await import("../src/app/api/v1/tasks/route");
    const { DELETE } = await import("../src/app/api/v1/tasks/[id]/route");

    const semChave = await GET(new Request("http://localhost/api/v1/tasks"));
    expect(semChave.status).toBe(401);

    const errada = await GET(
      new Request("http://localhost/api/v1/tasks", {
        headers: { Authorization: "Bearer outra" },
      })
    );
    expect(errada.status).toBe(401);

    const post = await POST(
      new Request("http://localhost/api/v1/tasks", {
        method: "POST",
        headers: { Authorization: "Bearer outra", "Content-Type": "application/json" },
        body: JSON.stringify({ title: "Nova" }),
      })
    );
    expect(post.status).toBe(401);

    const del = await DELETE(
      new Request("http://localhost/api/v1/tasks/abc", {
        method: "DELETE",
        headers: { Authorization: "Bearer outra" },
      }),
      { params: Promise.resolve({ id: "abc" }) }
    );
    expect(del.status).toBe(401);
  });
});
