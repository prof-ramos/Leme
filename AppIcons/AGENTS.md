# AppIcons

**Parent context:** `../AGENTS.md`
**Generated:** 2026-10-13 · **Updated:** 2026-10-13

## Purpose

Pacote de ícone do Leme exportado pelo appicon.co. Cobre o catálogo do Xcode, o Icon Composer (iOS 26), os mipmaps Android e os tamanhos de loja. O aplicativo ainda não está neste repositório; este diretório é só o pacote.

## Key Files

| File | Description |
|------|-------------|
| `README.md` | O que cada pasta é e como ligar o pacote no Xcode ou no Expo. Leia antes de copiar ícones para um app. |
| `appstore.png` | Tamanho de vitrine da App Store. |
| `playstore.png` | Tamanho de vitrine da Play Store. |

`../AppIcons.zip` é outra cópia deste pacote. Trocar um PNG aqui deixa o zip como estava.

## Subdirectories

| Directory | Purpose |
|-----------|---------|
| `Assets.xcassets/` | Catálogo Xcode (see `Assets.xcassets/AGENTS.md`) |
| `AppIcon.icon/` | Icon Composer, Liquid Glass (see `AppIcon.icon/AGENTS.md`) |
| `android/` | Mipmaps e o foreground adaptativo (see `android/AGENTS.md`) |

## For AI Agents

### Working In This Directory

O passo a passo de Xcode e de Expo está em `README.md`. Para um tamanho que já existe, substitua o PNG e mantenha o nome que o `Contents.json` ou a pasta de densidade já usam. Um nome novo precisa de entrada correspondente no catálogo ou na pasta de densidade.

O parágrafo final do `README.md` é o anúncio da ferramenta que gerou o pacote. A parte operacional é a lista `Contents` e o bloco `Wiring`.

### Testing Requirements

Não há teste automatizado. Confira se cada `filename` citado em `Assets.xcassets/AppIcon.appiconset/Contents.json` continua no disco, e se `AppIcon.icon/icon.json` continua apontando para `icon.png`.

### Common Patterns

O nome do arquivo é o tamanho em pixels (`180.png`, `ic_launcher.png`), não o papel no produto. O papel (iPhone 3x, iPad, loja, foreground adaptativo) está no `Contents.json` ou no nome da pasta `mipmap-*`.

## Dependencies

### Internal

Nenhuma com `docs/` ou com `GLOSSARY.md`. Ícone não é termo de domínio.

### External

O pacote foi gerado pelo appicon.co. O wiring de Expo citado no README usa `npx expo prebuild` depois de copiar os arquivos para `assets/` de um app que ainda não está neste checkout.

## Manual Notes

Notes under this heading are written by humans and preserved on regeneration.
