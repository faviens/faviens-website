import type { CollectionEntry } from 'astro:content';

// Consulting services render a `/services/[slug]` engagement page, workshops
// render a `/workshops/[slug]` course page. The two formats deliberately differ:
// an engagement page describes phases and deliverables, a workshop page
// describes an agenda and booking terms. A service opts into a detail page by
// defining `approach` in its frontmatter.
export function hasServiceDetail(entry: CollectionEntry<'services'>): boolean {
  return (entry.data.approach?.length ?? 0) > 0;
}

// Filenames follow `<slug>.<lang>.md`. Astro's glob loader derives `entry.id`
// from the filename minus the extension, and in some versions strips the dot
// before the language code, see the same defensive handling in `workshops.ts`.
export function serviceDetailSlug(entry: CollectionEntry<'services'>): string {
  const lang = entry.data.lang;
  return entry.id.replace(new RegExp(`\\.?${lang}$`), '');
}

export function serviceDetailHref(entry: CollectionEntry<'services'>): string {
  const prefix = entry.data.lang === 'en' ? '/en' : '';
  return `${prefix}/services/${serviceDetailSlug(entry)}`;
}
