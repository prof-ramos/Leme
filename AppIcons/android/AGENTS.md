# android

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Launcher Android do ícone do Leme: um PNG por densidade e o foreground do ícone adaptativo. Pastas de densidade só têm `ic_launcher.png`; não há `AGENTS.md` dentro delas.

## Key Files

| File | Description |
|------|-------------|
| `adaptive-foreground.png` | Foreground do adaptive icon. No wiring Expo do `../README.md`, este arquivo é copiado para `assets/` e referenciado como `foregroundImage`, com `backgroundColor` `#ffffff`. |

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `mipmap-mdpi/` | `ic_launcher.png` em mdpi. Sem `AGENTS.md`. |
| `mipmap-hdpi/` | `ic_launcher.png` em hdpi. Sem `AGENTS.md`. |
| `mipmap-xhdpi/` | `ic_launcher.png` em xhdpi. Sem `AGENTS.md`. |
| `mipmap-xxhdpi/` | `ic_launcher.png` em xxhdpi. Sem `AGENTS.md`. |
| `mipmap-xxxhdpi/` | `ic_launcher.png` em xxxhdpi. Sem `AGENTS.md`. |

## For AI Agents

### Working In This Directory

Substitua o PNG e conserve o nome `ic_launcher.png` dentro da pasta da densidade. O foreground adaptativo fica neste nível, com o nome `adaptive-foreground.png`. Uma densidade nova é uma pasta `mipmap-<densidade>/` com esse mesmo nome de arquivo.

### Testing Requirements

Não há teste. As cinco pastas de densidade existem e cada uma tem `ic_launcher.png`.

### Common Patterns

Densidade no nome da pasta. Um único nome de arquivo, `ic_launcher.png`, em todas.

## Dependencies

### Internal

- `../README.md` — wiring Expo do `adaptive-foreground.png`

### External

Nenhuma biblioteca. O app Android que consome estes arquivos ainda não está neste checkout.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
