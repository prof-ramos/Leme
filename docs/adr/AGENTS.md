# adr

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Decisões da v1, uma por arquivo. O arquivo é a fonte. Este índice só diz qual abrir. Os termos usados nos textos estão em `GLOSSARY.md`.

## Key Files

| File | Open when |
|------|-----------|
| `0001-sqlite-local-dois-processos.md` | Onde o arquivo SQLite vive, ou como a tela e o MCP o abrem. |
| `0002-sem-usuario-na-v1.md` | Conta, login da pessoa, ou `user_id` em tarefa, nota, hábito ou registro. |
| `0003-vinculo-em-juncao.md` | Vínculo, tabela de junção, ou um id de nota, tarefa ou hábito na tabela principal. |
| `0004-chave-so-na-api-http.md` | `LEME_API_KEY`, `Authorization`, `/api/v1`, ou o MCP falando HTTP com o Next. |
| `0005-dia-civil-sao-paulo.md` | A data de um registro, o fuso, ou `YYYY-MM-DD`. |
| `0006-sequencia-hoje-em-aberto.md` | Sequência, recorde, ou se hoje sem marca é falta. |
| `0007-link-e-unlink.md` | Ligar ou desligar um vínculo, na API ou no MCP. |

## Subdirectories

Nenhum.

## For AI Agents

### Working In This Directory

Leia o ADR da área antes de propor armazenamento, vínculo, chave, dia ou sequência. Uma decisão nova é o próximo número (`0008-….md`), em arquivo próprio. Se a proposta contradiz um ADR desta pasta, diga isso no texto, com o número, em vez de reescrever o arquivo antigo.

Use o termo do glossário no título e no corpo. `docs/agents/domain.md` é a regra de leitura.

### Testing Requirements

Não há testes. Uma decisão nova está feita quando o arquivo existe, o número não colide, e este índice ganha uma linha com o gatilho de abertura.

### Common Patterns

O nome é `NNNN-slug.md`. O `#` título é a decisão em uma frase. O corpo diz o que foi escolhido e a alternativa recusada. Não há bloco de status separado do texto.

## Dependencies

### Internal

- `../../GLOSSARY.md` — termos (vínculo, registro, dia, sequência, falta, tarefa, nota, hábito)
- `../agents/domain.md` — obrigação de ler estes arquivos e de sinalizar conflito

### External

Citados pelas decisões e pela implementação: SQLite, better-sqlite3, Next.js, servidor MCP, `Authorization: Bearer`, fuso `America/Sao_Paulo`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
