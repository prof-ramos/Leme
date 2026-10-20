import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

const dir = await mkdtemp(join(tmpdir(), "leme-live-"));
const port = process.env.LEME_TEST_PORT ?? "3218";
const url = `http://127.0.0.1:${port}`;
const key = "disposable-live-test";
const mode = process.env.LEME_TEST_MODE === "production" ? "production" : "development";
const env: NodeJS.ProcessEnv & { LEME_DB_PATH: string } = { ...process.env, NODE_ENV: mode, LEME_DB_PATH: join(dir, "leme.sqlite"), LEME_API_KEY: key };
const web = spawn(process.execPath, ["node_modules/next/dist/bin/next", mode === "production" ? "start" : "dev", "--hostname", "127.0.0.1", "--port", port], { env, stdio: ["ignore", "pipe", "pipe"] });
let output = "";
web.stdout.on("data", (chunk) => { output += chunk; });
web.stderr.on("data", (chunk) => { output += chunk; });
const stopped = new Promise<void>((resolve) => web.once("exit", () => resolve()));
await writeFile(join(dir, ".env.local"), `LEME_DB_PATH="${env.LEME_DB_PATH}"\n`);
const mcpEnv: NodeJS.ProcessEnv = { ...process.env, NODE_ENV: mode };
delete mcpEnv.LEME_DB_PATH;
const client = new Client({ name: "leme-live-test", version: "1.0.0" });
const transport = new StdioClientTransport({ command: process.execPath, args: [resolve("node_modules/tsx/dist/cli.mjs"), resolve("mcp/server.ts")], cwd: dir, env: Object.fromEntries(Object.entries(mcpEnv).filter((entry): entry is [string, string] => typeof entry[1] === "string")), stderr: "pipe" });
async function request(path: string, init: RequestInit = {}) {
  return fetch(`${url}${path}`, { ...init, headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json", ...init.headers }, signal: AbortSignal.timeout(20_000) });
}
try {
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (web.exitCode !== null) throw new Error(output);
    try { ready = (await fetch(`${url}/api/v1/tasks`, { signal: AbortSignal.timeout(1000) })).status === 401; } catch {}
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  assert.ok(ready, output);
  for (const body of ["null", "[]", "{}", '{"title":42}', '{"title":"   "}', "invalid JSON"]) {
    assert.equal((await request("/api/v1/tasks", { method: "POST", body })).status, 400, body);
  }
  for (const method of ["GET", "POST", "DELETE"]) {
    const path = method === "DELETE" ? "/api/v1/tasks/missing" : "/api/v1/tasks";
    assert.equal((await request(path, { method, headers: { Authorization: "Bearer wrong" } })).status, 401);
  }
  await client.connect(transport);
  const invalidTask = await client.callTool({ name: "create_task", arguments: { title: "   " } });
  assert.equal(invalidTask.isError, true);
  const tools = await client.listTools();
  assert.ok(tools.tools.some((tool) => tool.name === "create_task"));
  await Promise.all(Array.from({ length: 20 }, async (_, i) => {
    const [http, mcp] = await Promise.all([
      request("/api/v1/tasks", { method: "POST", body: JSON.stringify({ title: `HTTP ${i}` }) }),
      client.callTool({ name: "create_task", arguments: { title: `MCP ${i}` } }),
    ]);
    assert.equal(http.status, 201);
    assert.ok(!mcp.isError, JSON.stringify(mcp));
  }));
  const { tasks } = await (await request("/api/v1/tasks")).json();
  assert.equal(tasks.length, 40);
  assert.deepEqual(tasks.map((task: { position: number }) => task.position), Array.from({ length: 40 }, (_, i) => i));
  const listed = await client.callTool({ name: "list_tasks", arguments: {} });
  assert.ok(!listed.isError);
  assert.equal(JSON.parse((listed.content as { text: string }[])[0].text).length, 40);
  await Promise.all(tasks.filter((_: unknown, i: number) => i % 2 === 0).map(async (task: { id: string }) => {
    assert.equal((await request(`/api/v1/tasks/${task.id}`, { method: "DELETE" })).status, 204);
  }));
  const { tasks: remaining } = await (await request("/api/v1/tasks")).json();
  assert.equal(remaining.length, 20);
  assert.deepEqual(remaining.map((task: { position: number }) => task.position), Array.from({ length: 20 }, (_, i) => i));
  assert.equal((await request("/api/v1/tasks/missing", { method: "DELETE" })).status, 404);
  console.log("Live HTTP + MCP: 40 simultaneous creations, shared reads, 20 deletions, contiguous positions, 401/400/404 and quoted MCP .env.local passed.");
} catch (error) {
  console.error(output);
  throw error;
} finally {
  await Promise.allSettled([client.close(), transport.close()]);
  web.kill("SIGTERM");
  await stopped;
  await rm(dir, { recursive: true, force: true });
}
