# docs

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Documentação que o agente lê antes de explorar ou mudar o Leme. Dois ramos: decisões da v1 em `adr/`, e o contrato operacional (issues, rótulos, domínio) em `agents/`. O vocabulário em si fica em `GLOSSARY.md`, na raiz, não aqui.

## Key Files

`architecture.md` descreve a composição do domínio e as transações; `ui-audit-fixes.md` registra as correções e verificações da interface.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `adr/` | Uma decisão da v1 por arquivo (see `adr/AGENTS.md`) |
| `superpowers/plans/` | Plano do quadro básico. |
| `agents/` | Como o agente consome domínio, issues e rótulos (see `agents/AGENTS.md`) |

## For AI Agents

### Working In This Directory

Abra o ramo que a tarefa pede. Uma decisão de armazenamento, vínculo, chave, dia ou sequência mora em `adr/`. Um procedimento de `gh`, um rótulo de triagem ou a regra de ler o glossário mora em `agents/`. Um termo novo mora em `GLOSSARY.md`, na raiz.

### Testing Requirements

Não há testes neste diretório. A verificação é o arquivo certo existir e o ponteiro na raiz continuar apontando para ele.

### Common Patterns

Um fato tem um arquivo dono. A raiz aponta; este diretório reparte; o arquivo filho contém o procedimento ou a decisão.

## Dependencies

### Internal

- `../GLOSSARY.md` — termos que `adr/` e `agents/domain.md` usam
- `../AGENTS.md` — ponteiros que trazem o agente até aqui

### External

Nenhuma.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
