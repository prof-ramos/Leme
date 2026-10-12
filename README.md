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

## Arquitetura e verificação

Requer Node 22 ou 24+. Instale as versões do lockfile com `npm ci`.

```bash
npm test
npm run typecheck
npm run test:live
npm run build
```

O teste ao vivo inicia Next e MCP em um banco temporário e limpa seus processos e arquivos ao terminar. Usa a porta 3218; não execute junto de outro Next no mesmo checkout. Veja [a arquitetura atual](docs/architecture.md) para limites da implementação, conexões e transações.
