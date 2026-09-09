import type { CollectionEntry } from 'astro:content';

// Tracks that render as individual /workshops/[slug] detail pages.
export const WORKSHOP_TRACKS: readonly string[] = [
  'agentic-ai-leadership',
  'ai-governance',
  'llm-prompting',
  'coding-agents',
  'agentic-ai',
  'data',
  'code',
  'cloud',
];

// Filenames follow the pattern `<slug>-workshop.<lang>.md`. Astro's glob loader
// derives `entry.id` from the filename minus the extension, and in some
// versions strips the dot before the language code, leaving e.g.
// `agentic-ai-workshopen` instead of `agentic-ai-workshop.en`. Strip either
// form defensively, then drop the trailing `-workshop`, so the URL slug reads
// cleanly (`/workshops/agentic-ai`).
export function workshopSlug(entry: CollectionEntry<'services'>): string {
  const lang = entry.data.lang;
  return entry.id.replace(new RegExp(`\\.?${lang}$`), '').replace(/-workshop$/, '');
}

export function isWorkshop(entry: CollectionEntry<'services'>): boolean {
  return WORKSHOP_TRACKS.includes(entry.data.track);
}

export function workshopHref(entry: CollectionEntry<'services'>): string {
  const prefix = entry.data.lang === 'en' ? '/en' : '';
  return `${prefix}/workshops/${workshopSlug(entry)}`;
}
