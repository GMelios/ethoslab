// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// The demo is served from GitHub Pages at https://gmelios.github.io/ethoslab/.
// SITE and BASE_PATH are set by .github/workflows/deploy.yml; locally the site runs at /.
export default defineConfig({
  site: process.env.SITE ?? 'https://ethoslab.gr',
  base: process.env.BASE_PATH ?? '/',
  trailingSlash: 'ignore',
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
      filter: (page) => !/\/search\/?$/.test(new URL(page).pathname),
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  // The dev toolbar sits where the prototype direction switcher lives.
  devToolbar: { enabled: false },
});
