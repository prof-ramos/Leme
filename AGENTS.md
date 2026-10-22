# Leme

**Generated:** 2026-10-13 · **Updated:** 2026-10-15

## Purpose

Aplicativo de produtividade de uma pessoa, na máquina dela: quadro de tarefas, notas e hábitos diários. Este checkout contém o quadro básico em Next.js, a API HTTP e o servidor MCP sobre o mesmo SQLite local, além do vocabulário (`GLOSSARY.md`), das decisões da v1 (`docs/adr/`) e do pacote de ícones (`AppIcons/`).

## Key Files

| File | Description |
|------|-------------|
| `GLOSSARY.md` | Vocabulário obrigatório da v1. Um termo por conceito, com a lista `_Avoid_`. |
| `AGENTS.md` | Mapa deste checkout e, em Manual Notes, o contrato que o agente segue. |
| `README.md` | Como executar e verificar o quadro, a API e o MCP. |
| `package.json` | Scripts de execução, teste, tipos e build; versões de Node suportadas. |
| `AppIcons.zip` | Cópia compactada do mesmo pacote que está em `AppIcons/`. |
| `le.jpg` | Imagem solta na raiz, fora do pacote de ícones. |
| `Imagem do ChatGPT 10 de out. de 2026, 07_25_54.png` | Imagem solta na raiz, fora do pacote de ícones. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `docs/` | Decisões da v1, arquitetura, verificações e contrato operacional do agente (see `docs/AGENTS.md`) |
| `src/` | Tela, API HTTP e domínio compartilhado. |
| `mcp/` | Servidor MCP local. |
| `tests/` e `scripts/` | Testes automatizados e verificação ao vivo. |
| `AppIcons/` | Ícones iOS, Android e lojas (see `AppIcons/AGENTS.md`) |

## For AI Agents

### Working In This Directory

O contrato deste repositório está em Manual Notes, abaixo. Siga-o em toda exploração ou mudança. Ele aponta para `GLOSSARY.md`, `docs/agents/domain.md`, `docs/agents/issue-tracker.md` e `docs/agents/triage-labels.md`.

Uma mudança de produto começa por uma issue em prof-ramos/Leme e pelos ADRs da área. O desenho da v1 (Next.js, better-sqlite3, servidor MCP, o mesmo arquivo SQLite) está decidido em `docs/adr/` e descrito em `docs/architecture.md`. Leia o README antes de executar; não publique bancos locais nem arquivos de ambiente com credenciais.

As imagens soltas na raiz não entram no pacote de ícones. Ícone de aplicativo mora em `AppIcons/`.

### Testing Requirements

Execute `npm test`, `npm run typecheck` e `npm run build` para mudanças de código. `npm run test:live` verifica Next e MCP com banco temporário; não rode junto de outro Next neste checkout. O README descreve os pré-requisitos. Para documentação, confira caminhos, vocabulário e coerência com os ADRs. O critério de aceite de produto mora na issue.

### Common Patterns

- Termo de domínio: o verbete em `GLOSSARY.md`. Valor gravado (`todo`, `doing`, `done`, `baixa`, `media`, `alta`, `sage`, `silver`, `mist`, `clay`, `ink`) e rótulo de tela são coisas diferentes.
- Decisão de arquitetura: um arquivo `docs/adr/NNNN-*.md`. A próxima decisão é um arquivo novo, com o número seguinte.
- Contrato do agente: um arquivo em `docs/agents/`. Este `AGENTS.md` só aponta.

## Dependencies

### Internal

- `GLOSSARY.md` — termos
- `docs/adr/` — decisões da v1 (see `docs/adr/AGENTS.md`)
- `docs/agents/` — como ler o domínio, abrir issues e aplicar rótulos (see `docs/agents/AGENTS.md`)

### External

Next.js, React, better-sqlite3, Drizzle e o SDK MCP; versões e engines estão em `package.json` e `package-lock.json`. Use `npm ci` com uma versão de Node suportada para reproduzir a instalação.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.

## Agent skills

### Issue tracker

Issues e specs ficam como GitHub Issues em prof-ramos/Leme. Veja `docs/agents/issue-tracker.md`.

### Triage labels

Cinco papéis canônicos, com o rótulo igual ao nome do papel. Veja `docs/agents/triage-labels.md`.

### Domain docs

Contexto único: um `GLOSSARY.md` na raiz e `docs/adr/`. Veja `docs/agents/domain.md`.

Antes de explorar ou mudar código, leia o glossário e os ADRs que tocam a área. São obrigatórios neste repositório: não invente sinônimos nem reabra decisões em silêncio se os arquivos existirem; se faltarem, pare e diga.
