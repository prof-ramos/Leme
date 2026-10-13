import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import nextEnv from "@next/env";
import { createTaskInput } from "../src/server/domain/inputs";
import { createLeme } from "../src/server/leme";

// Match Next's .env precedence, quoting and expansion in the independent process.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");

const leme = createLeme();
const server = new McpServer({
  name: "leme",
  version: "0.1.0",
});

server.tool(
  "create_task",
  "Cria uma tarefa no fim da coluna A fazer, com prioridade média e cor sage.",
  createTaskInput.shape,
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

server.server.onclose = () => leme.close();

const transport = new StdioServerTransport();
await server.connect(transport);
