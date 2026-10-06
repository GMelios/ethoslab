# Greek translation: scope

Status: scoping, 6 October 2026. Nothing below is built yet.

## What is already in place

- Routing: every page exists under `/el/` as soon as `'el'` is added to `PUBLISHED_LOCALES` in `src/i18n/config.ts`. Hreflang tags, the sitemap and the language switcher in the header are wired.
- Fallback: content entries missing in Greek fall back to English with a notice (`CONTENT_FALLBACK`).
- Fonts: Geologica and IBM Plex Sans both include Greek.
- Interface strings: 50 of 56 keys in `src/i18n/ui.ts` already have a draft Greek version.
- Reference Greek: 17 pages imported from the old Greek site (`src/content/pages/el/`: history, services, domains, about and others) give tone and terminology, including the company's Greek name (Κέντρο Έρευνας για τη Διακυβέρνηση & την Αειφορία, from the June 2026 ESG LAB press release).
- Room Wisdom: a Greek synthetic demo session already exists (`crowdwisdom/demo/DEMO01_dashboard.html`).

## How much text there is

Word counts of English copy that is shown on the site.

| Source | Where | Words | Phase |
|---|---|---|---|
| Interface strings (menus, labels, buttons) | `src/i18n/ui.ts` | ~250, 6 keys missing | 1 |
| Homepage, Services, three service pages, Products, three product pages, About, Team, Contact, Insights index, News index | copy written inside `src/pages/**`, `src/components/**` | ~3,100 | 1 |
| Services, domains, principles, site data | `src/data/offer.ts`, `ethos.ts`, `site.ts`, `events.ts` | ~1,000 | 1 |
| Privacy policy and terms of use | `src/content/pages/en/{privacy-policy-gdpr,terms-of-use}.md` | ~2,400 | 1 (needs legal review) |
| Products (cards) | `src/content/products/en/` | ~90 | 1 |
| Research stories (MultiPoD, disability benefits) | `src/data/question.ts`, `src/data/stories/` | ~2,500 | 2 |
| Projects (13 listed) | `src/content/projects/en/` | ~3,400 | 2 |
| Team bios (9) | `src/content/people/en/` | ~1,300 | 2 |
| News (6 posts) | `src/content/posts/en/` | ~950 | 2 |
| Research entry | `src/content/research/en/` | ~100 | 2 |
| **Total** | | **~15,000** | |

Phase 1 (about 6,800 words) is enough to launch `/el/`: every page has a Greek frame, and pages without a Greek entry fall back to English with a notice.

## Engineering work (independent of who translates)

1. **Move page copy out of templates.** Pages and components hold English sentences directly. Each needs its copy in a per-language object (`{ en: {...}, el: {...} }[lang]`) or in a content entry. About 15 files, largest first: Room Wisdom, RWI, About, Services, Home.
2. **Make the data files bilingual.** `offer.ts`, `ethos.ts`, `events.ts` and the navigation labels in `site.ts` become per-language.
3. **Greek research stories.** The MultiPoD story is generated from the case-study data with English grammar (number words, list joining, plural forms). A Greek version needs its own templates; the build-time checks stay shared.
4. **Greek content entries.** Add `src/content/<collection>/el/<same-slug>.md` for projects, people, products, posts and legal pages.
5. **Number and date formats.** Dates already switch to `el-GR`. Decide whether charts use a decimal comma in Greek (0,52) as Greek convention expects; `EffectSizeChart` needs the locale passed through.
6. **Greek uppercase.** Eyebrows and labels are uppercase; with `lang="el"` browsers drop the accents, which is correct. Check in Safari and Chrome.
7. **Search.** Pagefind builds a separate Greek index from the `lang` attribute. Check that Greek queries (with and without accents) find pages.
8. **Images with English text.** The RWI explorer screenshot and the Room Wisdom dashboard image are English. Keep them, or replace with Greek versions; the Room Wisdom demo can switch to the Greek session.
9. **Turn it on.** Add `'el'` to `PUBLISHED_LOCALES`, complete the 6 missing interface strings, build, screenshot every Greek page at 1440px and 390px.

## Decisions needed

1. **Who translates.** Recommended: Claude drafts all Greek in one consistent pass with a shared glossary, and a native Greek speaker on the team reviews (Phase 1 first). The privacy policy and terms should be checked by whoever handles legal and GDPR matters.
2. **Service and product names.** Proposed: translate the three service names (e.g. Έρευνα & Σχεδιασμός, Αξιολόγηση & Αντίκτυπος, Κλιμάκωση) and keep product names in English (Reframing Welfare Index, Room Wisdom, The Experimentalist).
3. **Headline.** "What works, for whom, and why." needs a Greek line that reads naturally, not a literal translation. The interface draft is "Τι λειτουργεί, για ποιον και γιατί".
4. **URLs.** Proposed: keep English slugs under `/el/` (e.g. `/el/services/research-design/`). Greek slugs are possible but add maintenance for little gain.
5. **Names.** How team members' names appear in Greek (e.g. Γιώργος Μέλιος or George Melios).
6. **Decimal comma** in charts and figures (see 5 above).
7. **Phase 2 timing:** with Phase 1, or later.

## Suggested order

1. Engineering steps 1, 2 and 5 to 7, with English unchanged (no visible change).
2. Glossary of about 60 recurring terms, agreed with the reviewer.
3. Phase 1 Greek draft, review, fixes.
4. Turn on `/el/` (step 9).
5. Phase 2 content, then the Greek research stories.
