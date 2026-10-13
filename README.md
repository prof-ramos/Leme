# Leme

Quadro, notas e hábitos numa máquina só. A v1 começa pelo quadro: criar, listar e apagar tarefas.

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

A tela sobe em `http://localhost:3000`. O MCP sobe no mesmo comando e grava o mesmo arquivo SQLite (`data/leme.sqlite`).

A tela não pede login. `GET`, `POST` e `DELETE` em `/api/v1/tasks` exigem `Authorization: Bearer` igual a `LEME_API_KEY`.

```bash
npm test
```
