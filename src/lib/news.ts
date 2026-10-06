import { getLocalized } from '../i18n/utils';
import type { Locale } from '../i18n/config';

/** News and blog posts, newest first. URLs use the file name (date prefix included). */
export async function getNews(lang: Locale) {
  const all = await getLocalized('posts', lang);
  return all
    .filter((p) => p.data.date)
    .map((p) => ({ ...p, url: p.slug, when: new Date(p.data.date!) }))
    .sort((a, b) => b.when.getTime() - a.when.getTime());
}

export const newsDate = (d: Date, lang: Locale) => d.toLocaleDateString(lang === 'el' ? 'el-GR' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
