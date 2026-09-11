import type { CollectionEntry } from 'astro:content';

// Filenames follow `<slug>.<lang>.md`. Astro's glob loader derives `entry.id`
// from the filename minus the extension, and in some versions strips the dot
// before the language code, so the suffix is matched with the dot optional.
// The same defensive handling is in `service-details.ts` and `workshops.ts`.
export function jobSlug(entry: CollectionEntry<'jobs'>): string {
  const lang = entry.data.lang;
  return entry.id.replace(new RegExp(`\\.?${lang}$`), '');
}

export function jobHref(entry: CollectionEntry<'jobs'>): string {
  const prefix = entry.data.lang === 'en' ? '/en' : '';
  return `${prefix}/careers/${jobSlug(entry)}`;
}
