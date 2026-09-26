# Ethos Lab website (prototype)

Astro 7 + Tailwind 4, content in Markdown collections, English now and structured for Greek.

## Run it

```bash
nvm use            # Node 22 (Astro 7 needs >= 22.12)
npm install
npm run dev        # http://localhost:4321
```

Astro 7 runs `astro dev` as a background daemon when it is not attached to a terminal. Stop one with `npx astro dev stop`.

| Command | What it does |
|---|---|
| `npm run dev` | Dev server on port 4321 |
| `npm run build` | Static build to `dist/` (also writes `sitemap-index.xml`) |
| `npm run import:wp` | Re-import pages, posts, projects, people and images from ethoslab.gr. Report: `docs/wp-import-report.md` |
| `npm run shots` | Build first, then screenshot every direction and key page at 1440px and 390px into `screenshots/`, with layout checks |
| `npm run shots -- --themes=a,b,c` | Also screenshot the inner pages in each direction |
| `npm run check` | Type-check |

## Reviewing the three directions

- `/a` editorial and research-led, `/b` warm and illustrated, `/c` data-forward.
- `/` renders whichever is set in `src/data/site.ts` (`homeDirection`).
- Each direction is a **theme** (CSS tokens in `src/styles/global.css`), not a separate site. Visiting `/b` remembers B, and every inner page (Work, case studies, About...) then renders in B. The black switcher at the bottom does the same; `?theme=c` on any URL works too. Delete `PrototypeBar.astro` from `Base.astro` once a direction is chosen.

## Structure

```
scripts/import-wp.mjs        WordPress importer (REST + HTML for the project post type)
scripts/screenshots.mjs      Playwright screenshots and layout checks
src/content.config.ts        Schemas for all collections
src/content/<collection>/<lang>/<slug>.md
  projects/                  Work: imported projects + case studies (one model)
  people/                    Team, imported from WordPress
  research/  products/       New content
  pages/  posts/             Imported archive (legal pages are rendered)
src/assets/wp/               Downloaded WordPress images (optimised at build)
src/data/sectors.json        Sector taxonomy: schema enum, Work filter, importer tagging
src/data/site.ts             Contact details, nav, partner logos, proof numbers
src/data/offer.ts            Ethos Test and Ethos Evaluation copy, shared closing CTA
src/data/services.ts         Placeholder positioning copy (homepage A, About)
src/i18n/                    Locales, UI strings (EN + draft EL), helpers
src/pages/[...locale]/       Every localised route (EN at /, EL at /el/)
src/pages/{a,b,c}.astro      Direction review pages
src/components/home/         HomeA, HomeB, HomeC
src/components/EffectSizeChart.astro   Forest plot with confidence intervals
```

## Case studies and the effect-size chart

A Work entry gets the full case-study treatment when its frontmatter has `results`:

```yaml
results:
  title: Effect of the redesigned letter on take-up
  unit: pp                       # shown next to numbers
  unitLabel: Difference from control, percentage points
  decimals: 1
  note: OLS with strata fixed effects; HC2 robust SEs; 95% intervals.
  effects:
    - { group: Applied within 60 days, label: Simplified letter, estimate: 3.1, ciLow: 2.1, ciHigh: 4.1, controlMean: 18.4, n: 24000 }
```

The build fails if any estimate lies outside its own interval. Filled points mean the interval excludes zero; hollow points mean it includes zero. Every number is also available in a table view.

## Importer

- Pages and posts come from `/wp-json/wp/v2/`. The theme's `portfolio-item` type (projects and team profiles) is not exposed in REST, so projects are discovered from the portfolio grid in page content and fetched as HTML.
- Re-running is safe: WordPress fields and the body are refreshed; your fields (`sectors`, `featured`, `listed`, `results`, ...) are kept. Add `sync: false` to freeze an entry. `--prune` deletes imported files that no longer exist upstream.
- Sectors on imported projects are a keyword guess. Review them.

## Launching Greek

1. Complete the `el` strings in `src/i18n/ui.ts`.
2. Add Greek entries under `src/content/<collection>/el/` with the same slug as the English one.
3. Add `'el'` to `PUBLISHED_LOCALES` in `src/i18n/config.ts`. Routes appear under `/el/`, hreflang tags and the sitemap follow. Missing entries fall back to English with a notice (`CONTENT_FALLBACK`).

All fonts include Greek glyphs.

## Placeholder inventory (replace before launch)

| What | Where | Marked on site |
|---|---|---|
| Three case studies with simulated results | `src/content/projects/en/{benefit-letters-trial,youth-hiring-subsidy,trust-local-government}.md` | "Illustrative" |
| Four research entries | `src/content/research/en/*` (all except the SSRN paper) | "Sample" |
| Proof numbers (3 of 4) | `src/data/site.ts` `proof` | "Sample figure" |
| B homepage: research-methods wording, logo strip, three Recent work cards, client quote, Experimentalist note | `src/components/home/HomeB.astro` | "Placeholder" |
| Ethos Test and Ethos Evaluation: timelines, price, formats, examples | `src/data/offer.ts`, `src/pages/[...locale]/{test,evaluation}.astro` | "Placeholder" |
| Product descriptions | `src/content/products/en/*` | "Draft copy" |
| Positioning and service copy | `src/data/services.ts`, page intros | About page only |
| Contact form (not connected) | `src/pages/[...locale]/contact.astro` | "Prototype" |
