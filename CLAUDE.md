# Ethos Lab website: working rules

## Copy rules

- Render every `[TODO]` in a copy brief with the visible "Placeholder" tag (`src/components/Placeholder.astro`), with a short note on what goes there.
- Do not invent client names, figures, prices, timelines or quotes. If the brief does not supply one, it is a placeholder.
- No em dashes anywhere. Imported WordPress content in `src/content/` still contains some; they come back on re-import.
- Keep the existing visual design when changing copy. Direction B is the active one (`/b`, `src/components/home/HomeB.astro`).

## Checks

- Node 22 is required: run `nvm use` first (the default shell Node is too old for Astro 7).
- `npx astro check` for types, then `BASE_URL=http://localhost:4321 node scripts/screenshots.mjs --only=b` (or `--paths=/test/,/evaluation/`) for screenshots and layout checks at 1440px and 390px.
