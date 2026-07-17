import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { aiDisclosure, assignmentAnswers, type AssignmentAnswer } from './assignmentData'
import './assignment.css'

const PDF_PATH = '/documents/Mario_Schubert_Assignment_Vogel.pdf'
const DIRECTOR_URL = 'https://mario-schubert-vogel.vercel.app/assignment-v2'

function AssignmentModeSwitch() {
  return <nav className="assignment-mode-switch" aria-label="Fassung wählen">
    <span aria-current="page">Original Cut</span><a href="/assignment-v2">Director’s Cut</a>
  </nav>
}

function useAssignmentDocument(title: string, bodyClass: string, enableMotion = false) {
  useLayoutEffect(() => {
    const previousTitle = document.title
    document.title = title
    document.body.classList.add(bodyClass)

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (enableMotion && !reduceMotion) document.documentElement.dataset.assignmentMotion = 'true'

    return () => {
      document.title = previousTitle
      document.body.classList.remove(bodyClass)
      delete document.documentElement.dataset.assignmentMotion
    }
  }, [bodyClass, enableMotion, title])
}

function AssignmentIndex({ active }: { active: string }) {
  return <nav className="assignment-rail" aria-label="Direkt zu einer Frage">
    <a className={active === 'top' ? 'is-active' : ''} href="#assignment-top" aria-label="Zum Anfang">×</a>
    {assignmentAnswers.map((answer) => <a
      className={active === answer.number ? 'is-active' : ''}
      href={`#question-${answer.number}`}
      key={answer.number}
      aria-label={`Zu Frage ${answer.number}: ${answer.title}`}
      aria-current={active === answer.number ? 'step' : undefined}
    >{answer.number}</a>)}
    <a className={active === '09' ? 'is-active' : ''} href="#transparenz" aria-label="Zur Transparenz">09</a>
  </nav>
}

function Chapter({ answer }: { answer: AssignmentAnswer }) {
  const sectionRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    let frame = 0
    const update = () => {
      frame = 0
      const section = sectionRef.current
      const stage = stageRef.current
      if (!section || !stage) return
      const rect = section.getBoundingClientRect()
      const travel = Math.max(1, rect.height - window.innerHeight)
      const progress = Math.min(1, Math.max(0, -rect.top / travel))
      stage.style.setProperty('--chapter-progress', progress.toFixed(4))
      const anchored = window.location.hash === `#question-${answer.number}`
      stage.dataset.phase = progress < .23 ? (anchored ? 'position' : 'question') : progress < .47 ? 'position' : progress < .72 ? 'rationale' : 'price'
    }
    const requestUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', requestUpdate, { passive: true })
    window.addEventListener('resize', requestUpdate)
    return () => {
      window.removeEventListener('scroll', requestUpdate)
      window.removeEventListener('resize', requestUpdate)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [answer.number])

  return <article className="assignment-chapter" id={`question-${answer.number}`} ref={sectionRef} data-chapter={answer.number} tabIndex={-1}>
    <div className="chapter-stage" ref={stageRef} data-phase="position">
      <header className="chapter-heading">
        <span className="chapter-number" aria-hidden="true">{answer.number}</span>
        <div><span>Frage {answer.number} / 08</span><strong>{answer.title}</strong></div>
      </header>
      <h2 className={`chapter-question${answer.question.length > 82 ? ' chapter-question-long' : ''}`}>{answer.question}</h2>
      <div className="chapter-answers">
        <section className="chapter-position" aria-labelledby={`position-${answer.number}`}>
          <h3 id={`position-${answer.number}`}>Festlegung</h3>
          <p>{answer.position}</p>
        </section>
        <section className="chapter-rationale" aria-labelledby={`rationale-${answer.number}`}>
          <h3 id={`rationale-${answer.number}`}>Begründung</h3>
          <p>{answer.rationale}</p>
        </section>
      </div>
      <section className="chapter-price" aria-labelledby={`price-${answer.number}`}>
        <h3 id={`price-${answer.number}`}>Preis</h3>
        <p>{answer.price}</p>
      </section>
      <div className="chapter-timeline" aria-hidden="true"><i /></div>
    </div>
  </article>
}

