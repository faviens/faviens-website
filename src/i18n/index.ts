import { de } from './de';
import { SERVICE_GROUPS } from '~/data/service-groups';
import { en } from './en';

export type Locale = 'de' | 'en';

const strings = { de, en } as const;

/**
 * Routes whose slug differs between locales. The naive `/en` prefix used below
 * would send /impressum to /en/impressum, which does not exist, so the language
 * switcher needs the mapping spelled out. Add a pair here whenever a page is
 * given a translated slug rather than a mirrored one.
 */
const LOCALISED_ROUTES: ReadonlyArray<readonly [string, string]> = [
  ['/impressum', '/en/imprint'],
  ['/datenschutz', '/en/privacy'],
  ['/kontakt', '/en/contact'],
];

export function t(locale: Locale) {
  return strings[locale];
}

export function getHomeHref(locale: Locale): string {
  return locale === 'de' ? '/' : '/en';
}

export function getLegalLinks(locale: Locale) {
  const s = strings[locale];
  const imprint = s.pages.imprint.heading;
  const privacy = s.pages.privacy.heading;
  if (locale === 'de') {
    return [
      { href: '/impressum', label: imprint },
      { href: '/datenschutz', label: privacy },
    ];
  }
  return [
    { href: '/en/imprint', label: imprint },
    { href: '/en/privacy', label: privacy },
  ];
}

export function otherLocalePath(pathname: string, currentLocale: Locale): string {
  const normalized = pathname.replace(/\/$/, '') || '/';

  for (const [dePath, enPath] of LOCALISED_ROUTES) {
    if (currentLocale === 'de' && normalized === dePath) return enPath;
    if (currentLocale === 'en' && normalized === enPath) return dePath;
  }

  if (currentLocale === 'de') {
    if (normalized === '/') return '/en';
    return `/en${normalized}`;
  }
  if (normalized === '/en') return '/';
  return normalized.replace(/^\/en/, '') || '/';
}

/**
 * Top-level navigation. The three service groups are tabs of their own rather
 * than one Services tab that hides them: the split is what the grouping
 * communicates, so a visitor should see that there are workshops without
 * hovering anything.
 */
export function getNavGroups(locale: Locale) {
  const s = t(locale);
  const prefix = locale === 'de' ? '' : '/en';
  return SERVICE_GROUPS.map((group) => ({
    key: group.key,
    href: `${prefix}/services#${group.key}`,
    nav: s.nav[group.key],
    label: s.serviceGroups[group.key].label,
    blurb: s.serviceGroups[group.key].blurb,
    streams: group.streams,
  }));
}

/** The pages grouped under About in the navigation. */
export function getAboutLinks(locale: Locale) {
  const s = t(locale);
  const prefix = locale === 'de' ? '' : '/en';
  return [
    { href: `${prefix}/about`, label: s.nav.about },
    { href: `${prefix}/careers`, label: s.nav.careers },
  ];
}

/**
 * The contact page. It is a route of its own rather than a member of the About
 * group, because the header already carries a standing `Kontakt` link and two
 * items under the same word, pointing at different things, is a worse bar than
 * either arrangement on its own. That link now lands here instead of scrolling
 * to the closing block, which the page ends with anyway.
 */
export function contactHref(locale: Locale): string {
  return locale === 'de' ? '/kontakt' : '/en/contact';
}

/** The careers index, which the job pages link back to. */
export function careersHref(locale: Locale): string {
  return locale === 'de' ? '/careers' : '/en/careers';
}

export function servicesHref(locale: Locale): string {
  return locale === 'de' ? '/services' : '/en/services';
}
