# Domain Docs

How agents should consume this repo's domain documentation before exploring or changing code.

## Before exploring, read these

- **`GLOSSARY.md`** at the repo root — required vocabulary for the Leme.
- **`docs/adr/`** — required decisions for the area you are about to touch. Start with the ADRs that match the work (for example `0001` and `0004` for storage and API key; `0003` and `0007` for vínculos; `0005` and `0006` for hábitos).

If `GLOSSARY.md` or `docs/adr/` is missing, **stop and surface the gap**. Do not invent synonyms or re-decide architecture in silence. The issue #1 and these files are the language of the v1; `/domain-modeling` may extend them, but it does not replace reading what already exists.

## File structure

```
/
├── GLOSSARY.md
├── docs/adr/
│   ├── 0001-sqlite-local-dois-processos.md
│   ├── 0002-sem-usuario-na-v1.md
│   ├── 0003-vinculo-em-juncao.md
│   ├── 0004-chave-so-na-api-http.md
│   ├── 0005-dia-civil-sao-paulo.md
│   ├── 0006-sequencia-hoje-em-aberto.md
│   └── 0007-link-e-unlink.md
└── …
```

## Use the glossary's vocabulary

When your output names a domain concept (in an issue title, a refactor proposal, a hypothesis, a test name, a tool description), use the term as defined in `GLOSSARY.md`. Don't drift to synonyms the glossary explicitly avoids. Prefer stored values (`todo`, `media`) where the glossary distinguishes them from UI labels.

If the concept you need isn't in the glossary yet, that's a signal: either you're inventing language the project doesn't use (reconsider) or there's a real gap (note it for `/domain-modeling`).

## Flag ADR conflicts

If your output contradicts an existing ADR, surface it explicitly rather than silently overriding:

> _Contradicts ADR-0004 (chave só na API HTTP), but worth reopening because…_
