// Skill profiles behind the services we sell. Kept as data so the German and
// English careers pages cannot drift apart in structure.

export interface CareerProfile {
  title: string;
  summary: string;
  skills: string[];
}

export interface Expectation {
  title: string;
  description: string;
}

export const PROFILES_DE: readonly CareerProfile[] = [
  {
    title: 'AI und Agent Engineering',
    summary:
      'Agentische Systeme, die im Betrieb halten, nicht nur in der Demo. Das Profil hinter individuellen KI-Agenten, tiefen Agentensystemen und Enterprise-RAG.',
    skills: [
      'Agenten-Architektur, Harness-Design und Orchestrierung',
      'Evaluation und Guardrails für nicht-deterministische Systeme',
      'Retrieval, Chunking-Strategien und geerdete Antworten',
      'Modellauswahl mit Blick auf Kosten und Latenz',
      'Python, TypeScript, saubere Testpraxis',
    ],
  },
  {
    title: 'Data Engineering',
    summary:
      'Belastbare Datenstrecken von der Quelle bis zur Auslieferung. Das Profil hinter Daten-Apps, Pipelines und Datenprodukten.',
    skills: [
      'Pipelines und Orchestrierung, etwa mit dbt oder Airflow',
      'Datenmodellierung für Warehouses und Lakehouses',
      'Datenqualität, Tests und Observability',
      'Batch und Streaming, Anbindung an Quellsysteme',
      'SQL und Python auf Produktionsniveau',
    ],
  },
  {
    title: 'Data Science und Analytics',
    summary:
      'Aus einer unscharfen Geschäftsfrage eine beantwortbare machen. Das Profil hinter Use-Case-Findung und analytischen Datenprodukten.',
    skills: [
      'Fragestellung schärfen, bevor modelliert wird',
      'Statistik, Experimente und Prognosen',
      'Wirkungs- und Machbarkeitsschätzung für Use Cases',
      'Ergebnisse, die Fachbereiche verstehen und benutzen',
      'Python-Stack und Visualisierung',
    ],
  },
  {
    title: 'Cloud und Platform Engineering',
    summary:
      'Die Grundlage, auf der vieles andere produktiv geht. Das Profil hinter Zielarchitektur, Betrieb und On-Premises-Setups.',
    skills: [
      'Infrastructure as Code, insbesondere Terraform',
      'GCP, Azure oder AWS, dazu On-Premises-Betrieb',
      'CI/CD, Observability und Kostenkontrolle',
      'Identitäten, Zugriff, Netzwerk und Zonierung',
      'Setups, die einer Revision standhalten',
    ],
  },
];

export const EXPECTATIONS_DE: readonly Expectation[] = [
  {
    title: 'Produktionsreife',
    description:
      'Der Unterschied zwischen einem Prototyp und etwas, das ein Team ein Jahr später noch betreibt, ist der eigentliche Beruf.',
  },
  {
    title: 'Direkter Kundenkontakt',
    description:
      'Sie sprechen mit Fachbereichen und IT, halten auch mal einen Workshop und schreiben verständlich.',
  },
  {
    title: 'Deutsch und Englisch',
    description: 'Projektsprache ist beides. Schweizer Kundschaft, oft englischsprachige Technik.',
  },
  {
    title: 'Urteilsvermögen',
    description:
      'Erkennen, wann KI die richtige Antwort ist und wann eine Abfrage, ein Skript oder ein Gespräch genügt.',
  },
];

export const PROFILES_EN: readonly CareerProfile[] = [
  {
    title: 'AI and agent engineering',
    summary:
      'Agentic systems that hold up in operation, not only in a demo. The profile behind custom AI agents, deep agentic systems, and enterprise RAG.',
    skills: [
      'Agent architecture, harness design, and orchestration',
      'Evaluation and guardrails for non-deterministic systems',
      'Retrieval, chunking strategies, and grounded answers',
      'Model selection with cost and latency in mind',
      'Python, TypeScript, and a real testing habit',
    ],
  },
  {
    title: 'Data engineering',
    summary:
      'Dependable data paths from source through to delivery. The profile behind data apps, pipelines, and data products.',
    skills: [
      'Pipelines and orchestration, for example dbt or Airflow',
      'Data modelling for warehouses and lakehouses',
      'Data quality, testing, and observability',
      'Batch and streaming, connecting to source systems',
      'SQL and Python at production quality',
    ],
  },
  {
    title: 'Data science and analytics',
    summary:
      'Turning a vague business question into an answerable one. The profile behind use-case discovery and analytical data products.',
    skills: [
      'Sharpening the question before reaching for a model',
      'Statistics, experiments, and forecasting',
      'Impact and feasibility sizing for candidate use cases',
      'Results that business units understand and act on',
      'The Python stack and visualisation',
    ],
  },
  {
    title: 'Cloud and platform engineering',
    summary:
      'The foundation much of the rest reaches production on. The profile behind target architecture, operations, and on-premises setups.',
    skills: [
      'Infrastructure as code, Terraform in particular',
      'GCP, Azure, or AWS, plus on-premises operation',
      'CI/CD, observability, and cost control',
      'Identity, access, networking, and zoning',
      'Setups that survive an audit',
    ],
  },
];

export const EXPECTATIONS_EN: readonly Expectation[] = [
  {
    title: 'Production readiness',
    description:
      'The gap between a prototype and something a team still operates a year later is the actual job.',
  },
  {
    title: 'Direct client contact',
    description:
      'You talk to business units and IT, run the occasional workshop, and write clearly.',
  },
  {
    title: 'German and English',
    description: 'Both are project languages. Swiss clients, often English-language technology.',
  },
  {
    title: 'Judgement',
    description:
      'Knowing when AI is the right answer and when a query, a script, or a conversation would do.',
  },
];
