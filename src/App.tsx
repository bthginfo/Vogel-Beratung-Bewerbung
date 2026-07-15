import { useEffect, useRef, useState } from 'react'

const nav = [
  ['Jetzt', 'jetzt'], ['Arbeit', 'arbeit'], ['Formate', 'formate'],
  ['System', 'system'], ['90 Tage', 'plan'], ['Profil', 'profil'],
]

function Header() {
  return <header className="site-header">
    <a className="monogram" href="/#top" aria-label="Zur Startseite">MS<span>×</span>V</a>
    <nav aria-label="Kapitel"><div className="nav-scroll">
      {nav.map(([label, id], i) => <a key={id} href={`/#${id}`}><small>0{i + 1}</small>{label}</a>)}
    </div></nav>
    <a className="header-contact" href="mailto:servus@marioschub.com">Kontakt ↗</a>
  </header>
}

function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [time, setTime] = useState('00:00:00')
  const reduce = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const v = videoRef.current
    if (!v || reduce) return
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [reduce])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (v.paused) v.play().then(() => setPlaying(true))
    else { v.pause(); setPlaying(false) }
  }

  const updateTime = () => {
    const seconds = videoRef.current?.currentTime ?? 0
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0')
    const secs = Math.floor(seconds % 60).toString().padStart(2, '0')
    const frames = Math.floor((seconds % 1) * 25).toString().padStart(2, '0')
    setTime(`${mins}:${secs}:${frames}`)
  }

  return <div className="hero-media">
    <video ref={videoRef} muted loop playsInline preload="metadata" poster="/media/griesmueller-poster.jpg" onTimeUpdate={updateTime} aria-label="Ausschnitt aus einem WYLDWORKS Markenfilm für die Stadtbrauerei Griesmüller">
      <source src="/media/griesmueller.mp4" type="video/mp4" />
    </video>
    <div className="video-meta"><span>WYLDWORKS / BRAND FILM</span><span>{time}</span></div>
    <button className="play" type="button" onClick={toggle} aria-label={playing ? 'Video pausieren' : 'Video abspielen'}>{playing ? 'Ⅱ' : '▶'}<span>{playing ? 'Pause' : 'Play'}</span></button>
    <div className={`playhead ${playing ? 'running' : ''}`} aria-hidden="true"><i /></div>
  </div>
}