export function Assignment() {
  const [activeChapter, setActiveChapter] = useState('top')
  useAssignmentDocument('Acht Fragen · Mario Schubert · Vogel', 'assignment-body', true)

  useLayoutEffect(() => {
    let cancelled = false
    const frames: number[] = []
    const positionHash = () => {
      if (!window.location.hash.startsWith('#question-')) return
      const target = document.querySelector<HTMLElement>(window.location.hash)
      if (!target) return
      const top = window.scrollY + target.getBoundingClientRect().top
      window.scrollTo({ top, left: 0, behavior: 'instant' as ScrollBehavior })
      target.focus({ preventScroll: true })
    }
    const settle = () => {
      if (cancelled) return
      positionHash()
      frames.push(window.requestAnimationFrame(() => {
        positionHash()
        frames.push(window.requestAnimationFrame(positionHash))
      }))
    }
    settle()
    document.fonts.ready.then(settle)
    window.addEventListener('hashchange', settle)
    return () => {
      cancelled = true
      frames.forEach((frame) => window.cancelAnimationFrame(frame))
      window.removeEventListener('hashchange', settle)
    }
  }, [])

  useEffect(() => {
    const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-assignment-section]'))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
        if (visible) setActiveChapter((visible.target as HTMLElement).dataset.assignmentSection ?? 'top')
      },
      { threshold: [0.2, 0.45, 0.7] },
    )
    targets.forEach((target) => observer.observe(target))
    return () => observer.disconnect()
  }, [])

  return <>
    <a className="assignment-skip" href="#assignment-content">Zum Inhalt springen</a>
    <AssignmentIndex active={activeChapter} />
    <main className="assignment-app" id="assignment-content">
      <section className="assignment-opening" id="assignment-top" data-assignment-section="top">
        <div className="opening-meta"><span>Vogel · Assignment 2026</span><span>Mario Schubert</span></div>
        <div className="opening-copy">
          <p className="opening-kicker">Eine Entscheidungskammer in acht Schnitten</p>
          <h1><span>Acht Fragen.</span><span>Acht Festlegungen.</span><em>Keine Ausweichbewegung.</em></h1>
        </div>
        <div className="opening-index" aria-label="Acht Kapitel">
          {assignmentAnswers.map((answer) => <a href={`#question-${answer.number}`} key={answer.number} aria-label={`Frage ${answer.number}: ${answer.title}`}><span>{answer.number}</span><i /></a>)}
        </div>
        <div className="opening-actions">
          <a className="assignment-download" href={PDF_PATH} download>PDF herunterladen <span>↓</span></a>
          <AssignmentModeSwitch />
          <a className="scroll-cue" href="#question-01"><i />Scrollen, um Position zu beziehen</a>
        </div>
      </section>

      {assignmentAnswers.map((answer) => <div data-assignment-section={answer.number} key={answer.number}><Chapter answer={answer} /></div>)}

      <section className="assignment-closing" id="transparenz" data-assignment-section="09">
        <div className="closing-index"><span>09</span><strong>Transparenz</strong></div>
        <div className="closing-copy">
          <h2 className="closing-label">{aiDisclosure.question}</h2>
          <p className="closing-answer">{aiDisclosure.answer}</p>
        </div>
        <div className="closing-statement">
          <p>Positionen dürfen sich entwickeln. <em>Verantwortung bleibt.</em></p>
          <div className="closing-actions"><AssignmentModeSwitch /><a className="assignment-download assignment-download-dark" href={PDF_PATH} download>PDF herunterladen <span>↓</span></a></div>
        </div>
      </section>
    </main>
  </>
}

function PrintQuestion({ answer }: { answer: AssignmentAnswer }) {
  return <article className="print-question">
    <span className="print-edge" aria-hidden="true" />
    <header><span>{answer.number}</span><div><small>FRAME {answer.number} / 08</small><strong>{answer.title}</strong></div></header>
    <h2>{answer.question}</h2>
    <section className="print-position"><h3>Festlegung</h3><p>{answer.position}</p></section>
    <section className="print-rationale"><h3>Begründung</h3><p>{answer.rationale}</p></section>
    <section className="print-price"><h3>Preis</h3><p>{answer.price}</p></section>
  </article>
}

function PrintFooter({ page }: { page: number }) {
  return <footer className="print-footer"><span>Mario Schubert</span><span>Vogel · Assignment 2026</span><span>{String(page).padStart(2, '0')} / 06</span></footer>
}

export function AssignmentPrint() {
  useAssignmentDocument('Acht Fragen · Druckfassung · Mario Schubert', 'assignment-print-body')

  useEffect(() => {
    const pageStyle = document.createElement('style')
    pageStyle.dataset.assignmentPage = 'true'
    pageStyle.textContent = '@page { size: A4; margin: 0; }'
    document.head.appendChild(pageStyle)
    return () => pageStyle.remove()
  }, [])

  const spreads = [
    assignmentAnswers.slice(0, 2),
    assignmentAnswers.slice(2, 4),
    assignmentAnswers.slice(4, 6),
    assignmentAnswers.slice(6, 8),
  ]

  return <main className="assignment-print" aria-label="Druckfassung der Vogel Assignment">
    <section className="print-page print-cover">
      <div className="print-cover-meta"><span>Vogel · Assignment 2026</span><span>Mario Schubert</span></div>
      <p>The Decision Field / Quiet Cut</p>
      <h1>Acht Fragen.<br /><em>/</em> Acht Festlegungen.</h1>
      <div className="print-cover-index" aria-label="Kapitel 01 bis 08">
        {assignmentAnswers.map((answer) => <span key={answer.number}>{answer.number}</span>)}
      </div>
      <a className="print-online-ticket" href={DIRECTOR_URL}>
        <span className="print-ticket-copy"><small>Online ticket / Director’s Cut</small><strong>Diese sechs Seiten sind die ruhige Fassung.</strong><b>Die interaktive Storyline lebt online.</b><span>{DIRECTOR_URL}</span></span>
        <img src="/documents/assignment-v2-qr.png" alt="QR-Code zur interaktiven Director’s-Cut-Fassung" />
      </a>
      <PrintFooter page={1} />
    </section>

    {spreads.map((answers, index) => <section className="print-page print-spread" key={answers[0].number}>
      <div className="print-page-heading"><span>Acht Festlegungen</span><strong>{answers[0].number}—{answers[1].number}</strong></div>
      <div className="print-question-grid">{answers.map((answer) => <PrintQuestion answer={answer} key={answer.number} />)}</div>
      <PrintFooter page={index + 2} />
    </section>)}

    <section className="print-page print-transparency">
      <div className="print-page-heading"><span>Vogel · Assignment 2026</span><strong>09 / Transparenz</strong></div>
      <div className="print-transparency-copy">
        <span>09</span>
        <h2>{aiDisclosure.question}</h2>
        <p>{aiDisclosure.answer}</p>
      </div>
      <blockquote>Positionen dürfen sich entwickeln.<br /><em>Verantwortung bleibt.</em></blockquote>
      <a className="print-end-link" href={DIRECTOR_URL}><span>Director’s Cut online ansehen</span><strong>{DIRECTOR_URL}</strong><img src="/documents/assignment-v2-qr.png" alt="QR-Code zur Director’s-Cut-Fassung" /></a>
      <PrintFooter page={6} />
    </section>
  </main>
}
