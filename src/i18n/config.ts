export const LOCALES = {
  en: { label: 'English', short: 'EN', htmlLang: 'en-GB', ogLocale: 'en_GB' },
  el: { label: 'Ελληνικά', short: 'ΕΛ', htmlLang: 'el', ogLocale: 'el_GR' },
} as const;

export type Locale = keyof typeof LOCALES;

export const DEFAULT_LOCALE: Locale = 'en';

/**
 * Locales that are actually built. To launch Greek:
 *   1. finish the `el` strings in src/i18n/ui.ts
 *   2. add content under src/content/<collection>/el/
 *   3. add 'el' here. Every route under src/pages/[...locale]/ picks it up.
 */
export const PUBLISHED_LOCALES: Locale[] = ['en'];

/**
 * When a Greek page asks for an entry that only exists in English, show the
 * English entry (with a notice) instead of dropping it from lists.
 */
export const CONTENT_FALLBACK = true;
