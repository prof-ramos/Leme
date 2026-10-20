# Leme

Quadro, notas e hábitos numa máquina só. A v1 começa pelo quadro: criar, listar e apagar tarefas.

## Como rodar

```bash
cp .env.example .env.local
npm install
npm run dev
```

A tela sobe em `http://localhost:3000`. O MCP sobe no mesmo comando e grava o mesmo arquivo SQLite (`data/leme.sqlite`).

A tela não pede login. `GET` e `POST` em `/api/v1/tasks` e `DELETE` em `/api/v1/tasks/{id}` exigem `Authorization: Bearer` igual a `LEME_API_KEY`.

```bash
npm test
```

## Arquitetura e verificação

Requer Node.js 22.22.2+ na linha 22, 24.15.0+ na linha 24 ou 26.x. Node.js 23 e 25 não são compatíveis com as dependências de teste. Instale as versões do lockfile com `npm ci`.

```bash
npm test
npm run typecheck
npm run test:live
npm run build
```

O teste ao vivo inicia Next e MCP em um banco temporário e limpa seus processos e arquivos ao terminar. Usa a porta 3218; não execute junto de outro Next no mesmo checkout. Veja [a arquitetura atual](docs/architecture.md) para limites da implementação, conexões e transações.
