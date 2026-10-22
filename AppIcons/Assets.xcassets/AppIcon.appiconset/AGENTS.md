# AppIcon.appiconset

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Imageset do ícone iOS. `Contents.json` associa cada arquivo a um idiom (`iphone`, `ipad`, `ios-marketing`) e a uma escala. Os PNGs têm no nome o lado em pixels.

## Key Files

| File | Description |
|------|-------------|
| `Contents.json` | Mapa do imageset. Cada entrada tem `idiom`, `scale`, `size` (pontos) e `filename`. `expected-size` é o lado em pixels e coincide com o nome do arquivo. |
| `20.png`, `29.png`, `40.png`, `50.png`, `57.png`, `58.png`, `60.png`, `72.png`, `76.png`, `80.png`, `87.png`, `100.png`, `114.png`, `120.png`, `144.png`, `152.png`, `167.png`, `180.png`, `1024.png` | Um PNG por lado em pixels. Vários idioms reutilizam o mesmo arquivo (por exemplo `120.png` em mais de uma entrada). |

## Subdirectories

Nenhum.

## For AI Agents

### Working In This Directory

Substitua o PNG e conserve o nome. Uma entrada nova em `Contents.json` precisa de um `filename` que exista nesta pasta. Apagar um PNG que ainda aparece em `filename` quebra o imageset. O mesmo arquivo pode servir a mais de uma linha do JSON; conte as referências antes de remover.

`1024.png` é a entrada `ios-marketing`. Os demais cobrem iPhone e iPad nas escalas 1x, 2x e 3x que o JSON lista.

### Testing Requirements

Não há teste automatizado. Cada `filename` de `Contents.json` é um arquivo nesta pasta.

### Common Patterns

Nome do arquivo = pixels. `size` no JSON = pontos. `scale` liga os dois. O autor gravado em `info` é `xcode`, versão 1.

## Dependencies

### Internal

- `../../README.md` — soltar este imageset num projeto Xcode

### External

Formato de AppIcon do asset catalog da Apple. Nenhum projeto Xcode neste checkout.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
