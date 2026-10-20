# Arquitetura da implementação atual

O quadro básico implementa criar, listar e apagar tarefas (issue #2). Os demais módulos da v1 continuam na spec #1; esta refatoração não os implementa.

- `src/server/domain/tasks.ts` recebe uma conexão Drizzle e concentra as regras de tarefa. Não abre arquivos nem consulta variáveis de ambiente.
- `src/server/db.ts` abre e inicializa SQLite em WAL. Fecha a conexão se a inicialização falhar.
- `src/server/leme.ts` compõe o domínio. `createLeme(path)` devolve uma sessão que o chamador deve fechar; testes e MCP têm esse ciclo de vida explícito. `getLeme()` reutiliza a conexão do processo Next, inclusive durante recargas de desenvolvimento. Guarda apenas a conexão nativa, para não conservar regras/classes antigas após uma recarga.
- Tela, ações de servidor, API HTTP e MCP usam as mesmas operações. Só a API exige chave, conforme ADR-0004.
- Criar e apagar usam transações `immediate`: a reserva da posição e a inserção são indivisíveis; exclusão e reindexação também. O bloqueio de escrita acontece antes da leitura, inclusive entre os dois processos do ADR-0001.

## Verificação

`npm test` verifica regras com SQLite temporário; `npm run typecheck` verifica tipos. `npm run test:live` inicia Next e MCP reais, num banco descartável: cria 40 tarefas simultaneamente pelas duas portas, confere leitura compartilhada, apaga 20 e confere posições consecutivas e respostas HTTP. Usa a porta 3218 (ou `LEME_TEST_PORT`). Execute sem outro Next usando o mesmo checkout, pois `.next` é compartilhado. A inspeção visual do formulário e a persistência após recarregar são verificadas separadamente no navegador.

A entrada de criação usa um schema Zod único em `domain/inputs.ts`, compartilhado pelo domínio, HTTP e MCP. HTTP valida o corpo como `unknown` antes de acessar campos, inclusive quando o JSON é `null`. MCP carrega variáveis com `@next/env`, respeitando a mesma precedência, aspas e expansão que o Next; variáveis já fornecidas ao processo prevalecem. Execute o MCP a partir da raiz do projeto para localizar os arquivos `.env`.

## Dependências

O lockfile registra a instalação usada nos testes. A faixa de Node.js é `^22.22.2 || ^24.15.0 || ^26.0.0`, alinhada ao requisito de jsdom 30.1.2; Node.js 23 e 25 ficam excluídos. A validação anterior foi feita em Node 26.10.0. Next permanece na versão 15. Drizzle 0.45.4 e Vitest 4.1.11 substituem faixas com alertas conhecidos; o override PostCSS 8.5.29 corrige a dependência transitiva do Next sem uma migração para Next 16. Revisar o override quando o Next atualizar sua dependência.

Referências para as correções: [Drizzle](https://github.com/advisories/GHSA-gpj5-g38j-94v9), [Vitest](https://github.com/advisories/GHSA-82fw-gwwq-j7x9) e [PostCSS](https://github.com/advisories/GHSA-fxqj-rqcc-2cmp). A auditoria da instalação final encontrou zero vulnerabilidades conhecidas em 2026-10-11; isso não substitui revisão do código nem garante ausência de falhas futuras.

Depois de `npm run build`, `LEME_TEST_MODE=production npm run test:live` verifica as mesmas operações com `next start` e MCP em modo de produção.
