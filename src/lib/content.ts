import sectorData from '../data/sectors.json';
import type { Locale } from '../i18n/config';
import { getLocalized } from '../i18n/utils';

export const SECTORS = sectorData.sectors;

export function sectorLabel(id: string, lang: Locale) {
  const s = SECTORS.find((x) => x.id === id);
  return s ? (s.label as Record<string, string>)[lang] ?? s.label.en : id;
}

/** Work entries in display order: case studies with results first, then featured, then the rest. */
export async function getWork(lang: Locale) {
  const all = await getLocalized('projects', lang);
  return all
    // Illustrative case studies (simulated numbers) never appear on the demo.
    .filter((p) => p.data.listed && !p.data.illustrative)
    .sort(
      (a, b) =>
        Number(Boolean(b.data.results)) - Number(Boolean(a.data.results)) ||
        Number(b.data.featured) - Number(a.data.featured) ||
        a.data.order - b.data.order ||
        a.data.title.localeCompare(b.data.title),
    );
}

/** Newest first. `realFirst` lifts real outputs above placeholder samples (used on homepages). */
export async function getResearch(lang: Locale, { realFirst = false } = {}) {
  const all = await getLocalized('research', lang);
  return all.sort(
    (a, b) =>
      (realFirst ? Number(a.data.placeholder) - Number(b.data.placeholder) : 0) ||
      b.data.date.getTime() - a.data.date.getTime(),
  );
}

export const RESEARCH_TYPES: Record<string, string> = {
  'working-paper': 'Working paper',
  'journal-article': 'Journal article',
  'policy-brief': 'Policy brief',
  report: 'Report',
  dataset: 'Dataset',
};

export function formatDate(d: Date, lang: Locale, opts: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' }) {
  return d.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', opts);
}

/** A short programme line for imported projects, e.g. "Horizon Europe". */
export function programmeLine(programmes: string[] | undefined) {
  const specific = (programmes ?? []).filter((p) => !['EU-funded', 'Public policy'].includes(p));
  return specific.length ? specific.join(', ') : programmes?.includes('EU-funded') ? 'EU-funded' : undefined;
}
