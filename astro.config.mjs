// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// The one place the origin is defined. Components read it back as `Astro.site`
// rather than reaching for the environment a second time.
//
// This runs before Vite loads the dotenv files, so it sees the real environment
// only: locally, export SITE_URL, do not put it in `.env.local`. Reading it here
// is still right, because `site` feeds the sitemap and the canonical tags alike.
//
// `||` and not `??`: an unset GitHub Actions secret expands to an empty string,
// which is not nullish, so `??` would let the empty value through and every
// canonical URL would come out relative.
const SITE = process.env.SITE_URL || 'https://faviens.com';

/*
 * Routes that have been live and have moved. `/team` and `/en/team` were
 * published on 2026-09-09 and renamed to the contact page on 2026-09-11, and
 * they had three days in the sitemap to be indexed and linked from.
 *
 * A static host has no redirect rules, so Astro emits a small HTML page at the
 * old path carrying a canonical link and a meta refresh. That is weaker than a
 * 301 and it is what a static site gets; it is still strictly better than the
 * 404 the rename would otherwise leave behind.
 *
 * These entries are permanent once added. Delete one only when the old URL has
 * genuinely stopped being requested.
 */
const MOVED = {
  '/team': '/kontakt',
  '/en/team': '/en/contact',
};

export default defineConfig({
  site: SITE,
  trailingSlash: 'never',
  build: { format: 'directory' },
  redirects: MOVED,
  i18n: {
    defaultLocale: 'de',
    locales: ['de', 'en'],
    routing: { prefixDefaultLocale: false },
  },
  integrations: [
    sitemap({
      // A redirect stub is not a page. Left in, the sitemap would go on
      // advertising the old URL as canonical content and undo the rename.
      filter: (page) =>
        !Object.keys(MOVED).some((from) => new URL(page).pathname.replace(/\/$/, '') === from),
      i18n: {
        defaultLocale: 'de',
        locales: { de: 'de-CH', en: 'en' },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
