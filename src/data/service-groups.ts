/**
 * The shape of the services offering: three groups, and the runs inside them.
 *
 * Structure only. Every label and description is copy and lives in
 * `src/i18n`, keyed by the same identifiers, so a group cannot be renamed in
 * one language and not the other.
 *
 * A group with a single stream renders no stream label: the split is a finer
 * grain on one offering, not a second offering, and naming it where there is
 * nothing to distinguish it from is noise.
 */
export type ServiceGroupKey = 'strategy' | 'systems' | 'workshops';
export type ServiceStreamKey =
  'strategy' | 'agentic' | 'data' | 'leadership' | 'ai' | 'foundations';

export interface ServiceStream {
  key: ServiceStreamKey;
  /** Track ids from the content frontmatter, in the order they render. */
  tracks: readonly string[];
}

export interface ServiceGroup {
  key: ServiceGroupKey;
  streams: readonly ServiceStream[];
}

export const SERVICE_GROUPS: readonly ServiceGroup[] = [
  {
    key: 'strategy',
    streams: [{ key: 'strategy', tracks: ['discovery', 'ai-roadmap'] }],
  },
  {
    key: 'systems',
    streams: [
      { key: 'agentic', tracks: ['agentic-framework', 'agentic-install', 'agentic-deep'] },
      { key: 'data', tracks: ['delivery', 'rag'] },
    ],
  },
  {
    key: 'workshops',
    streams: [
      { key: 'leadership', tracks: ['agentic-ai-leadership', 'ai-governance'] },
      { key: 'ai', tracks: ['llm-prompting', 'coding-agents', 'agentic-ai'] },
      { key: 'foundations', tracks: ['data', 'code', 'cloud'] },
    ],
  },
];

/** Every track in a group, in render order, across its streams. */
export function tracksInGroup(group: ServiceGroup): readonly string[] {
  return group.streams.flatMap((stream) => stream.tracks);
}

export function groupForTrack(track: string): ServiceGroup | undefined {
  return SERVICE_GROUPS.find((group) => tracksInGroup(group).includes(track));
}

export function streamForTrack(track: string): ServiceStream | undefined {
  for (const group of SERVICE_GROUPS) {
    const stream = group.streams.find((s) => s.tracks.includes(track));
    if (stream) return stream;
  }
  return undefined;
}

/**
 * The position of a track within its group, one-based. This is the numeral the
 * services page hangs in the margin, and it counts across streams rather than
 * restarting in each: the streams are one offering at finer grain.
 */
export function indexInGroup(track: string): number {
  const group = groupForTrack(track);
  if (!group) return 0;
  return tracksInGroup(group).indexOf(track) + 1;
}
