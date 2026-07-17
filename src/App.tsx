import { useEffect, useRef, useState } from 'react'
import { Assignment, AssignmentPrint } from './Assignment'
import { AssignmentV2 } from './AssignmentV2'

const nav = [
  ['Filme', 'filme'], ['Warum', 'jetzt'], ['Arbeit', 'arbeit'], ['Formate', 'formate'],
  ['System', 'system'], ['90 Tage', 'plan'], ['Profil', 'profil'],
]

type Film = { title: string; category: string; thumbnail: string; embed: string; source: string }

const films: Film[] = [
  { title: 'GRUBER.HAUS · Jungle Hut by Matteo Thun', category: 'Architektur · Markenfilm · Long-form', thumbnail: '/media/videos/gruber-jungle-hut.jpg', embed: 'https://www.youtube-nocookie.com/embed/rszFtLr1_GI', source: 'YouTube' },
  { title: 'GRUBER.HAUS · Haus 01', category: 'Imagefilm · Architektur', thumbnail: '/media/videos/gruber-haus-1.jpg', embed: 'https://drive.google.com/file/d/1ptQ21cz0WOCKqr5ErahCuAUvsk8rlkY1/preview', source: 'Google Drive' },
  { title: 'GRUBER.HAUS · Haus 02', category: 'Imagefilm · Architektur', thumbnail: '/media/videos/gruber-haus-2.jpg', embed: 'https://drive.google.com/file/d/1_-wKTG6xt3juZPAM90dIkmL9M03JjlSS/preview', source: 'Google Drive' },
  { title: 'GRUBER.HAUS · Haus 03', category: 'Imagefilm · Architektur / Detail', thumbnail: '/media/videos/gruber-haus-3.jpg', embed: 'https://drive.google.com/file/d/1hbCq_74vNohfHo-zrZ1gderALgQQRlTY/preview', source: 'Google Drive' },
  { title: 'Dreissigacker · NFT Q&A', category: 'Interview · Q&A · Erklärformat', thumbnail: '/media/videos/dreissigacker.jpg', embed: 'https://drive.google.com/file/d/1V71MyGOv4QmpbhjhJvD5v4rl_Lf6mhxN/preview', source: 'Google Drive' },
  { title: 'Aston Martin · DBX 707', category: 'Premium Brand · Automotive Film', thumbnail: '/media/videos/aston-dbx.jpg', embed: 'https://drive.google.com/file/d/1rzRF8FGjO8SrPf7tegbeYW7VbBmpbYFn/preview', source: 'Google Drive' },
  { title: 'The Honourables · Golf & Business Cup', category: 'Eventfilm · Business / Lifestyle', thumbnail: '/media/videos/the-honourables.jpg', embed: 'https://drive.google.com/file/d/1LH989Q6MOTSidqQZzisju0qqdQDrAwig/preview', source: 'Google Drive' },
  { title: 'Shi Heng Yi · Shaolin Spirit', category: 'Gespräch · Podcast / Long-form', thumbnail: '/media/videos/shaolin-spirit.jpg', embed: 'https://www.youtube-nocookie.com/embed/vLoTyZ7CVRw', source: 'YouTube' },
  { title: 'Aston Martin x Hollfelder Juwelier - Aftermovie', category: 'Premium Event · Marke / Lifestyle', thumbnail: '/media/videos/aston-hollfelder.jpg', embed: 'https://www.youtube-nocookie.com/embed/dhZtdIx6FDY', source: 'YouTube' },
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
  const [reduce] = useState(() => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  const [loadVideo, setLoadVideo] = useState(() => !reduce)
  const [playRequested, setPlayRequested] = useState(false)

  useEffect(() => {
    const v = videoRef.current
    if (!v || !loadVideo || (reduce && !playRequested)) return
    v.load()
    v.play().then(() => setPlaying(true)).catch(() => setPlaying(false))
  }, [loadVideo, playRequested, reduce])

  const toggle = () => {
    const v = videoRef.current
    if (!v) return
    if (!loadVideo) {
      setPlayRequested(true)
      setLoadVideo(true)
      return
    }
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
    <video ref={videoRef} muted loop playsInline preload={loadVideo ? 'metadata' : 'none'} poster="/media/gruber-hero-poster.jpg" onTimeUpdate={updateTime} aria-label="Architektur-Skizzen aus dem WYLDWORKS Markenfilm GRUBER.HAUS · Jungle Hut by Matteo Thun">
      {loadVideo && <source src="/media/gruber-hero.mp4" type="video/mp4" />}
    </video>
    <div className="video-meta"><span>GRUBER.HAUS / BRAND FILM</span><span>{time}</span></div>
    <button className="play" type="button" onClick={toggle} aria-label={playing ? 'Video pausieren' : 'Video abspielen'}>{playing ? 'Ⅱ' : '▶'}<span>{playing ? 'Pause' : 'Play'}</span></button>
    <div className={`playhead ${playing ? 'running' : ''}`} aria-hidden="true"><i /></div>
  </div>
}

function VideoLibrary() {
  const [active, setActive] = useState<Film | null>(null)
  const dialogRef = useRef<HTMLDialogElement>(null)
  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (active && !dialog.open) {
      dialog.showModal()
      document.body.classList.add('dialog-open')
      window.requestAnimationFrame(() => closeRef.current?.focus())
    }
    if (!active && dialog.open) dialog.close()
    return () => document.body.classList.remove('dialog-open')
  }, [active])

  useEffect(() => {
    if (!active) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setActive(null)
        document.body.classList.remove('dialog-open')
        window.setTimeout(() => triggerRef.current?.focus(), 0)
      }
    }
    window.addEventListener('keydown', onKeyDown, true)
    return () => window.removeEventListener('keydown', onKeyDown, true)
  }, [active])

  const openFilm = (film: Film, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger
    setActive(film)
  }

  const closeFilm = () => {
    setActive(null)
    document.body.classList.remove('dialog-open')
    window.setTimeout(() => triggerRef.current?.focus(), 0)
  }

  return <section className="reel section" id="filme">
    <div className="reel-cover-label"><span>01 / Film dossier</span><span>Featured story</span><span>WYLDWORKS Auswahl</span></div>
    <div className="reel-featured">
      {[films[0]].map((film) => <button className="film-feature film-cover" type="button" key={film.title} onClick={(event) => openFilm(film, event.currentTarget)} aria-label={`${film.title} abspielen`}>
        <img src={film.thumbnail} alt="" loading="lazy" /><span className="film-shade" />
        <span className="film-number">F—01 / Lead film</span><span className="film-play" aria-hidden="true">▶</span>
        <span className="film-caption"><small>{film.category}</small><strong>{film.title}</strong></span>
      </button>)}
    </div>
    <div className="reel-head"><h2>Bewegtbild<br /><em>zuerst.</em></h2><p>Neun Arbeiten zwischen Architektur, Mittelstand, Gespräch, Premium Brand, Event und Menschen. Ein Lead Film – acht weitere Perspektiven.</p></div>
    <div className="film-index" aria-label="Weitere ausgewählte Filme">
      {films.slice(1).map((film, i) => <button type="button" key={film.title} onClick={(event) => openFilm(film, event.currentTarget)} aria-label={`${film.title} abspielen`}>
        <span className="index-no">0{i + 2}</span><span className="index-thumb"><img src={film.thumbnail} alt="" loading="lazy" /></span><strong>{film.title}</strong><small>{film.category}</small><span className="index-play" aria-hidden="true">Play ↗</span>
      </button>)}
    </div>
    <dialog ref={dialogRef} className="film-dialog" aria-label={active ? `Film: ${active.title}` : 'Filmplayer'} onCancel={(event) => { event.preventDefault(); closeFilm() }} onClose={() => { document.body.classList.remove('dialog-open'); if (active) setActive(null) }} onClick={(event) => { if (event.target === event.currentTarget) closeFilm() }}>
      {active && <div className="dialog-panel">
        <div className="dialog-bar"><div><span>{active.category}</span><strong>{active.title}</strong></div><button ref={closeRef} type="button" onClick={closeFilm} aria-label="Film schließen">Schließen ×</button></div>
        <div className="embed-shell"><iframe src={active.embed} title={active.title} allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin" /></div>
        <div className="dialog-foot"><span>Portfoliofilm · kuratierte Auswahl</span><span>ESC zum Schließen</span></div>
      </div>}
    </dialog>
  </section>
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
            <p>Liebes Vogel-Team, ich bin Mario Schubert – Bildgestalter, Produzent und UX-Denker aus Ingolstadt.</p>
            <p>Ich verbinde Idee, Kamera, Post und System. Damit aus guten Einzelstücken eine Bildsprache wird.</p>
            <div className="hero-actions"><a className="button mint" href="#filme">Filme ansehen ↓</a><a className="text-link" href="mailto:servus@marioschub.com">Direkt sprechen ↗</a></div>
          </div>
          <HeroVideo />
          <aside className="slate" aria-label="Bewerbungsdetails">
            <span>Applicant slate</span><strong>Mario<br />Schubert</strong>
            <dl><div><dt>Base</dt><dd>Ingolstadt → München</dd></div><div><dt>Focus</dt><dd>Concept / Camera / Cut / System</dd></div><div><dt>Date</dt><dd>07 / 2026</dd></div></dl>
          </aside>
        </div>
      </section>

      <VideoLibrary />

      <section className="section now" id="jetzt">
        <div className="section-index"><span>02</span><p>Warum jetzt</p></div>
        <div className="now-copy"><h2>Ein Team.<br />Ein Anspruch.<br /><em>Eine Sprache, die wächst.</em></h2>
          <div className="prose"><p>Selbstständigkeit hat mir beigebracht, alles zu tragen: Strategie, Akquise, Produktion und den letzten Export. Das schafft Ownership. Es macht aber auch deutlich, was mir als Nächstes wichtig ist.</p><p>Ich möchte nicht nach jedem letzten Cut weiterziehen, sondern die nächsten hundert Filme besser machen als die ersten zehn. Mit einem Team, das Gestaltung ernst nimmt, offen diskutiert und Standards nicht als Einschränkung versteht, sondern als Basis für mehr gute Arbeit.</p><p>Genau darin sehe ich bei Vogel die spannende Aufgabe: Bewegtbild nicht nur produzieren, sondern von Anfang an so aufbauen, dass Qualität und Takt zusammenpassen.</p></div>
        </div>
        <blockquote>„Ich komme lieber mit einer ersten Bildidee in den Raum als mit einer Liste offener Fragen. Danach wird gemeinsam geschärft.“</blockquote>
      </section>

      <section className="work section dark" id="arbeit">
        <div className="section-index light"><span>03</span><p>Ausgewählte Arbeit</p></div>
        <div className="work-heading"><p>Mittelstand, Menschen, Präzision</p><h2>Arbeit, die nah genug rangeht.</h2></div>
        <article className="case case-film">
          <div className="case-visual"><video muted loop playsInline preload="none" poster="/media/griesmueller-poster.jpg"><source src="/media/griesmueller.mp4" type="video/mp4" /></video><span className="frame-mark">01 / 03</span></div>
          <div className="case-copy"><span>Markenfilm / Mittelstand</span><h3>Griesmüller<br />Stadtbrauerei</h3><p>Ein Film über das, was eine lokale Marke trägt: Menschen, Handgriffe und ein Ort mit Haltung.</p><strong>WYLDWORKS Produktion</strong></div>
        </article>
        <div className="case-pair">
          <article className="case"><div className="case-visual portrait"><img src="/media/feig-doka.jpg" alt="Gerüstbauer bei der Montage auf der Bauma" loading="lazy" /><span className="frame-mark">02 / 03</span></div><div className="case-copy"><span>Event & Produkt</span><h3>Feig Gerüste × Doka</h3><p>Arbeit in Bewegung, verdichtet auf Hände, Material und den Moment.</p><strong>Fotografie · Bildauswahl · Postproduktion</strong></div></article>
          <article className="case offset"><div className="case-visual"><img src="/media/maschinenbau.jpg" alt="Schwere Spezialmaschine von Ludwig Bauch auf einem Industrieareal" loading="lazy" /><span className="frame-mark">03 / 03</span></div><div className="case-copy"><span>Industrie & Präzision</span><h3>Ludwig Bauch Maschinentechnik</h3><p>Technik bekommt Maßstab, wenn Konstruktion und Umgebung miteinander sprechen.</p><strong>Konzept · Fotografie · Postproduktion</strong></div></article>
        </div>
        <div className="portfolio-links"><a href="#filme">Zum Filmindex ↑</a></div>
      </section>

      <section className="formats section" id="formate">
        <div className="section-index"><span>04</span><p>Zwei Formatideen</p></div>
        <p className="eyebrow">Zwei Formatideen für wiedererkennbare Geschichten aus dem Mittelstand.</p>
        <div className="format-grid">
          <article className="format salmon"><div className="format-no">A—01</div><h2>WAS<br />TRÄGT.</h2><p className="serif">Ein dokumentarisches Porträt über die Entscheidung, die ein Familienunternehmen geprägt hat.</p><dl><div><dt>Länge</dt><dd>6–10 Minuten</dd></div><div><dt>Kern</dt><dd>Eine Person. Ein Prozess. Eine Entscheidung.</dd></div><div><dt>Ausspielung</dt><dd>Hero Film · 3 Vertical Chapters · Still Set · Audio · Quotes · Archiv</dd></div></dl><p className="note">Keine chronologische Firmengeschichte. Eine echte Spannung, erzählt an einem konkreten Detail.</p></article>
          <article className="format green"><div className="format-no">B—01 / weekly</div><h2>EINE GUTE<br />FRAGE.</h2><p className="serif">Eine reale Frage aus dem unternehmerischen Alltag. Präzise beantwortet von jemandem, der ihn kennt.</p><dl><div><dt>Länge</dt><dd>45–75 Sekunden</dd></div><div><dt>Rhythmus</dt><dd>Eine klare Dramaturgie, jede Woche ein anderes Thema</dd></div><div><dt>Ausspielung</dt><dd>LinkedIn · Instagram · Shorts · Editorial</dd></div></dl><p className="note">Einfach wiederholbar, aber nie austauschbar – weil die Frage und die Person im Zentrum bleiben.</p></article>
        </div>
      </section>

      <section className="system section" id="system">
        <div className="section-index light"><span>05</span><p>Motion System</p></div>
        <div className="system-head"><h2>Eine Produktion.<br /><em>Viele gute Gründe, sie zu finden.</em></h2><p>Geschmack entscheidet im Bild.<br />Struktur entscheidet, ob es jede Woche gelingt.</p></div>
        <ol className="pipeline">
          {['Zuhören', 'Die Frage finden', 'Treatment / Shotlist', 'Lean Shoot', 'Edit / Grade / Sound', 'Formatversionen', 'Archiv / Lernen'].map((item, i) => <li key={item}><small>0{i + 1}</small><span>{item}</span></li>)}
        </ol>
        <div className="outputs"><div className="source"><span>1 ×</span><strong>guter Drehtag</strong></div><div className="output-list"><span>Long-form</span><span>3–5 Clips</span><span>Still Set</span><span>Audio / Podcast</span><span>Pull Quotes</span><span>B-Roll Library</span></div></div>
        <div className="ai-note"><span>AI, wo sie hilft</span><p>Research und Moodboards. Skript- und Storyboard-Entwürfe. Transkription, Untertitel und Rohorganisation. Repetitive Asset- und Admin-Abläufe.</p><strong>Die redaktionelle Entscheidung bleibt menschlich.</strong></div>
      </section>

      <section className="plan section" id="plan">
        <div className="section-index"><span>06</span><p>Die ersten 90 Tage</p></div>
        <div className="plan-head"><h2>Erst verstehen.<br />Dann wiederholen.<br /><em>Gemeinsam besser werden.</em></h2><p>Ein Einstieg, der zuhört, schnell ins Machen kommt und aus jedem Durchlauf lernt.</p></div>
        <div className="days">
          <article><span>01—30</span><h3>Sehen & setzen</h3><p>Brand- und Motion-Audit, Praktiker kennenlernen, Themenfelder priorisieren und erste schlanke Formate produzieren.</p></article>
          <article><span>31—60</span><h3>Bauen & wiederholen</h3><p>Erste Formatvorlagen, erstes Mandantenporträt, gemeinsames Cadence Board, wiederverwendbare Pre-/Post-Checklisten und Asset-Struktur.</p></article>
          <article><span>61—90</span><h3>Stabilisieren & lernen</h3><p>Verlässlicher Rhythmus, Review-Loop mit Brand & Content, Production Playbook v1 und ein Muster für Event-Repurposing.</p></article>
        </div>
      </section>

      <section className="proof section" id="profil">
        <div className="section-index"><span>07</span><p>Was ich mitbringe</p></div>
        <div className="proof-grid">
          <div className="proof-title"><h2>Bildgefühl.<br /><em>Und der Wille,</em><br />es verlässlich<br />zu machen.</h2><div className="document-actions"><a className="button dark-button" href="/cv">Lebenslauf ansehen →</a><a className="text-link" href="/anschreiben">Anschreiben lesen →</a></div></div>
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
        <div className="contact-image"><img src="/media/mario-contact.jpg" alt="Porträt von Mario Schubert am Fenster" loading="lazy" /></div>
        <div className="contact-copy"><span>Mario Schubert / Ingolstadt</span><h2>Wenn ihr jemanden sucht, der beim Bild anfängt und beim System nicht aufhört: <em>Lasst uns reden.</em></h2><div className="contact-links"><a href="mailto:servus@marioschub.com">servus@marioschub.com ↗</a><a href="tel:+4915155338029">+49 1515 5338029 ↗</a></div><div className="small-links"><a href="/cv">CV / Print</a><a href="/anschreiben">Anschreiben</a><a href="/documents/Mario_Schubert_CV_Vogel.pdf" download>CV PDF ↓</a><a href="/documents/Mario_Schubert_Anschreiben_Vogel.pdf" download>Anschreiben PDF ↓</a></div></div>
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
    <div className="cv-controls"><a href="/">← Zur Bewerbung</a><a href="/anschreiben">Anschreiben</a><a className="control-download" href="/documents/Mario_Schubert_CV_Vogel.pdf" download>CV direkt laden ↓</a><button onClick={() => window.print()}>Drucken / eigenes PDF</button></div>
    <header className="cv-header"><div><span>Curriculum Vitae / 07.2026</span><h1>Mario<br />Schubert</h1><p>Bildgestalter · Produzent · UX-Denker</p></div><img src="/media/mario-contact.jpg" alt="Mario Schubert" /></header>
    <a className="cv-site-link" href="https://mario-schubert-vogel.vercel.app">
      <span className="cv-site-copy">
        <small>Digitaler Case / Ergänzung zum CV</small>
        <strong>Bewerbungsseite &amp; Filmreferenzen ansehen</strong>
        <span>Film-Dossier, Formate und Arbeitsweise</span>
      </span>
      <span className="cv-site-address">
        <span>mario-schubert-vogel.vercel.app</span>
        <b aria-hidden="true">↗</b>
      </span>
    </a>
    <section className="cv-intro"><p>Ich verbinde visuelles Handwerk mit strategischem Denken und der Struktur, die aus einem guten Einzelstück eine verlässliche Serie macht.</p><dl><div><dt>Standort</dt><dd>Ingolstadt</dd></div><div><dt>Geboren</dt><dd>31.12.1995</dd></div><div><dt>Kontakt</dt><dd><a href="mailto:servus@marioschub.com">servus@marioschub.com</a><br /><a href="tel:+4915155338029">+49 1515 5338029</a></dd></div></dl></section>
    <section className="cv-section"><h2>Erfahrung</h2><div className="cv-timeline">{experience.map(([date, role, body]) => <article key={role}><span>{date}</span><div><h3>{role}</h3><p>{body}</p></div></article>)}</div></section>
    <div className="cv-columns">
      <section className="cv-section"><h2>Ausbildung</h2><article className="cv-plain"><span>10/2018—2023</span><h3>B.Sc. User Experience Design</h3><p>Technische Hochschule Ingolstadt</p></article></section>
      <section className="cv-section"><h2>Kompetenzen</h2><p>Konzeption · Kamera · Regie · Schnitt · Postproduktion · Fotografie · Content-Strategie · Workshop-Moderation · Workflow Design</p><p>Adobe Premiere Pro · After Effects · Lightroom · Photoshop · Final Cut Pro · AI-gestützte Produktion</p></section>
      <section className="cv-section"><h2>Sprachen</h2><dl className="langs"><div><dt>Deutsch</dt><dd>Muttersprache</dd></div><div><dt>Englisch</dt><dd>C1</dd></div><div><dt>Französisch</dt><dd>B1</dd></div></dl></section>
    </div>
    <footer className="cv-footer"><a href="https://marioschub.com/">marioschub.com</a><a href="https://www.wyldworks.de/">wyldworks.de</a><span>Ingolstadt / München</span></footer>
  </main>
}

