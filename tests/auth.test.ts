import { afterEach, describe, expect, it } from "vitest";
import { requireApiKey } from "../src/server/http/auth";

const KEY = "leme-teste-chave";

afterEach(() => {
  delete process.env.LEME_API_KEY;
});

function request(authorization?: string) {
  return new Request("http://localhost/api/v1/tasks", {
    headers: authorization === undefined ? {} : { Authorization: authorization },
  });
}

describe("requireApiKey", () => {
  it.each(["bearer", "BEARER", "Bearer"])("aceita o esquema %s e remove espaços do token", (scheme) => {
    process.env.LEME_API_KEY = KEY;
    expect(requireApiKey(request(`${scheme}   ${KEY}  `))).toBeNull();
  });

  it.each([undefined, "Basic outra", "Bearer   ", "Bearer leme-teste-errad", "Bearer curta", `Bearer ${KEY}-longa`])(
    "rejeita autorização inválida %s com desafio Bearer",
    async (authorization) => {
      process.env.LEME_API_KEY = KEY;
      const response = requireApiKey(request(authorization));
      expect(response?.status).toBe(401);
      expect(response?.headers.get("WWW-Authenticate")).toBe("Bearer");
      expect(await response?.json()).toEqual({ error: "Não autorizado." });
    }
  );

  it("responde 401 com desafio Bearer quando a chave não está configurada", () => {
    delete process.env.LEME_API_KEY;
    const response = requireApiKey(request(`Bearer ${KEY}`));
    expect(response?.status).toBe(401);
    expect(response?.headers.get("WWW-Authenticate")).toBe("Bearer");
  });
});
