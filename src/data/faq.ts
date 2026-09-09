import type { CollectionEntry } from 'astro:content';
import type { Locale } from '~/i18n';

export interface FaqItem {
  q: string;
  a: string;
}

/**
 * Workshop FAQs are generated rather than authored. Duration, locations,
 * languages and booking terms are already frontmatter on every workshop, so
 * repeating them as hand-written Q&A across sixteen files would be sixteen
 * chances for the answer to drift from the data on the same page.
 *
 * A workshop only authors what cannot be derived: `prerequisites`, and
 * anything extra in `faq`.
 */

const DEFAULT_GROUP_SIZE: Record<Locale, string> = {
  de: 'Üblicherweise bis 20 Teilnehmende. Grössere Gruppen auf Anfrage.',
  en: 'Usually up to 20 participants. Larger groups on request.',
};

const LABELS: Record<
  Locale,
  {
    heading: string;
    duration: string;
    locations: string;
    languages: string;
    groupSize: string;
    prerequisites: string;
    ownCase: string;
    ownCaseAnswer: string;
    confidentiality: string;
    confidentialityAnswer: string;
    booking: string;
    onsiteAndRemote: (cities: string) => string;
    onsiteOnly: (cities: string) => string;
    remoteOnly: string;
    languageAnswer: (languages: string) => string;
  }
> = {
  de: {
    heading: 'Häufige Fragen',
    duration: 'Wie lange dauert der Workshop?',
    locations: 'Findet der Workshop vor Ort oder remote statt?',
    languages: 'In welcher Sprache wird der Workshop gehalten?',
    groupSize: 'Für wie viele Teilnehmende ist der Workshop ausgelegt?',
    prerequisites: 'Welches Vorwissen brauchen die Teilnehmenden?',
    ownCase: 'Können wir einen eigenen Anwendungsfall einbringen?',
    ownCaseAnswer:
      'Ja. Wir arbeiten mit Ihrem Anwendungsfall, wenn einer vorliegt, sonst mit unserem Referenzbeispiel. Was Sie mitbringen, prägt den Workshop stärker als jede Folie.',
    confidentiality: 'Was passiert mit den Inhalten, die wir mitbringen?',
    confidentialityAnswer:
      'Sie bleiben bei Ihnen. Unterlagen, Daten und Fragestellungen aus dem Workshop verwenden wir ausschliesslich für den Workshop und geben sie nicht weiter. Eine Vertraulichkeitsvereinbarung schliessen wir auf Wunsch vorab ab.',
    booking: 'Wie wird der Workshop gebucht?',
    onsiteAndRemote: (cities) =>
      `Beides. Vor Ort in ${cities} und in der übrigen Schweiz, oder remote als Online-Session.`,
    onsiteOnly: (cities) => `Vor Ort in ${cities} und in der übrigen Schweiz.`,
    remoteOnly: 'Remote als Online-Session.',
    languageAnswer: (languages) => `Auf ${languages}, nach Absprache.`,
  },
  en: {
    heading: 'Frequently asked',
    duration: 'How long does the workshop take?',
    locations: 'Is the workshop on-site or remote?',
    languages: 'Which language is the workshop held in?',
    groupSize: 'How many participants is the workshop designed for?',
    prerequisites: 'What background do participants need?',
    ownCase: 'Can we bring our own use case?',
    ownCaseAnswer:
      'Yes. We work with your use case where you have one, and with our reference example where you do not. What you bring shapes the workshop more than any slide does.',
    confidentiality: 'What happens to the material we bring?',
    confidentialityAnswer:
      'It stays yours. Documents, data and questions raised in the workshop are used for the workshop only and are not shared. We are happy to sign a confidentiality agreement beforehand.',
    booking: 'How is the workshop booked?',
    onsiteAndRemote: (cities) =>
      `Either. On-site in ${cities} and elsewhere in Switzerland, or remote as an online session.`,
    onsiteOnly: (cities) => `On-site in ${cities} and elsewhere in Switzerland.`,
    remoteOnly: 'Remote, as an online session.',
    languageAnswer: (languages) => `In ${languages}, as agreed.`,
  },
};

const REMOTE = /remote|online/i;

function joinList(items: readonly string[], lang: Locale): string {
  if (items.length <= 1) return items.join('');
  const last = items[items.length - 1];
  const rest = items.slice(0, -1).join(', ');
  return `${rest} ${lang === 'de' ? 'oder' : 'or'} ${last}`;
}

