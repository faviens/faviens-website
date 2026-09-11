export interface LegalSection {
  heading: string;
  body: string[];
}

export interface Strings {
  footer: {
    contact: string;
    legal: string;
    location: string;
    pronunciationLabel: string;
    pronunciation: string;
    pronunciationIpa: string;
    rights: string;
  };
  hero: {
    descriptor: string;
    /**
     * The three services, with the prefix that belongs to all of them stated
     * once. Ordered as an engagement runs: literacy first, then the decisions
     * it makes possible, then what gets built.
     */
    services: { prefix: string; items: readonly string[] };
    lead: string;
  };
  cta: {
    eyebrow: string;
  };
  pages: {
    home: { title: string; description: string };
    notFound: { title: string; heading: string; lead: string; back: string };
    imprint: {
      title: string;
      description: string;
      heading: string;
      responsibleHeading: string;
      representativeHeading: string;
      contactHeading: string;
      /** Country name for the address block. The code lives in `COMPANY`. */
      country: string;
      registerHeading: string;
      registerOffice: string;
      sections: LegalSection[];
    };
    privacy: {
      title: string;
      description: string;
      heading: string;
      lead: string;
      updated: string;
      sections: LegalSection[];
    };
  };
  languageSwitcher: {
    de: string;
    en: string;
    label: string;
  };
  a11y: {
    skipToContent: string;
  };
  nav: {
    strategy: string;
    systems: string;
    workshops: string;
    about: string;
    careers: string;
    contact: string;
    allServices: string;
  };
  serviceGroups: Record<'strategy' | 'systems' | 'workshops', { label: string; blurb: string }>;
  serviceStreams: Record<
    'strategy' | 'agentic' | 'data' | 'leadership' | 'ai' | 'foundations',
    string
  >;
  serviceDetail: {
    eyebrow: string;
    situation: string;
    approach: string;
    deliverable: string;
    workstreams: string;
    outcomes: string;
    frame: string;
    duration: string;
    involvement: string;
    format: string;
    entryPoint: string;
  };
  workshopDetail: {
    eyebrow: string;
    takeaways: string;
    audience: string;
    format: string;
    agenda: string;
    details: string;
    duration: string;
    languages: string;
    locations: string;
    booking: string;
    prerequisites: string;
  };
  servicePages: {
    services: { title: string; heading: string; lead: string };
    about: {
      title: string;
      heading: string;
      lead: string;
      approachHeading: string;
      approach: string[];
      valuesHeading: string;
      values: { title: string; body: string }[];
      disciplinesHeading: string;
      disciplinesLead: string;
    };
    contact: {
      title: string;
      heading: string;
      lead: string;
      personHeading: string;
      emailLabel: string;
      locationLabel: string;
      backgroundLabel: string;
      portraitLabel: string;
    };
    careers: {
      title: string;
      heading: string;
      lead: string;
      openRolesHeading: string;
      viewRole: string;
      profilesHeading: string;
      profilesLead: string;
      expectationsHeading: string;
      applyLabel: string;
      apply: string;
    };
  };
  jobPage: {
    eyebrow: string;
    companyHeading: string;
    roleHeading: string;
    responsibilitiesHeading: string;
    qualificationsHeading: string;
    detailsHeading: string;
    locationLabel: string;
    employmentLabel: string;
    workModeLabel: string;
    languageLabel: string;
    applyHeading: string;
    applyBody: string;
    backLabel: string;
  };
  ctaHeadline: string;
}

