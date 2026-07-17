import { useEffect } from 'react'
import { aiDisclosure, assignmentAnswers, type AssignmentAnswer } from './assignmentData'
import './assignmentPrint.css'

const ASSIGNMENT_URL = 'https://mario-schubert-vogel.vercel.app/assignment'

const chapterLayouts = [
  'verdict-plane',
  'consequence-edge',
  'dark-interlude',
  'editorial-split',
  'consequence-edge mirror',
  'dark-interlude reverse',
  'number-poster',
  'verdict-plane finale',
]

function usePrintDocument() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Acht Fragen · Druckfassung · Mario Schubert'
    document.body.classList.add('assignment-print-body')
    const pageStyle = document.createElement('style')
    pageStyle.dataset.assignmentPage = 'true'
    pageStyle.textContent = '@page { size: A4; margin: 0; }'
    document.head.appendChild(pageStyle)
    return () => {
      document.title = previousTitle
      document.body.classList.remove('assignment-print-body')
      pageStyle.remove()
    }
  }, [])
}

function PrintFooter({ page, inverse = false }: { page: number; inverse?: boolean }) {
  return <footer className={`print-footer${inverse ? ' print-footer-inverse' : ''}`}>
    <span>Mario Schubert × Vogel</span>
    <span>Assignment 2026</span>
    <span>{String(page).padStart(2, '0')} / 10</span>
  </footer>
}

function PrintQuestion({ answer, index }: { answer: AssignmentAnswer; index: number }) {
  const layout = chapterLayouts[index]
  const inverse = layout.includes('dark-interlude')

  return <section className={`print-page print-chapter print-chapter-${layout}`} id={`print-question-${answer.number}`}>
    <div className="print-chapter-number" aria-hidden="true">{answer.number}</div>
    <header className="print-chapter-header">
      <span>Frage {answer.number} / 08</span>
      <strong>{answer.title}</strong>
    </header>

    <div className="print-question-beat">
      <span className="print-beat-index">01 / Frage</span>
      <h2>{answer.question}</h2>
    </div>

    <section className="print-verdict-beat" aria-labelledby={`print-position-${answer.number}`}>
      <h3 id={`print-position-${answer.number}`}>02 / Festlegung</h3>
      <p>{answer.position}</p>
    </section>

    <section className="print-rationale-beat" aria-labelledby={`print-rationale-${answer.number}`}>
      <h3 id={`print-rationale-${answer.number}`}>03 / Begründung</h3>
      <p>{answer.rationale}</p>
    </section>

    <section className="print-price-beat" aria-labelledby={`print-price-${answer.number}`}>
      <h3 id={`print-price-${answer.number}`}>04 / Preis</h3>
      <p>{answer.price}</p>
    </section>

    <PrintFooter page={index + 2} inverse={inverse} />
  </section>
}

export function AssignmentPrint() {
  usePrintDocument()

  return <main className="assignment-print" aria-label="Druckfassung der Vogel Assignment">
    <section className="print-page print-cover">
      <div className="print-cover-meta"><span>Vogel · Assignment 2026</span><span>Mario Schubert</span></div>
      <p>The Decision Field / Quiet Cut</p>
      <h1>Acht Fragen.<br /><em>/</em> Acht Entscheidungen.</h1>
      <div className="print-cover-index" aria-label="Kapitel 01 bis 08">
        {assignmentAnswers.map((answer) => <span key={answer.number}>{answer.number}</span>)}
      </div>
      <a className="print-online-link" href={ASSIGNMENT_URL}>
        <span><small>Online / interaktive Fassung</small><strong>Diese zehn Seiten sind die ruhige Fassung.</strong><b>Die interaktive Storyline lebt online.</b></span>
        <span className="print-link-address">{ASSIGNMENT_URL}</span>
        <i aria-hidden="true">→</i>
      </a>
      <PrintFooter page={1} inverse />
    </section>

    {assignmentAnswers.map((answer, index) => <PrintQuestion answer={answer} index={index} key={answer.number} />)}

    <section className="print-page print-transparency">
      <div className="print-page-heading"><span>Vogel · Assignment 2026</span><strong>09 / Transparenz</strong></div>
      <div className="print-transparency-copy">
        <span>09</span>
        <h2>{aiDisclosure.question}</h2>
        <p>{aiDisclosure.answer}</p>
      </div>
      <blockquote>Positionen dürfen sich entwickeln.<br /><em>Verantwortung bleibt.</em></blockquote>
      <a className="print-end-link" href={ASSIGNMENT_URL}><span>Die interaktive Storyline online erleben →</span><strong>{ASSIGNMENT_URL}</strong></a>
      <PrintFooter page={10} inverse />
    </section>
  </main>
}
