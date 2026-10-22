# agents

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Contrato operacional do agente neste repositório. Três arquivos, três assuntos. A raiz (`../../AGENTS.md`, Manual Notes) só aponta para cá.

## Key Files

| File | Open when |
|------|-----------|
| `domain.md` | Antes de explorar ou mudar código; ao nomear um conceito; ao esbarrar num ADR. |
| `issue-tracker.md` | Ao criar, ler, listar, comentar, rotular ou fechar issue ou sub-issue; ao operar o mapa do wayfinder. |
| `triage-labels.md` | Ao aplicar um papel de triagem (`needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`). |

## Subdirectories

Nenhum.

## For AI Agents

### Working In This Directory

Edite o arquivo dono do fato. Um comando `gh` muda em `issue-tracker.md`. Uma string de rótulo muda na coluna "Label in our tracker" de `triage-labels.md`. A lista do que ler antes do código muda em `domain.md`. Depois confira se o ponteiro em `../../AGENTS.md` ainda nomeia o arquivo certo.

`issue-tracker.md` guarda o flag **PRs as a request surface: no.** PRs externos não entram na triagem enquanto essa linha for `no`.

### Testing Requirements

Não há testes. A verificação é cada ponteiro da raiz abrir um arquivo desta pasta, e cada rótulo citado na raiz existir na tabela de `triage-labels.md`.

### Common Patterns

Inglês nestes três arquivos; português no glossário e nos ADRs. O nome do rótulo no tracker é igual ao papel canônico. Repo das issues: prof-ramos/Leme, inferido por `gh` a partir do remote.

## Dependencies

### Internal

- `../../GLOSSARY.md` — vocabulário que `domain.md` manda usar
- `../adr/` — decisões que `domain.md` manda ler
- `../../AGENTS.md` — ponteiros em Manual Notes

### External

GitHub e o CLI `gh`. Sub-issues e dependências nativas pedem `gh` 2.94+; o fallback está em `issue-tracker.md`.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