export const de: Strings = {
  footer: {
    contact: 'Kontakt',
    legal: 'Rechtliches',
    location: 'Zürich, Schweiz',
    pronunciationLabel: 'Aussprache',
    pronunciation: 'FAH-vee-ens',
    pronunciationIpa: '/ˈfɑːviˌɛns/',
    rights: 'Alle Rechte vorbehalten.',
  },
  hero: {
    descriptor: 'Agentic-AI-Beratung · Zürich',
    services: { prefix: 'KI-Agenten', items: ['Upskilling', 'Strategie', 'Umsetzung'] },
    lead: 'KI, Autonome Agenten & Data Analytics. Cloud oder On-Premises.',
  },
  cta: {
    eyebrow: 'Bereit zu starten?',
  },
  pages: {
    home: {
      title: 'Faviens',
      description:
        'Beratung für agentische KI in Zürich. KI, autonome Agenten und Data Analytics, in der Cloud oder On-Premises.',
    },
    notFound: {
      title: '404, Faviens',
      heading: '404',
      lead: 'Diese Seite existiert nicht.',
      back: 'Zur Startseite',
    },
    imprint: {
      title: 'Impressum, Faviens',
      description: 'Impressum und Kontaktangaben von Faviens, Zürich.',
      heading: 'Impressum',
      responsibleHeading: 'Verantwortlich für den Inhalt',
      representativeHeading: 'Vertreten durch',
      contactHeading: 'Kontakt',
      country: 'Schweiz',
      registerHeading: 'Handelsregister',
      registerOffice: 'Handelsregisteramt des Kantons Zürich',
      sections: [
        {
          heading: 'Haftung für Inhalte',
          body: [
            'Die Inhalte dieser Website wurden mit Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte wird keine Gewähr übernommen.',
          ],
        },
        {
          heading: 'Haftung für Links',
          body: [
            'Diese Website enthält Verweise auf Websites Dritter. Auf deren Inhalte haben wir keinen Einfluss und übernehmen dafür keine Verantwortung. Für den Inhalt verlinkter Seiten ist stets deren Betreiberin oder Betreiber verantwortlich.',
          ],
        },
        {
          heading: 'Urheberrecht',
          body: [
            'Die auf dieser Website veröffentlichten Inhalte unterliegen dem schweizerischen Urheberrecht. Jede Verwendung ausserhalb der Grenzen des Urheberrechts bedarf der vorherigen schriftlichen Zustimmung.',
          ],
        },
      ],
    },
    privacy: {
      title: 'Datenschutz, Faviens',
      description: 'Datenschutzerklärung von Faviens: keine Cookies, kein Tracking, keine Analyse.',
      heading: 'Datenschutzerklärung',
      lead: 'Diese Website setzt keine Cookies, bindet keine Werbe- oder Analysedienste ein und erstellt keine Nutzungsprofile.',
      updated: 'Stand: August 2026',
      sections: [
        {
          heading: 'Verantwortliche Stelle',
          body: [
            'Verantwortlich für die Bearbeitung von Personendaten auf dieser Website ist die Faviens GmbH, Stäblistrasse 1, 8006 Zürich. Die Kontaktangaben finden Sie im Impressum.',
          ],
        },
        {
          heading: 'Welche Daten bearbeitet werden',
          body: [
            'Beim Aufruf dieser Website werden durch den Hosting-Anbieter technisch notwendige Daten in Server-Logdateien erfasst. Dazu gehören die IP-Adresse des anfragenden Geräts, Datum und Uhrzeit des Zugriffs, die abgerufene Adresse sowie der übermittelte Browsertyp und das Betriebssystem.',
            'Diese Bearbeitung ist für den sicheren und stabilen Betrieb der Website erforderlich. Wir führen diese Daten nicht mit anderen Datenquellen zusammen und werten sie nicht personenbezogen aus.',
          ],
        },
        {
          heading: 'Hosting',
          body: [
            'Diese Website wird als statische Seite über GitHub Pages ausgeliefert, einen Dienst der GitHub, Inc., 88 Colin P Kelly Jr Street, San Francisco, CA 94107, USA. Dabei können Daten in die Vereinigten Staaten übermittelt werden.',
            'Die Schriftarten werden von unserem eigenen Server geladen. Beim Besuch dieser Website wird keine Verbindung zu Google Fonts oder einem anderen externen Anbieter aufgebaut.',
          ],
        },
        {
          heading: 'Cookies, Tracking und Analyse',
          body: [
            'Diese Website verwendet keine Cookies, kein Web-Analyse-Werkzeug, keine Social-Media-Plugins und keine Einbettungen von Drittanbietern. Ein Cookie-Banner ist deshalb nicht erforderlich.',
          ],
        },
        {
          heading: 'Kontaktaufnahme',
          body: [
            'Wenn Sie uns per E-Mail kontaktieren, bearbeiten wir Ihre Angaben ausschliesslich zur Bearbeitung Ihrer Anfrage und für allfällige Anschlussfragen. Wir geben diese Daten nicht ohne Ihre Einwilligung weiter.',
          ],
        },
        {
          heading: 'Ihre Rechte',
          body: [
            'Sie haben im Rahmen des schweizerischen Datenschutzgesetzes und, soweit anwendbar, der DSGVO das Recht auf Auskunft über die zu Ihrer Person bearbeiteten Daten sowie auf deren Berichtigung, Löschung oder Einschränkung der Bearbeitung. Wenden Sie sich dafür an die im Impressum genannte Adresse.',
          ],
        },
        {
          heading: 'Änderungen',
          body: [
            'Wir können diese Datenschutzerklärung jederzeit anpassen, insbesondere wenn sich der Funktionsumfang der Website ändert. Es gilt die jeweils auf dieser Seite veröffentlichte Fassung.',
          ],
        },
      ],
    },
  },
  languageSwitcher: {
    de: 'DE',
    en: 'EN',
    label: 'Sprache wechseln',
  },
  a11y: {
    skipToContent: 'Direkt zum Inhalt',
  },
  nav: {
    strategy: 'KI-Strategie',
    systems: 'KI-Systeme',
    workshops: 'Workshops',
    about: 'Über uns',
    careers: 'Karriere',
    contact: 'Kontakt',
    allServices: 'Alle Leistungen',
  },
  serviceGroups: {
    strategy: {
      label: 'Strategie & Discovery',
      blurb: 'Sparring-Partner für Strategie, Roadmap und interne Initiativen.',
    },
    systems: {
      label: 'Systeme & Anwendungen',
      blurb: 'Delivery-Partner für massgeschneiderte Anwendungen, Pipelines und Produkte.',
    },
    workshops: {
      label: 'Workshops & Weiterbildung',
      blurb: 'Workshop-Partner, der Teams in die richtigen Praktiken einführt.',
    },
  },
  serviceStreams: {
    strategy: 'Strategie',
    agentic: 'Agentisch',
    data: 'Daten & Cloud',
    leadership: 'Führung',
    ai: 'KI & Agenten',
    foundations: 'Daten, Code & Cloud',
  },
  serviceDetail: {
    eyebrow: 'Leistung',
    situation: 'Ausgangslage',
    approach: 'Vorgehen',
    deliverable: 'Ergebnis',
    workstreams: 'Handlungsfelder',
    outcomes: 'Was Sie erhalten',
    frame: 'Rahmen',
    duration: 'Dauer',
    involvement: 'Beteiligte',
    format: 'Format',
    entryPoint: 'Einstieg',
  },
  workshopDetail: {
    eyebrow: 'Workshop · Auf Anfrage',
    takeaways: 'Was Sie mitnehmen',
    audience: 'Für wen',
    format: 'Format',
    agenda: 'Ablauf',
    details: 'Rahmen',
    duration: 'Dauer',
    languages: 'Sprachen',
    locations: 'Orte',
    booking: 'Buchung',
    prerequisites: 'Vorwissen',
  },
  servicePages: {
    services: {
      title: 'Leistungen, Faviens',
      heading: 'Leistungen',
      lead: 'Agentische KI-Lösungen, End-to-End-Delivery und Workshops.',
    },
    about: {
      title: 'Über uns, Faviens',
      heading: 'Über uns',
      lead: 'Schweizer Beratung für KI · agentische KI · Analytics · Daten.',
      approachHeading: 'Ansatz',
      approach: [
        'Faviens ist eine Boutique-KI-Firma in Zürich, spezialisiert auf agentische Systeme. Unsere Kunden sitzen in der ganzen Schweiz. Wir lösen die Probleme, die ihr Geschäft ausbremsen.',
        'Wir bauen agentische KI-Anwendungen, die ausreizen, was heute technisch möglich ist, und betreiben sie in Produktion, in der Cloud oder on premises. Unser eigenes Betriebsmodell ist in jedem Teil des Unternehmens durchgängig agentisch.',
        'Faviens wird von einem Team geführt, das auf der einen Seite ein Jahrzehnt in ML und KI mitbringt. Auf der anderen stehen zwei Jahrzehnte Erfahrung in Business und Business Development, bei einigen der weltgrössten Tech-Konzerne und in schnell wachsenden Scale-ups.',
        'Wir arbeiten in drei Modi: als Delivery-Partner für massgeschneiderte Anwendungen, Pipelines und Produkte, als Sparring-Partner für Strategie, Roadmap und interne Initiativen, oder als Workshop-Partner, der Teams in die richtigen Praktiken einführt.',
      ],
      valuesHeading: 'Werte',
      values: [
        { title: 'Resultatorientiert', body: 'Wirkung über Aufwand. Was zählt, ist das Ergebnis.' },
        { title: 'Pragmatisch', body: 'Das Einfachste, das funktioniert.' },
        { title: 'Robust', body: 'Produktionsreif, ab dem ersten Tag.' },
        { title: 'Transparent', body: 'Klare Roadmap, klare Kommunikation, klare Übergabe.' },
      ],
      disciplinesHeading: 'Disziplinen',
      disciplinesLead:
        'Die Fachgebiete, aus denen wir ein Mandat besetzen. Welche davon ein Projekt braucht, klären wir im ersten Gespräch.',
    },
    contact: {
      title: 'Kontakt, Faviens',
      heading: 'Kontakt',
      lead: 'Ihr direkter Draht zu Faviens, für ein erstes Gespräch oder eine konkrete Anfrage.',
      personHeading: 'Ihr Ansprechpartner',
      emailLabel: 'E-Mail',
      locationLabel: 'Standort',
      backgroundLabel: 'Hintergrund',
      portraitLabel: 'Porträt',
    },
    careers: {
      title: 'Karriere, Faviens',
      heading: 'Karriere',
      lead: 'Offene Stellen und die Fachprofile, auf denen unsere Leistungen aufbauen. Initiativbewerbungen sind willkommen.',
      openRolesHeading: 'Offene Stellen',
      viewRole: 'Stelle ansehen',
      profilesHeading: 'Profile',
      profilesLead:
        'Keine ausgeschriebenen Stellen, sondern die Fachrichtungen, in denen wir arbeiten. Eine Initiativbewerbung auf eines dieser Profile ist jederzeit willkommen.',
      expectationsHeading: 'Was wir erwarten',
      applyLabel: 'Bewerbung',
      apply: 'Schreiben Sie uns, mit dem Profil, das zu Ihnen passt.',
    },
  },
  jobPage: {
    eyebrow: 'Offene Stelle',
    companyHeading: 'Über Faviens',
    roleHeading: 'Die Rolle',
    responsibilitiesHeading: 'Aufgaben',
    qualificationsHeading: 'Qualifikationen',
    detailsHeading: 'Rahmen',
    locationLabel: 'Ort',
    employmentLabel: 'Pensum',
    workModeLabel: 'Arbeitsmodell',
    languageLabel: 'Arbeitssprache',
    applyHeading: 'Bewerbung',
    applyBody: 'Bewerbungen mit Lebenslauf an die Adresse unten.',
    backLabel: 'Alle offenen Stellen',
  },
  ctaHeadline: 'Sprechen wir über Ihr Projekt.',
};
