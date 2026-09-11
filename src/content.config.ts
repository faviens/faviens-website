import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const langField = z.enum(['de', 'en']);

const services = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/services' }),
  schema: z.object({
    title: z.string(),
    track: z.enum([
      'agentic-install',
      'agentic-deep',
      'agentic-framework',
      'rag',
      'delivery',
      'discovery',
      'ai-roadmap',
      'agentic-ai-leadership',
      'ai-governance',
      'agentic-ai',
      'data',
      'code',
      'cloud',
      'coding-agents',
      'llm-prompting',
    ]),
    bluf: z.string(),
    order: z.number(),
    lang: langField,
    topics: z.array(z.string()).optional(),
    // Workshop-specific optional detail fields (used on /workshops/[slug] pages).
    audience: z.array(z.string()).optional(),
    format: z.array(z.string()).optional(),
    duration: z.string().optional(),
    languages: z.array(z.string()).optional(),
    locations: z.array(z.string()).optional(),
    booking: z.string().optional(),
    // Feeds the generated workshop FAQ. `groupSize` falls back to a shared
    // default, `prerequisites` is per workshop because the answer is the
    // selling point on the non-technical tracks.
    prerequisites: z.string().optional(),
    groupSize: z.string().optional(),
    // Rendered as a footnote under the workshop detail. Used where the subject
    // matter needs a standing caveat, e.g. governance content is orientation
    // for decisions and not legal advice.
    disclaimer: z.string().optional(),
    agenda: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          duration: z.string().optional(),
        }),
      )
      .optional(),
    // Consulting-engagement detail fields (used on /services/[slug] pages).
    // A service renders a detail page as soon as it defines `approach`.
    situation: z.string().optional(),
    approach: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
          deliverable: z.string().optional(),
        }),
      )
      .optional(),
    workstreams: z
      .array(
        z.object({
          title: z.string(),
          description: z.string(),
        }),
      )
      .optional(),
    outcomes: z.array(z.string()).optional(),
    involvement: z.array(z.string()).optional(),
    entryPoint: z.string().optional(),
    // Visible Q&A, also emitted as FAQPage structured data. Workshops generate
    // most of theirs from the fields above and use this for anything extra;
    // engagement pages author the whole list here.
    faq: z
      .array(
        z.object({
          q: z.string(),
          a: z.string(),
        }),
      )
      .optional(),
  }),
});

const team = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/team' }),
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      role: z.string(),
      photo: image().optional(),
      linkedin: z.string().url().optional(),
      order: z.number(),
      lang: langField,
    }),
});

/*
 * Open roles. A collection rather than a table in `src/data`, because a job ad
 * is long-form structured content with a body, and the schema is what stops a
 * German ad shipping without the English one behind it, or without the facts a
 * candidate needs before deciding to write.
 */
const jobs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/jobs' }),
  schema: z.object({
    title: z.string(),
    lang: langField,
    order: z.number(),
    /** One sentence, used on the careers list and as the meta description. */
    bluf: z.string(),
    location: z.string(),
    employmentType: z.string(),
    workMode: z.string(),
    workingLanguage: z.string(),
    /**
     * The day the posting went up, as an ISO date. Quoted and kept as a string:
     * the YAML parser turns an unquoted date-like scalar into a `Date` at the
     * build machine's timezone, which puts it a day out for half the world.
     *
     * There is deliberately no closing date. That one is internal, and this
     * repository is public.
     */
    posted: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    /** schema.org `employmentType`, for the JobPosting structured data. */
    employmentTypeCode: z.enum(['FULL_TIME', 'PART_TIME', 'CONTRACTOR', 'INTERN']),
    /**
     * The recruiting-specific half of the company pitch. The half that is also
     * true of the company generally lives in `i18n` and is rendered on the
     * About page from the same strings, so the two cannot drift.
     */
    pitch: z.array(z.string()),
    responsibilities: z.array(z.string()),
    qualifications: z.array(
      z.object({
        title: z.string(),
        description: z.string(),
      }),
    ),
  }),
});

export const collections = { services, team, jobs };
