---
title: Enterprise-RAG-Deployment
track: rag
bluf: 'RAG im Enterprise-Massstab: alle Dokumente auf Knopfdruck.'
order: 7
lang: de
topics:
  - Ingestion-Pipelines
  - Geerdete Antworten mit Zitaten
  - Zugriffskontrolle
  - Qualitätsevaluierung
situation: |-
  Der Wert liegt selten im Finden, sondern im Vertrauen. Ein System, das plausibel klingende Antworten ohne belastbare Quelle liefert, wird nach zwei Wochen nicht mehr benutzt. Eines, das Dokumente ausgibt, die der Fragende nicht sehen darf, wird abgeschaltet.
approach:
  - title: Bestand und Zugriffsmodell
    description: Wir sichten, welche Bestände tatsächlich erschlossen werden sollen, und übernehmen die bestehenden Berechtigungen, statt sie neu zu erfinden.
    deliverable: Erschliessungsplan mit übernommenem Berechtigungsmodell
  - title: Ingestion und Aufbereitung
    description: Verarbeitung von PDF, Scan, Office-Dokument und Wissensartefakt, mit Zerlegungsstrategien, die zu Ihren Inhalten passen statt zu einem Standardrezept.
    deliverable: Produktive Ingestion-Strecke über die relevanten Bestände
  - title: Antwortqualität und Belege
    description: Antworten mit nachprüfbarer Quelle, Guardrails gegen freie Erfindung und eine ehrliche Antwort, wenn der Bestand nichts hergibt.
    deliverable: Geerdete Antworten mit Zitaten und Halluzinations-Guardrails
  - title: Evaluation und Betrieb
    description: Eine Testmenge aus echten Fragen Ihrer Fachbereiche, gegen die jede Änderung geprüft wird, dazu Überwachung im laufenden Betrieb.
    deliverable: Evaluations-Set, Qualitätskennzahlen und Betriebsüberwachung
outcomes:
  - Durchsuchbarer und zitierbarer Wissensbestand über Formate hinweg
  - Antworten mit Quellenangabe statt plausibler Behauptungen
  - Zugriffskontrolle, die Ihre bestehenden Berechtigungen respektiert
  - Evaluations-Set aus echten Fragen und laufende Qualitätsmessung
  - Betrieb in Ihrer Umgebung, Cloud oder On-Premises
duration: Abhängig von Bestandsgrösse und Formatvielfalt. Wir starten mit einem abgegrenzten Bestand.
involvement:
  - Fachbereiche als Quelle echter Fragen und für die Abnahme
  - Dokumenten- und Systemverantwortliche für Bestände und Berechtigungen
  - Datenschutz und Sicherheit für Zugriff und Protokollierung
format:
  - Start mit einem abgegrenzten Bestand, danach schrittweise Ausweitung
  - Qualität wird gemessen, nicht behauptet
  - Betrieb in Ihrer Umgebung, Cloud oder On-Premises
entryPoint: Ein Gespräch über Bestände, Formate und Berechtigungslage.
faq:
  - q: 'Bleiben bestehende Berechtigungen erhalten?'
    a: 'Ja. Berechtigungen greifen beim Abruf, nicht erst in der Anzeige. Niemand erhält über die Suche Zugang zu Dokumenten, die ihm ohne sie verschlossen wären.'
  - q: 'Welche Dokumentformate lassen sich anbinden?'
    a: 'Die üblichen Office- und PDF-Bestände, gescannte Dokumente über Texterkennung, dazu Wikis und Ticketsysteme. Die Formatvielfalt wird zu Beginn erhoben, weil sie den Aufwand bestimmt.'
---

Jedes PDF, jedes Dokument, jeder Scan und jedes Wissensartefakt Ihrer Organisation wird durchsuchbar und zitierbar. Wir bauen Retrieval-Augmented-Generation-Systeme für hohe Antwort-Treue: Chunking-Strategien für Ihre Inhalte, geerdete Zitate, Halluzinations-Guardrails und Zugriffskontrolle.