function Home() {
  return <>
    <a className="skip" href="#content">Zum Inhalt springen</a>
    <Header />
    <main id="content">
      <section className="hero section" id="top">
        <div className="hero-kicker reveal"><span>Bewerbung</span><span>Videograf & Bewegtbild Producer</span><span>Vogel Beratung</span></div>
        <h1 className="reveal delay-1">Serienfähig.<br /><em>Ohne serienmäßig</em><br />auszusehen.</h1>
        <div className="hero-grid reveal delay-2">
          <div className="hero-intro">
            <p>Servus Vogel. Ich bin Mario Schubert – Bildgestalter, Produzent und UX-Denker aus Ingolstadt.</p>
            <p>Ich verbinde Idee, Kamera, Post und System. Damit aus guten Einzelstücken eine Bildsprache wird.</p>
            <div className="hero-actions"><a className="button mint" href="#arbeit">Arbeit ansehen ↓</a><a className="text-link" href="mailto:servus@marioschub.com">Direkt sprechen ↗</a></div>
          </div>
          <HeroVideo />
          <aside className="slate" aria-label="Bewerbungsdetails">
            <span>Applicant slate</span><strong>Mario<br />Schubert</strong>
            <dl><div><dt>Base</dt><dd>Ingolstadt → München</dd></div><div><dt>Focus</dt><dd>Concept / Camera / Cut / System</dd></div><div><dt>Date</dt><dd>07 / 2026</dd></div></dl>
          </aside>
        </div>
      </section>

      <section className="section now" id="jetzt">
        <div className="section-index"><span>01</span><p>Warum jetzt</p></div>
        <div className="now-copy"><h2>Ein Team.<br />Ein Anspruch.<br /><em>Eine Sprache, die wächst.</em></h2>
          <div className="prose"><p>Selbstständigkeit hat mir beigebracht, alles zu tragen: Strategie, Akquise, Produktion und den letzten Export. Das schafft Ownership. Es macht aber auch deutlich, was mir als Nächstes wichtig ist.</p><p>Ich möchte nicht nach jedem letzten Cut weiterziehen, sondern die nächsten hundert Filme besser machen als die ersten zehn. Mit einem Team, das Gestaltung ernst nimmt, offen diskutiert und Standards nicht als Einschränkung versteht, sondern als Basis für mehr gute Arbeit.</p><p>Genau darin sehe ich bei Vogel die spannende Aufgabe: Bewegtbild nicht nur produzieren, sondern von Anfang an so aufbauen, dass Qualität und Takt zusammenpassen.</p></div>
        </div>
        <blockquote>„Basis Ingolstadt. München ist für mich kein Remote-Label, sondern ein Arbeitsort, an dem Ideen im direkten Austausch besser werden.“</blockquote>
      </section>

      <section className="work section dark" id="arbeit">
        <div className="section-index light"><span>02</span><p>Ausgewählte Arbeit</p></div>
        <div className="work-heading"><p>Mittelstand, Menschen, Präzision</p><h2>Arbeit, die nah genug rangeht.</h2></div>
        <article className="case case-film">
          <div className="case-visual"><video muted loop playsInline preload="none" poster="/media/griesmueller-poster.jpg"><source src="/media/griesmueller.mp4" type="video/mp4" /></video><span className="frame-mark">01 / 03</span></div>
          <div className="case-copy"><span>Markenfilm / Mittelstand</span><h3>Griesmüller<br />Stadtbrauerei</h3><p>Ein Film über das, was eine lokale Marke trägt: Menschen, Handgriffe und ein Ort mit Haltung.</p><strong>WYLDWORKS Produktion</strong></div>
        </article>
        <div className="case-pair">
          <article className="case"><div className="case-visual portrait"><img src="/media/feig-doka.jpg" alt="Gerüstbauer bei der Montage auf der Bauma" /><span className="frame-mark">02 / 03</span></div><div className="case-copy"><span>Event & Produkt</span><h3>Feig Gerüste × Doka</h3><p>Arbeit in Bewegung, verdichtet auf Hände, Material und den Moment.</p><strong>Fotografie · Bildauswahl · Postproduktion</strong></div></article>
          <article className="case offset"><div className="case-visual"><img src="/media/maschinenbau.jpg" alt="Schwere Spezialmaschine von Ludwig Bauch auf einem Industrieareal" /><span className="frame-mark">03 / 03</span></div><div className="case-copy"><span>Industrie & Präzision</span><h3>Ludwig Bauch Maschinentechnik</h3><p>Technik bekommt Maßstab, wenn Konstruktion und Umgebung miteinander sprechen.</p><strong>Konzept · Fotografie · Postproduktion</strong></div></article>
        </div>
        <div className="portfolio-links"><a href="https://www.wyldworks.de/" target="_blank" rel="noreferrer">Mehr auf WYLDWORKS ↗</a><a href="https://marioschub.com/" target="_blank" rel="noreferrer">marioschub.com ↗</a></div>
      </section>

      <section className="formats section" id="formate">
        <div className="section-index"><span>03</span><p>Zwei Formatideen</p></div>
        <p className="eyebrow">Noch keine Vogel-Formate. Zwei konkrete Startpunkte.</p>
        <div className="format-grid">
          <article className="format salmon"><div className="format-no">A—01</div><h2>WAS<br />TRÄGT.</h2><p className="serif">Ein dokumentarisches Porträt über die Entscheidung, die ein Familienunternehmen geprägt hat.</p><dl><div><dt>Länge</dt><dd>6–10 Minuten</dd></div><div><dt>Kern</dt><dd>Eine Person. Ein Prozess. Eine Entscheidung.</dd></div><div><dt>Ausspielung</dt><dd>Hero Film · 3 Vertical Chapters · Still Set · Audio · Quotes · Archiv</dd></div></dl><p className="note">Keine chronologische Firmengeschichte. Eine echte Spannung, erzählt an einem konkreten Detail.</p></article>
          <article className="format green"><div className="format-no">B—01 / weekly</div><h2>EINE GUTE<br />FRAGE.</h2><p className="serif">Eine reale Frage aus dem unternehmerischen Alltag. Präzise beantwortet von jemandem, der ihn kennt.</p><dl><div><dt>Länge</dt><dd>45–75 Sekunden</dd></div><div><dt>Rhythmus</dt><dd>Eine klare Dramaturgie, jede Woche ein anderes Thema</dd></div><div><dt>Ausspielung</dt><dd>LinkedIn · Instagram · Shorts · Editorial</dd></div></dl><p className="note">Einfach wiederholbar, aber nie austauschbar – weil die Frage und die Person im Zentrum bleiben.</p></article>
        </div>
      </section>

      <section className="system section" id="system">
        <div className="section-index light"><span>04</span><p>Motion System</p></div>
        <div className="system-head"><h2>Eine Produktion.<br /><em>Viele gute Gründe, sie zu finden.</em></h2><p>Geschmack entscheidet im Bild.<br />Struktur entscheidet, ob es jede Woche gelingt.</p></div>
        <ol className="pipeline">
          {['Zuhören', 'Die Frage finden', 'Treatment / Shotlist', 'Lean Shoot', 'Edit / Grade / Sound', 'Formatversionen', 'Archiv / Lernen'].map((item, i) => <li key={item}><small>0{i + 1}</small><span>{item}</span></li>)}
        </ol>
        <div className="outputs"><div className="source"><span>1 ×</span><strong>guter Drehtag</strong></div><div className="output-list"><span>Long-form</span><span>3–5 Clips</span><span>Still Set</span><span>Audio / Podcast</span><span>Pull Quotes</span><span>B-Roll Library</span></div></div>
        <div className="ai-note"><span>AI, wo sie hilft</span><p>Research und Moodboards. Skript- und Storyboard-Entwürfe. Transkription, Untertitel und Rohorganisation. Repetitive Asset- und Admin-Abläufe.</p><strong>Die redaktionelle Entscheidung bleibt menschlich.</strong></div>
      </section>

      <section className="plan section" id="plan">
        <div className="section-index"><span>05</span><p>Die ersten 90 Tage</p></div>
        <div className="plan-head"><h2>Erst verstehen.<br />Dann wiederholen.<br /><em>Gemeinsam besser werden.</em></h2><p>Ein Vorschlag für den Einstieg – nicht als fertige Antwort, sondern als belastbarer Gesprächsanfang.</p></div>
        <div className="days">
          <article><span>01—30</span><h3>Sehen & setzen</h3><p>Brand- und Motion-Audit, Praktiker kennenlernen, Technik- und Raumbedarf klären, Datei- und Exportlogik definieren, erste schlanke Piloten.</p></article>
          <article><span>31—60</span><h3>Bauen & wiederholen</h3><p>Erste Formatvorlagen, erstes Mandantenporträt, gemeinsames Cadence Board, wiederverwendbare Pre-/Post-Checklisten und Asset-Struktur.</p></article>
          <article><span>61—90</span><h3>Stabilisieren & lernen</h3><p>Verlässlicher Rhythmus, Review-Loop mit Brand & Content, Production Playbook v1 und ein Muster für Event-Repurposing.</p></article>
        </div>
      </section>

      <section className="proof section" id="profil">
        <div className="section-index"><span>06</span><p>Was ich mitbringe</p></div>
        <div className="proof-grid">
          <div className="proof-title"><h2>Bildgefühl.<br /><em>Und der Wille,</em><br />es verlässlich<br />zu machen.</h2><a className="button dark-button" href="/cv">Lebenslauf ansehen →</a></div>
          <div className="proof-list">
            <div><strong>30+</strong><p>Unternehmenskunden seit 03/2023 – mit voller kreativer und kaufmännischer Verantwortung.</p></div>
            <div><strong>2→10+</strong><p>Kreativteam bei Achtzig20 mit aufgebaut und mitgeführt.</p></div>
            <div><strong>25+</strong><p>Workshops moderiert und Stakeholder zu gemeinsamen Entscheidungen geführt.</p></div>
            <div><strong>≈100</strong><p>UX-Studierende in drei Semestern an der TH Ingolstadt begleitet.</p></div>
          </div>
        </div>
        <div className="discipline-strip"><span>Concept</span><span>Camera</span><span>Premiere Pro</span><span>After Effects</span><span>Final Cut</span><span>Photography</span><span>Content Strategy</span><span>AI Workflows</span></div>
      </section>

      <section className="contact section" id="kontakt">
        <div className="contact-image"><img src="/media/mario-contact.jpg" alt="Porträt von Mario Schubert am Fenster" /></div>
        <div className="contact-copy"><span>Mario Schubert / Ingolstadt</span><h2>Wenn ihr jemanden sucht, der beim Bild anfängt und beim System nicht aufhört: <em>Lasst uns reden.</em></h2><div className="contact-links"><a href="mailto:servus@marioschub.com">servus@marioschub.com ↗</a><a href="tel:+4915155338029">+49 1515 5338029 ↗</a></div><div className="small-links"><a href="https://www.wyldworks.de/" target="_blank" rel="noreferrer">WYLDWORKS</a><a href="https://marioschub.com/" target="_blank" rel="noreferrer">marioschub.com</a><a href="/cv">CV / Print</a></div></div>
      </section>
    </main>
    <footer><span>Mario Schubert × Vogel Beratung</span><span>Application field guide / 07.2026</span><a href="#top">Nach oben ↑</a></footer>
  </>
}

