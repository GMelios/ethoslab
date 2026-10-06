# Ethos Lab — logo and palette

## SVG files (`svg/`)

Flat fills only: no gradients, filters, strokes or embedded images. Each viewBox is cropped tight to the artwork, so clear space must be added in CSS (see below). Every shape carries `class="logo-primary"` (orange) or `class="logo-secondary"` (navy / white), and each brand colour appears as exactly one fill value, so colours can be swapped with a find-and-replace or, for inline SVG, with CSS (see `brand-tokens.css`).

Variants per lockup:
- `-light` — for light backgrounds: #F1592A + #0B1631
- `-dark` — for dark backgrounds: #F1592A + #FFFFFF
- `-mono-navy` / `-mono-white` — single colour

| Lockup | Files | viewBox |
|---|---|---|
| Horizontal, full mark | `ethos-lab-horizontal-{light,dark,mono-navy,mono-white}.svg` | 0 0 2917 442 |
| Horizontal, small mark | `ethos-lab-horizontal-small-{light,dark,mono-navy,mono-white}.svg` | 0 0 2912 434 |
| Stacked, full mark | `ethos-lab-stacked-{light,dark,mono-navy,mono-white}.svg` | 0 0 2318 1206 |
| Stacked, small mark | `ethos-lab-stacked-small-{light,dark,mono-navy,mono-white}.svg` | 0 0 2318 1196 |
| Mark, full | `ethos-lab-mark-{light,dark,mono-navy,mono-white}.svg` | 0 0 959 871 |
| Mark, small | `ethos-lab-mark-small-{light,dark,mono-navy,mono-white}.svg` | 0 0 946 854 |
| Favicon | `favicon.svg` (transparent), `favicon-dark.svg` (navy tile) | 0 0 16 16 |

The full mark's network lines drop below 1px under 96px tall, so use the **small-mark** lockups for the site header and anything smaller.

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
```

## Palette

| Role | Name | Hex | Use |
|---|---|---|---|
| Primary | Ethos Orange | `#F1592A` | Logo mark and ETHOS, primary buttons, icons, headings 24px and larger. Not for body-size text on white. |
| Accent | Ember | `#C2410C` | Orange for text and links on light backgrounds; hover and pressed state of orange buttons. |
| Dark background · Body text | Midnight Navy | `#0B1631` | Main dark background; LAB and network in the logo; headings and body text on light backgrounds. |
| Secondary dark background | Navy 800 | `#1B2A4E` | Cards, panels and footer bands sitting on Midnight Navy. |
| Light background | White | `#FFFFFF` | Main page background; text on dark backgrounds. |
| Muted text (light) | Slate | `#5B6478` | Captions, metadata and secondary copy on light backgrounds; form-field borders. |
| Muted text (dark) | Haze | `#A3ADC2` | Captions, metadata and secondary copy on dark backgrounds; form-field borders on dark. |
| Lines (light) | Line | `#D5D9E2` | Dividers and table rules on light backgrounds. Decorative only. |
| Lines (dark) | Line Dark | `#2C3A60` | Dividers and table rules on dark backgrounds. Decorative only. |
| Links | Ember `#C2410C` on light backgrounds; Ethos Orange `#F1592A` on dark backgrounds | | Always underlined. |

### Approved text colours by background (WCAG 2.1 contrast)

AAA ≥ 7:1 · AA ≥ 4.5:1 (any text) · Large/UI ≥ 3:1 (text 24px+, or 19px+ bold; icons, borders) · No < 3:1

| Text \\ Background | White | Midnight Navy | Navy 800 | Ethos Orange |
|---|---|---|---|---|
| Midnight Navy `#0B1631` | 17.90 AAA | — | 1.27 No | 5.29 AA |
| Slate `#5B6478` | 5.93 AA | 3.02 Large/UI | 2.38 No | 1.75 No |
| Ember `#C2410C` | 5.18 AA | 3.46 Large/UI | 2.73 No | 1.53 No |
| Ethos Orange `#F1592A` | 3.39 Large/UI | 5.29 AA | 4.17 Large/UI | — |
| White `#FFFFFF` | — | 17.90 AAA | 14.11 AAA | 3.39 Large/UI |
| Haze `#A3ADC2` | 2.25 No | 7.94 AAA | 6.26 AA | 1.50 No |

## Minimum sizes

| Asset | Files | Min on screen | Min in print | Use for |
|---|---|---|---|---|
| Horizontal, full mark | `ethos-lab-horizontal-*.svg` | 96px tall (634px wide) | 20mm tall | Hero, covers, print, slides |
| Horizontal, small mark | `ethos-lab-horizontal-small-*.svg` | 24px tall (161px wide) | 30mm wide | Website header and footer, email signatures, documents |
| Stacked, full mark | `ethos-lab-stacked-*.svg` | 260px wide | 55mm wide | Posters, report covers, square formats |
| Stacked, small mark | `ethos-lab-stacked-small-*.svg` | 100px wide | 25mm wide | Mobile menus, badges, partner grids |
| Mark, full | `ethos-lab-mark-*.svg` | 96px tall | 20mm tall | Large brand moments |
| Mark, small | `ethos-lab-mark-small-*.svg` | 24px tall (use up to 95px) | 6mm tall | Avatars, app icons, social |
| Favicon | `favicon.svg / favicon-dark.svg` | 16px | — | Browser tabs, bookmarks (16–48px) |

## Clear space

Keep a margin of **X** free of text, images and edges on all four sides, measured from the edge of the SVG (the viewBox is tight to the artwork).

| Asset | X | Example |
|---|---|---|
| Horizontal lockups | X = 0.5 × logo height (the cap height of ETHOS) | 32px tall logo → 16px clear space |
| Stacked lockups | X = 0.19 × logo height (the cap height of ETHOS) | 200px tall logo → 38px clear space |
| Mark and favicon | X = 0.25 × mark height | 48px mark → 12px clear space |
