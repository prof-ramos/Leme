# Assets.xcassets

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Catálogo de assets do Xcode com um único imageset: o ícone do aplicativo. Não há outras pastas de imagem neste catálogo.

## Key Files

Nenhum arquivo solto neste nível além do que o Finder cria. O catálogo é a pasta `AppIcon.appiconset/`.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `AppIcon.appiconset/` | `Contents.json` e os PNGs do ícone iOS (see `AppIcon.appiconset/AGENTS.md`) |

## For AI Agents

### Working In This Directory

Para ligar no Xcode, o `../README.md` manda levar `AppIcon.appiconset/` para o projeto. Este nível só existe para ser o catálogo em volta desse imageset.

### Testing Requirements

Não há teste. O imageset continua sendo o único subdiretório de conteúdo.

### Common Patterns

Um catálogo, um imageset de ícone. Tamanhos e idioms ficam no `Contents.json` do imageset, não aqui.

## Dependencies

### Internal

- `../README.md` — como soltar o imageset num projeto Xcode

### External

Xcode asset catalog. Nenhum projeto `.xcodeproj` neste checkout.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
