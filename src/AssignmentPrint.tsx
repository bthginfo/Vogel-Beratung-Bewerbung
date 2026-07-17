import { useEffect } from 'react'
import { aiDisclosure, assignmentAnswers, type AssignmentAnswer } from './assignmentData'
import './assignmentPrint.css'

const ASSIGNMENT_URL = 'https://mario-schubert-vogel.vercel.app/assignment'

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

function PrintQuestion({ answer }: { answer: AssignmentAnswer }) {
  const odd = Number(answer.number) % 2 === 1
  return <article className={`print-question print-question-${odd ? 'odd' : 'even'}`}>
    <span className="print-ghost-number" aria-hidden="true">{answer.number}</span>
    <header>
      <small>FRAME {answer.number} / 08</small>
      <strong>{answer.title}</strong>
    </header>
    <h2>{answer.question}</h2>
    <div className="print-diptych">
      <section className="print-position" aria-labelledby={`print-position-${answer.number}`}>
        <h3 id={`print-position-${answer.number}`}>Festlegung</h3>
        <p>{answer.position}</p>
      </section>
      <section className="print-rationale" aria-labelledby={`print-rationale-${answer.number}`}>
        <h3 id={`print-rationale-${answer.number}`}>Begründung</h3>
        <p>{answer.rationale}</p>
      </section>
    </div>
    <section className="print-price" aria-labelledby={`print-price-${answer.number}`}>
      <h3 id={`print-price-${answer.number}`}>Preis</h3>
      <p>{answer.price}</p>
    </section>
  </article>
}

function PrintFooter({ page }: { page: number }) {
  return <footer className="print-footer"><span>Mario Schubert</span><span>Vogel · Assignment 2026</span><span>{String(page).padStart(2, '0')} / 06</span></footer>
}

export function AssignmentPrint() {
  usePrintDocument()
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
      <a className="print-online-link" href={ASSIGNMENT_URL}>
        <span><small>Online / interaktive Fassung</small><strong>Diese sechs Seiten sind die ruhige Fassung.</strong><b>Die interaktive Storyline lebt online.</b></span>
        <span className="print-link-address">{ASSIGNMENT_URL}</span>
        <i aria-hidden="true">→</i>
      </a>
      <PrintFooter page={1} />
    </section>

    {spreads.map((answers, index) => <section className={`print-page print-spread print-spread-${index + 1}`} id={`print-spread-${index + 1}`} key={answers[0].number}>
      <div className="print-page-heading"><span>Quiet Cut / Editorial Frames</span><strong>{answers[0].number}—{answers[1].number}</strong></div>
      <div className="print-film-gutter" aria-hidden="true"><i /><span>{String(index + 1).padStart(2, '0')}</span><i /></div>
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
      <a className="print-end-link" href={ASSIGNMENT_URL}><span>Die interaktive Storyline online erleben →</span><strong>{ASSIGNMENT_URL}</strong></a>
      <PrintFooter page={6} />
    </section>
  </main>
}
