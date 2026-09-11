/*
 * The navigation tree: the three service groups, their streams, and the
 * services under them resolved to the page each one renders.
 *
 * It lives here rather than in the header because the desktop panels and the
 * mobile menu are two renderings of one tree. Built twice it would be two
 * places for a service to go missing from, and the mobile menu exists to show
 * the same offering, not a shortened one.
 */
import { getCollection } from 'astro:content';
import { getNavGroups, t, type Locale } from '~/i18n';
import { isWorkshop, workshopHref } from '~/data/workshops';
import { hasServiceDetail, serviceDetailHref } from '~/data/service-details';
import type { ServiceGroupKey, ServiceStreamKey } from '~/data/service-groups';

export interface NavItem {
  track: string;
  title: string;
  /** Absent where the service has no detail page of its own. */
  href?: string;
}

export interface NavStream {
  key: ServiceStreamKey;
  label: string;
  items: NavItem[];
}

export interface NavPanel {
  key: ServiceGroupKey;
  /** The group's anchor on the services index. */
  href: string;
  /** The short name, which is what fits a header bar. */
  nav: string;
  /** The full name, which is what a panel has room for. */
  label: string;
  blurb: string;
  streams: NavStream[];
}

export async function getNavPanels(lang: Locale): Promise<NavPanel[]> {
  const strings = t(lang);
  const entries = await getCollection('services', (e) => e.data.lang === lang);

  /** The detail page a service links to, or nothing where it has none. */
  const hrefFor = (track: string): string | undefined => {
    const entry = entries.find((e) => e.data.track === track);
    if (!entry) return undefined;
    if (isWorkshop(entry)) return workshopHref(entry);
    return hasServiceDetail(entry) ? serviceDetailHref(entry) : undefined;
  };

  const titleFor = (track: string): string =>
    entries.find((e) => e.data.track === track)?.data.title.replace(/\n/g, ' ') ?? track;

  return getNavGroups(lang).map((group) => ({
    ...group,
    streams: group.streams.map((stream) => ({
      key: stream.key,
      label: strings.serviceStreams[stream.key],
      items: stream.tracks.map((track) => ({
        track,
        title: titleFor(track),
        href: hrefFor(track),
      })),
    })),
  }));
}