const experience = [
  ['03/2023—heute', 'Selbstständig · WYLDWORKS / marioschub.com', 'Content-Strategie, End-to-End Foto- und Videoproduktion, digitale Produkte und volle Kundenverantwortung für 30+ Unternehmen.'],
  ['seit 2023', 'Lehrbeauftragter · TH Ingolstadt', 'UX und Digital Photography. Drei Semester, rund 100 Studierende.'],
  ['06/2023—02/2024', 'PMO Coordinator · in-tech', 'Automotive-Projekt: Prozesse, KPIs, Stakeholder-Abstimmung und zuverlässige Delivery.'],
  ['04/2022—05/2023', 'Management Consultant · Achtzig20', 'Strategie, Workshops, digitale Produkte und Kundenberatung.'],
  ['02/2020—04/2022', 'Junior Consultant & Co-Lead Media · Achtzig20', 'Kreativteam von 2 auf 10+ mit aufgebaut; Medienproduktion, Führung und Kundenarbeit.'],
]

function CV() {
  return <main className="cv-page">
    <div className="cv-controls"><a href="/">← Zur Bewerbung</a><button onClick={() => window.print()}>Als PDF sichern / drucken</button></div>
    <header className="cv-header"><div><span>Curriculum Vitae / 07.2026</span><h1>Mario<br />Schubert</h1><p>Bildgestalter · Produzent · UX-Denker</p></div><img src="/media/mario-contact.jpg" alt="Mario Schubert" /></header>
    <section className="cv-intro"><p>Ich verbinde visuelles Handwerk mit strategischem Denken und der Struktur, die aus einem guten Einzelstück eine verlässliche Serie macht.</p><dl><div><dt>Standort</dt><dd>Ingolstadt</dd></div><div><dt>Geboren</dt><dd>31.12.1995</dd></div><div><dt>Kontakt</dt><dd><a href="mailto:servus@marioschub.com">servus@marioschub.com</a><br /><a href="tel:+4915155338029">+49 1515 5338029</a></dd></div></dl></section>
    <section className="cv-section"><h2>Erfahrung</h2><div className="cv-timeline">{experience.map(([date, role, body]) => <article key={role}><span>{date}</span><div><h3>{role}</h3><p>{body}</p></div></article>)}</div></section>
    <div className="cv-columns">
      <section className="cv-section"><h2>Ausbildung</h2><article className="cv-plain"><span>10/2018—2023</span><h3>B.Sc. User Experience Design</h3><p>Technische Hochschule Ingolstadt</p></article></section>
      <section className="cv-section"><h2>Kompetenzen</h2><p>Konzeption · Kamera · Regie · Schnitt · Postproduktion · Fotografie · Content-Strategie · Workshop-Moderation · Workflow Design</p><p>Adobe Premiere Pro · After Effects · Lightroom · Photoshop · Final Cut Pro · AI-gestützte Produktion</p></section>
      <section className="cv-section"><h2>Sprachen</h2><dl className="langs"><div><dt>Deutsch</dt><dd>Muttersprache</dd></div><div><dt>Englisch</dt><dd>C1</dd></div><div><dt>Französisch</dt><dd>B1</dd></div></dl></section>
    </div>
    <footer className="cv-footer"><span>marioschub.com</span><span>wyldworks.de</span><span>Ingolstadt / München</span></footer>
  </main>
}

export default function App() { return window.location.pathname.replace(/\/$/, '') === '/cv' ? <CV /> : <Home /> }
