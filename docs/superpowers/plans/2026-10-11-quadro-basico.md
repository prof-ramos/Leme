# Plano: quadro básico (issue #2)

## Escopo

Criar, listar e apagar tarefas. Persistência local. Tela sem login. API Bearer. MCP no mesmo arquivo.

## Arquivos

- `src/server/schema.ts` — tabela `tasks`
- `src/server/db.ts` — better-sqlite3 + WAL
- `src/server/domain/tasks.ts` — módulo de domínio
- `src/app/api/v1/tasks/route.ts` — GET, POST
- `src/app/api/v1/tasks/[id]/route.ts` — DELETE
- `src/app/page.tsx` — quadro
- `mcp/server.ts` — `create_task`, `list_tasks`
- `tests/tasks.module.test.ts`
- `tests/tasks.http.test.ts`

## Tarefas

1. Teste do módulo (temp SQLite): criar, recusar vazio, listar, apagar, persistir.
2. Implementar domínio.
3. Teste HTTP 401.
4. Implementar API.
5. Tela + atalho `c`.
6. MCP + `npm run dev`.
7. Validação local e PR.