function CoverLetter() {
  return <main className="letter-page">
    <div className="letter-controls"><a href="/">← Zur Bewerbung</a><a href="/cv">CV ansehen</a><a className="control-download" href="/documents/Mario_Schubert_Anschreiben_Vogel.pdf" download>Anschreiben PDF laden ↓</a><button onClick={() => window.print()}>Drucken / eigenes PDF</button></div>
    <article className="letter-sheet">
      <header className="letter-header"><div><span>Mario Schubert × Vogel Beratung</span><strong>Bewerbung / 07.2026</strong></div><aside><a href="mailto:servus@marioschub.com">servus@marioschub.com</a><a href="tel:+4915155338029">+49 1515 5338029</a><span>Ingolstadt</span></aside></header>
      <div className="letter-title"><span>Videograf & Bewegtbild Producer</span><h1>Bewerbung als<br /><em>Videograf & Bewegtbild Producer</em></h1></div>
      <div className="letter-body">
        <p>Sehr geehrtes Vogel-Team,</p>
        <p>die ausgeschriebene Position verbindet zwei Aufgaben, die meine bisherige Arbeit prägen: Bewegtbild eigenverantwortlich von der Konzeption bis zur Ausspielung zu produzieren und daraus eine konsistente visuelle Handschrift zu entwickeln. Diese Verbindung aus gestalterischem Anspruch, technischem Handwerk und effizienter Produktion möchte ich bei Vogel einbringen.</p>
        <p>Seit 2023 verantworte ich mit WYLDWORKS Produktionen für mehr als 30 Unternehmen. Dabei begleite ich den gesamten Prozess – von der Entwicklung der Bildidee und der Drehvorbereitung über Kamera, Licht und Ton bis zu Schnitt, Postproduktion und finaler Ausspielung. Ich arbeite mit schlanken Abläufen, treffe gestalterische Entscheidungen früh und lege besonderen Wert auf Bildwirkung, Rhythmus und einen präzisen Gesamtlook.</p>
        <p>Zuvor habe ich bei Achtzig20 ein Kreativteam von zwei auf mehr als zehn Mitarbeitende mit aufgebaut und im Co-Lead begleitet. Neben der Entwicklung visueller Konzepte und Storytelling-Formate habe ich Foto- und Videoproduktionen geplant, umgesetzt und bis zum Rollout verantwortet. Dabei habe ich gelernt, wie sich kreative Qualität auch in wiederkehrenden Produktionen verlässlich sichern lässt.</p>
        <p>Genau darin sehe ich die besondere Aufgabe bei Vogel: Bewegtbild nicht als Folge unabhängiger Einzelproduktionen zu behandeln, sondern als langfristig wiedererkennbare Sprache der Marke. Ich möchte Formate entwickeln, die effizient produziert und über unterschiedliche Kanäle ausgespielt werden können, ohne dabei an gestalterischer Eigenständigkeit zu verlieren.</p>
        <p>In der Postproduktion arbeite ich vor allem mit Final Cut Pro und After Effects. Neue technische Anforderungen und Produktionsumgebungen erschließe ich mir strukturiert und praxisnah. Die regelmäßige Präsenz am Standort München ist für mich sichergestellt; ein Einstieg ist ab sofort möglich.</p>
        <p>Ein ausführlicheres Bild meiner Arbeitsweise, ausgewählte Filmreferenzen und den aktuellen Lebenslauf finden Sie in meiner digitalen Bewerbung: <a href="https://mario-schubert-vogel.vercel.app">mario-schubert-vogel.vercel.app</a></p>
        <p>Ich freue mich darauf, Ihnen im persönlichen Gespräch zu zeigen, wie ich meine Erfahrung, meine Arbeitsweise und meine Bildsprache in den Aufbau der Bewegtbildproduktion bei Vogel einbringen kann.</p>
        <p className="letter-signoff">Mit freundlichen Grüßen<br /><strong>Mario Schubert</strong></p>
      </div>
      <footer className="letter-footer"><span>Serienfähig. Ohne serienmäßig auszusehen.</span><a href="https://mario-schubert-vogel.vercel.app">mario-schubert-vogel.vercel.app ↗</a></footer>
    </article>
  </main>
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '')
  if (path === '/assignment') return <Assignment />
  if (path === '/assignment-v2') return <AssignmentV2 />
  if (path === '/assignment-print') return <AssignmentPrint />
  if (path === '/cv') return <CV />
  if (path === '/anschreiben') return <CoverLetter />
  return <Home />
}
