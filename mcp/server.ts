import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { readFileSync } from "node:fs";
import { z } from "zod";
import { createLeme } from "../src/server/domain/tasks";

function loadLocalEnv() {
  try {
    const text = readFileSync(".env.local", "utf8");
    for (const line of text.split("\n")) {
      const match = line.match(/^([^#=]+)=(.*)$/);
      if (!match) continue;
      const key = match[1].trim();
      const value = match[2].trim();
      if (!process.env[key]) process.env[key] = value;
    }
  } catch {
    // Sem .env.local, usa o ambiente e o caminho padrão.
  }
}

loadLocalEnv();

const leme = createLeme();
const server = new McpServer({
  name: "leme",
  version: "0.1.0",
});

server.tool(
  "create_task",
  "Cria uma tarefa no fim da coluna A fazer, com prioridade média e cor sage.",
  { title: z.string().describe("Título obrigatório da tarefa") },
  async ({ title }) => {
    const task = leme.createTask(title);
    return { content: [{ type: "text", text: JSON.stringify(task) }] };
  }
);

server.tool(
  "list_tasks",
  "Lista as tarefas do quadro, na ordem de cada coluna.",
  {},
  async () => {
    return { content: [{ type: "text", text: JSON.stringify(leme.listTasks()) }] };
  }
);

const transport = new StdioServerTransport();
await server.connect(transport);