function locationAnswer(locations: readonly string[] | undefined, lang: Locale): string | null {
  if (!locations || locations.length === 0) return null;
  const labels = LABELS[lang];
  const onsite = locations.filter((l) => !REMOTE.test(l));
  const hasRemote = locations.some((l) => REMOTE.test(l));
  const cities = onsite.join(', ');
  if (onsite.length === 0) return hasRemote ? labels.remoteOnly : null;
  return hasRemote ? labels.onsiteAndRemote(cities) : labels.onsiteOnly(cities);
}

export function buildWorkshopFaq(entry: CollectionEntry<'services'>, lang: Locale): FaqItem[] {
  const labels = LABELS[lang];
  const { duration, locations, languages, groupSize, prerequisites, booking, faq } = entry.data;

  const generated: (FaqItem | null)[] = [
    duration ? { q: labels.duration, a: duration } : null,
    (() => {
      const a = locationAnswer(locations, lang);
      return a ? { q: labels.locations, a } : null;
    })(),
    languages && languages.length > 0
      ? { q: labels.languages, a: labels.languageAnswer(joinList(languages, lang)) }
      : null,
    prerequisites ? { q: labels.prerequisites, a: prerequisites } : null,
    { q: labels.groupSize, a: groupSize ?? DEFAULT_GROUP_SIZE[lang] },
    { q: labels.ownCase, a: labels.ownCaseAnswer },
    { q: labels.confidentiality, a: labels.confidentialityAnswer },
    booking ? { q: labels.booking, a: booking } : null,
  ];

  return [...generated.filter((item): item is FaqItem => item !== null), ...(faq ?? [])];
}

/**
 * Engagement pages share the operational questions every prospect asks before
 * a first call, and which are the same whatever the engagement: ownership,
 * where the data runs, how we work. Anything specific to the engagement is
 * authored per service in `faq` and appended.
 */
const SERVICE_FAQ: Record<Locale, FaqItem[]> = {
  de: [
    {
      q: 'Wem gehören Code, Modelle und Ergebnisse am Ende?',
      a: 'Ihnen. Code, Konfiguration und Dokumentation gehen vollständig an Sie über, in Ihren Repositories und Ihrer Umgebung. Wir bauen so, dass Ihr Team weiterarbeiten kann, auch ohne uns.',
    },
    {
      q: 'Wo laufen unsere Daten und Modelle?',
      a: 'In Ihrer Umgebung. Eigene Cloud, eigenes Rechenzentrum oder on-premises, auf Wunsch in einer Schweizer oder europäischen Region. Daten verlassen Ihre Umgebung nur zu den Anbietern, die Sie ausdrücklich freigeben.',
    },
    {
      q: 'Arbeiten Sie remote oder vor Ort?',
      a: 'Beides. Wir sind in Zürich ansässig und schweizweit vor Ort, der laufende Betrieb der Zusammenarbeit funktioniert remote.',
    },
    {
      q: 'Können wir mit einem kleinen, abgegrenzten Schritt beginnen?',
      a: 'Ja, und das ist der Regelfall. Der erste Schnitt ist bewusst klein gehalten, damit früh etwas Nutzbares vorliegt und die Entscheidung über den nächsten Schritt auf Erfahrung beruht statt auf einer Planung.',
    },
  ],
  en: [
    {
      q: 'Who owns the code, models, and results in the end?',
      a: 'You do. Code, configuration, and documentation transfer to you in full, in your repositories and your environment. We build so your team can carry on without us.',
    },
    {
      q: 'Where do our data and models run?',
      a: 'In your environment. Your own cloud, your own data centre, or on-premises, in a Swiss or European region on request. Data leaves your environment only for the providers you explicitly approve.',
    },
    {
      q: 'Do you work remotely or on-site?',
      a: 'Both. We are based in Zürich and work on-site across Switzerland; the day-to-day of the engagement works remotely.',
    },
    {
      q: 'Can we start with a small, bounded step?',
      a: 'Yes, and that is the norm. The first slice is deliberately small so something usable exists early and the decision about the next step rests on experience rather than on a plan.',
    },
  ],
};

export function buildServiceFaq(entry: CollectionEntry<'services'>, lang: Locale): FaqItem[] {
  return [...(entry.data.faq ?? []), ...SERVICE_FAQ[lang]];
}

export function faqHeading(lang: Locale): string {
  return LABELS[lang].heading;
}
