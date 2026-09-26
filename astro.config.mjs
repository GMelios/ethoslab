// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ethoslab.gr',
  // English lives at the root, Greek will live under /el/. Routes are generated from
  // PUBLISHED_LOCALES in src/i18n/config.ts, so only English pages are built today.
  i18n: {
    locales: ['en', 'el'],
    defaultLocale: 'en',
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      i18n: { defaultLocale: 'en', locales: { en: 'en-GB', el: 'el-GR' } },
      // Review routes (directions, story variants, the review hub) stay out of the sitemap.
      filter: (page) => !/^\/(a|b|c|review)(\/|$)/.test(new URL(page).pathname),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // The dev toolbar sits where the prototype direction switcher lives.
  devToolbar: { enabled: false },
});
