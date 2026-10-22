# AppIcon.icon

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Pasta do Icon Composer para o ícone Liquid Glass (iOS 26). O `icon.json` descreve o grupo, a sombra e a translucidez; a imagem está em `Assets/icon.png`.

## Key Files

| File | Description |
|------|-------------|
| `icon.json` | Manifesto do Icon Composer. A camada única chama a imagem `icon.png`. Plataformas: quadrados compartilhados e círculos no watchOS. `fill` é `automatic`; translucidez e sombra neutra estão ligadas. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `Assets/` | Só `icon.png`, a imagem nomeada pela camada. Sem `AGENTS.md`. |

## For AI Agents

### Working In This Directory

O campo `image-name` em `icon.json` tem de ser o arquivo em `Assets/`. Trocar o desenho é substituir `Assets/icon.png` e manter esse nome, ou mudar os dois juntos.

No Expo, `../README.md` manda copiar esta pasta inteira para `assets/` e apontar `ios.icon` para `./assets/AppIcon.icon`.

### Testing Requirements

Não há teste. `icon.json` referencia `icon.png` e esse arquivo está em `Assets/`.

### Common Patterns

Uma camada, um arquivo de imagem. Aparência (glass, sombra, translucidez) fica no JSON; o desenho fica no PNG.

## Dependencies

### Internal

- `../README.md` — wiring Expo e Xcode do pacote

### External

Icon Composer / formato `.icon` da Apple. Nenhum código neste checkout importa este JSON.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
