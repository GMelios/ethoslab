import { getCollection, type CollectionEntry, type CollectionKey } from 'astro:content';
import { CONTENT_FALLBACK, DEFAULT_LOCALE, PUBLISHED_LOCALES, type Locale } from './config';

/**
 * Every localised route lives under src/pages/[...locale]/. The rest parameter is
 * `undefined` for English (so URLs stay /work/) and 'el' for Greek (/el/work/).
 */
export function localeParams() {
  return PUBLISHED_LOCALES.map((lang) => ({
    params: { locale: lang === DEFAULT_LOCALE ? undefined : lang },
    props: { lang },
  }));
}

/** '/work/' -> '/work/' for English, '/el/work/' for Greek. */
export function localePath(lang: Locale, path = '/') {
  const clean = `/${path.replace(/^\/+/, '')}`;
  return lang === DEFAULT_LOCALE ? clean : `/${lang}${clean === '/' ? '/' : clean}`;
}

/** Content ids look like 'en/edu-well'. */
export function splitId(id: string): { lang: Locale; slug: string } {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Locale, slug: rest.join('/') };
}

export type Localised<C extends CollectionKey> = CollectionEntry<C> & { slug: string; isFallback: boolean };

/**
 * Entries for one language. With CONTENT_FALLBACK, entries missing in `lang`
 * are filled from the default locale and flagged `isFallback` so the page can say so.
 */
export async function getLocalized<C extends CollectionKey>(collection: C, lang: Locale): Promise<Localised<C>[]> {
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  const bySlug = new Map<string, Localised<C>>();
  for (const entry of all) {
    const { lang: entryLang, slug } = splitId(entry.id);
    if (entryLang === lang) bySlug.set(slug, { ...entry, slug, isFallback: false });
  }
  if (CONTENT_FALLBACK && lang !== DEFAULT_LOCALE) {
    for (const entry of all) {
      const { lang: entryLang, slug } = splitId(entry.id);
      if (entryLang === DEFAULT_LOCALE && !bySlug.has(slug)) bySlug.set(slug, { ...entry, slug, isFallback: true });
    }
  }
  return [...bySlug.values()];
}
