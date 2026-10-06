# Ethos Lab website: working rules

## Copy rules

- Render every `[TODO]` in a copy brief with the visible "Placeholder" tag (`src/components/Placeholder.astro`), with a short note on what goes there.
- Do not invent client names, figures, prices, timelines or quotes. If the brief does not supply one, it is a placeholder.
- No em dashes anywhere. The importer turns them into commas; older imported pages in `src/content/pages/` may still contain some.
- Keep the existing visual design when changing copy. Tokens and section bands (`.band-white`, `.band-mist`, `.band-midnight`, `.band-deep`, `.band-ember`) are in `src/styles/global.css`; the homepage is `src/components/home/Home.astro`.
- Positioning: headline "What works, for whom, and why." (three lines), second line "Research, data and tools for the decisions that matter." Three services in `src/data/offer.ts`: Research & Design, Evaluation & Impact, Scale up. Domains and principles in `src/data/ethos.ts`. No named method or framework (ETHOS was dropped).

## Checks

- Node 22 is required: run `nvm use`, or put `/opt/homebrew/opt/node@22/bin` first on PATH (the default shell Node is too old for Astro 7).
- `npx astro check` for types, then `BASE_URL=http://localhost:4321 node scripts/screenshots.mjs --only=home` (or `--paths=/services/,/insights/`) for screenshots and layout checks at 1440px and 390px.
- The demo deploys to GitHub Pages at https://gmelios.github.io/ethoslab/ on every push to main (`.github/workflows/deploy.yml`). Internal links must go through `localePath()` or `withBase()` so they carry the `/ethoslab` base.
