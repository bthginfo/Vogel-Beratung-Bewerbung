export type AssignmentAnswer = {
  number: string
  slug: string
  title: string
  question: string
  position: string
  rationale: string
  price: string
}

export const assignmentAnswers: AssignmentAnswer[] = [
  {
    number: '01',
    slug: 'fleiss-oder-talent',
    title: 'Fleiß oder Talent',
    question: 'Fleiß oder Talent — was entscheidet am Ende über beruflichen Erfolg?',
    position: 'Fleiß entscheidet am Ende über beruflichen Erfolg.',
    rationale: 'Als ich bei Achtzig20 begann, kannte ich mich in Fotografie aus, aber nicht mit Video, Ton oder Multicam-Setups. Für einen Podcast eines Bundesligavereins habe ich mir Equipment, Aufbau, Ablauf, Backups und Schnitt systematisch erarbeitet. Nach diesem Muster aus Recherche, Test und Verfeinerung entstanden später auch Imagefilme und weitere Podcast-Formate. In drei Jahren wuchs daraus ein Content-Bereich: von mir als einziger Ansprechperson zu einem Team von mehr als zwölf Content Creators.',
    price: 'Diese Haltung kostet in Lernphasen Zeit und macht Projekte zunächst weniger planbar. Für mich hieß das oft, mich auch außerhalb des Tagesgeschäfts in neue Themen einzuarbeiten.',
  },
  {
    number: '02',
    slug: 'der-teurere-fehler',
    title: 'Der teurere Fehler',
    question: 'Ein falscher Hire oder ein verpasstes Talent — welcher Fehler ist teurer?',
    position: 'Ein falscher Hire ist teurer.',
    rationale: 'In meiner Agenturzeit kam ein Kollege ohne die nötigen fachlichen Voraussetzungen über eine persönliche Empfehlung ins Medienteam. Weil er weder Videoschnitt lernen noch Feedback annehmen wollte, erzeugte jeder Einsatz mehr Nacharbeit als Nutzen. Unprofessionelle Diskussionen waren bei Kundenterminen sichtbar; intern korrigierten wir regelmäßig Schnitte und Bilder. Ein verpasstes Talent bleibt eine ungenutzte Chance; dieser Hire band dagegen dauerhaft Kapazität und beschädigte Teamklima und Vertrauen.',
    price: 'Meine klare Position kann Auswahlprozesse vorsichtiger machen. Gleichzeitig kostet ein zu spätes Eingreifen Arbeitsmoral, Produktivität und Vertrauen – intern wie beim Kunden.',
  },
  {
    number: '03',
    slug: 'sechs-monate-unter-erwartung',
    title: 'Sechs Monate unter Erwartung',
    question: 'Ein Mitarbeiter bleibt sechs Monate nach Einstellung deutlich unter den Erwartungen: kündigen oder weiterentwickeln?',
    position: 'Ich würde den Mitarbeiter kündigen.',
    rationale: 'Nach sechs Monaten sollte erkennbar sein, ob jemand die Rolle grundsätzlich erfüllen kann. Wenn Einarbeitung, klare Erwartungen, Feedback und Unterstützung keine ausreichende Entwicklung ausgelöst haben, bindet weiteres Festhalten Kapazitäten, die in Kundenprojekten fehlen. Gleichzeitig übernimmt das Team dauerhaft Mehrarbeit und Standards beginnen zu verrutschen. Eine saubere Trennung ist dann fairer als eine Bewährungsphase ohne glaubwürdige Perspektive.',
    price: 'Diese Haltung verlangt frühe Klarheit, konsequente Führung und ein unangenehmes Gespräch. Sie birgt auch das Risiko, Entwicklungspotenzial zu früh abzuschreiben.',
  },
  {
    number: '04',
    slug: 'naehe-mit-haltung',
    title: 'Nähe mit Haltung',
    question: 'Duzen oder Siezen gegenüber Mandanten?',
    position: 'Mandanten würde ich siezen.',
    rationale: 'Für mich schafft das Sie zunächst eine klare professionelle Rolle. Bei einem langjährigen Kunden aus der Sportwagenbranche wurde aus dem Sie irgendwann ein Du; danach wurden Feedback und Preisgespräche persönlicher und weniger klar auf das Ergebnis bezogen. Auch Abstimmungen wanderten zunehmend in Abende und Wochenenden, bis Anrufe am Sonntag normal wurden. Seitdem nutze ich das Sie bewusst, um Nähe entstehen zu lassen, ohne die Grenze zwischen Verbindlichkeit und Verfügbarkeit aufzulösen.',
    price: 'Der Kontakt kann anfangs distanzierter wirken. Dafür muss ich Vertrauen stärker über Vorbereitung, Haltung und die Qualität meiner Arbeit aufbauen.',
  },
  {
    number: '05',
    slug: 'ueberstunden',
    title: 'Überstunden',
    question: 'Überstunden sind eher: ein Zeichen von Engagement oder ein Zeichen von schlechter Organisation?',
    position: 'Überstunden sind ein Zeichen von Engagement.',
    rationale: 'In der Agentur habe ich saisonale Phasen erlebt, in denen viele Drehs und Projekte parallel liefen und ein striktes Ende nach Plan den Projekterfolg verzögert hätte. In meiner Selbstständigkeit reichen vierzig Stunden meist für das Tagesgeschäft; Markenaufbau, neue Geschäftsbereiche und persönliche Weiterentwicklung entstehen oft zusätzlich. Deshalb sind Überstunden für mich in entscheidenden Phasen eine bewusste Investition in Qualität und Wachstum. Sie dürfen jedoch kein Ersatz dafür werden, Kapazitäts- oder Strukturprobleme dauerhaft zu lösen.',
    price: 'Ich zahle dafür mit höherer Belastung und einer unschärferen Grenze zwischen Arbeit und Freizeit. Das Unternehmen riskiert zugleich, sich auf diesen Einsatz zu verlassen, statt strukturelle Lücken zu schließen.',
  },
  {
    number: '06',
    slug: 'vier-tage',
    title: 'Vier Tage',
    question: 'Vier-Tage-Woche bei vollem Gehalt: Würdest du sie als Unternehmer in einer Kanzlei einführen?',
    position: 'Nein, ich würde die Vier-Tage-Woche bei vollem Gehalt nicht einführen.',
    rationale: 'Als Unternehmer einer Kanzlei würde ich die Fünf-Tage-Woche beibehalten. Die Verteilung auf fünf Tage schafft aus meiner Sicht mehr Planbarkeit, verlässlichere Erreichbarkeit und Puffer für saisonale Spitzen oder parallele Mandate. Tagesgeschäft, Mandantenkontakt und strategische Themen lassen sich so über die Woche verteilen, ohne jeden einzelnen Arbeitstag maximal zu verdichten. Gerade in anspruchsvoller Wissensarbeit halte ich Konzentration und Qualität nicht für beliebig komprimierbar.',
    price: 'Damit verzichte ich auf einen starken Vorteil im Arbeitgebermarketing und nehme Konflikte mit Mitarbeitenden in Kauf, die sich modernere Arbeitszeitmodelle wünschen. Außerdem muss die Organisation Erholung, Motivation und Leistungsfähigkeit auf andere Weise sichern.',
  },
  {
    number: '07',
    slug: 'urlaub',
    title: 'Urlaub',
    question: 'Wie viele Urlaubstage pro Jahr sind ideal?',
    position: '30.',
    rationale: 'Beratungs- und Projektarbeit bringt hohe Verantwortung, wechselnde Prioritäten und intensive Phasen mit sich. Dreißig Urlaubstage geben genug Raum für längere Erholung und kürzere Auszeiten, ohne die Verlässlichkeit im Projektgeschäft grundsätzlich zu gefährden. Nach arbeitsreichen Phasen braucht es für mich echten Abstand, nicht nur einzelne freie Tage. So verbinden dreißig Tage langfristige Leistungsfähigkeit mit einem realistisch planbaren Standard.',
    price: 'Arbeit verdichtet sich vor und nach Abwesenheiten stärker. Für das Unternehmen werden Vertretung und Kapazitätsplanung anspruchsvoller.',
  },
  {
    number: '08',
    slug: 'unternehmensgroesse',
    title: 'Unternehmensgröße',
    question: 'Was ist die ideale Unternehmensgröße zum Arbeiten?',
    position: '60.',
    rationale: 'Ich habe erlebt, wie sich eine Agentur von ungefähr 60 auf rund 250 Mitarbeitende verändert hat. Bei 60 waren Prozesse noch überschaubar, Ansprechpartner persönlich bekannt und der Beitrag jedes Einzelnen im Ergebnis sichtbar. Mit dem Wachstum nahmen interne Abstimmungen und Regulatorik deutlich mehr Raum ein, während die Nähe zu Entscheidungen und Tagesgeschäft abnahm. Sechzig Menschen sind für mich deshalb groß genug für unterschiedliche Kompetenzen und relevante Projekte, aber klein genug für Verantwortung und ein unternehmerisches Gefühl.',
    price: 'Leistungseinbrüche Einzelner fallen stärker ins Gewicht und weniger Aufträge können parallel abgefedert werden. Damit sind Umsatz- und Wachstumsmöglichkeiten begrenzter als in einer deutlich größeren Organisation.',
  },
]

export const aiDisclosure = {
  number: '09',
  title: 'Transparenz',
  question: 'Wo und wie habe ich AI eingesetzt?',
  answer: 'Ich habe AI genutzt, um meine selbst formulierten Antworten sprachlich zu glätten und zu verdichten, nicht aber inhaltlich zu verändern. Außerdem kam AI bei der grafischen und technischen Aufbereitung als Web-Storyline und PDF zum Einsatz.',
}

export const ASSIGNMENT_CHARACTER_LIMIT = 6000

export function getAssignmentAnswerCharacterCount(): number {
  const answerCharacters = assignmentAnswers.reduce(
    (total, answer) => total + answer.position.length + answer.rationale.length + answer.price.length,
    0,
  )

  return answerCharacters + aiDisclosure.answer.length
}
