import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { aiDisclosure, assignmentAnswers, type AssignmentAnswer } from './assignmentData'
import './assignmentV2.css'

const PDF_PATH = '/documents/Mario_Schubert_Assignment_Vogel.pdf'
const beatNames = ['FRAGE', 'FESTLEGUNG', 'BEGRÜNDUNG', 'PREIS'] as const

function useDirectorDocument() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Acht Festlegungen · Director’s Cut · Mario Schubert'
    document.body.classList.add('director-body')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('director-body')
    }
  }, [])
}

function CutSwitch({ end = false }: { end?: boolean }) {
  return <nav className={`cut-switch${end ? ' cut-switch-end' : ''}`} aria-label="Fassung wählen">
    <a href="/assignment">Original Cut</a>
    <span aria-current="page">Director’s Cut</span>
  </nav>
}

function FilmLeader({ onFinish }: { onFinish: () => void }) {
  const [count, setCount] = useState(8)

  useEffect(() => {
    const interval = window.setInterval(() => setCount((value) => Math.max(1, value - 1)), 115)
    const timeout = window.setTimeout(onFinish, 1120)
    return () => {
      window.clearInterval(interval)
      window.clearTimeout(timeout)
    }
  }, [onFinish])

  return <div className="director-leader" role="status" aria-label="Filmsequenz wird geöffnet">
    <span className="leader-crosshair" aria-hidden="true" />
    <strong>{String(count).padStart(2, '0')}</strong>
    <small>DECISION FIELD / LOADING FRAME</small>
    <button type="button" onClick={onFinish}>Überspringen</button>
  </div>
}

function GrainCanvas({ rootRef }: { rootRef: React.RefObject<HTMLElement | null> }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const root = rootRef.current
    if (!canvas || !root) return
    const context = canvas.getContext('2d', { alpha: true })
    if (!context) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let animationFrame = 0
    let lastDraw = 0
    let visible = !document.hidden
    canvas.width = 192
    canvas.height = 108

    const draw = (time = 0) => {
      const image = context.createImageData(canvas.width, canvas.height)
      for (let index = 0; index < image.data.length; index += 4) {
        const value = Math.random() > .5 ? 255 : 0
        image.data[index] = value
        image.data[index + 1] = value
        image.data[index + 2] = value
        image.data[index + 3] = Math.random() * 25
      }
      context.putImageData(image, 0, 0)
      lastDraw = time
    }

    const animate = (time: number) => {
      if (visible && time - lastDraw > 82) draw(time)
      animationFrame = window.requestAnimationFrame(animate)
    }
    const onVisibility = () => { visible = !document.hidden }
    const onPointer = (event: PointerEvent) => {
      root.style.setProperty('--pointer-x', `${(event.clientX / window.innerWidth) * 100}%`)
      root.style.setProperty('--pointer-y', `${(event.clientY / window.innerHeight) * 100}%`)
    }

    draw()
    if (!reduced) {
      animationFrame = window.requestAnimationFrame(animate)
      document.addEventListener('visibilitychange', onVisibility)
      window.addEventListener('pointermove', onPointer, { passive: true })
    }
    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [rootRef])

  return <canvas className="director-grain" ref={canvasRef} aria-hidden="true" />
}

function DirectorScene({ answer, register }: { answer: AssignmentAnswer; register: (node: HTMLElement | null) => void }) {
  const words = answer.question.split(' ')
  return <article
    className={`director-scene director-scene-${Number(answer.number) % 2 ? 'left' : 'right'}`}
    id={`director-question-${answer.number}`}
    data-director-scene={answer.number}
    data-beat="0"
    tabIndex={-1}
    ref={register}
  >
    <div className="director-stage">
      <div className="scene-register" aria-hidden="true"><span>{answer.number}</span><i>FRAME / {answer.number}</i></div>
      <header className="scene-heading">
        <span>FRAGE {answer.number} / 08</span>
        <strong>{answer.title}</strong>
      </header>
      <span className="scene-number" aria-hidden="true">{answer.number}</span>
      <div className="scene-question-plane">
        <p className="scene-beat-label">01 / FRAGE</p>
        <h2 aria-label={answer.question}>{words.map((word, index) => <span aria-hidden="true" style={{ '--word': index } as React.CSSProperties} key={`${word}-${index}`}>{word}{index < words.length - 1 ? '\u00a0' : ''}</span>)}</h2>
      </div>
      <section className="scene-position" aria-labelledby={`director-position-${answer.number}`}>
        <div><h3 id={`director-position-${answer.number}`}>Festlegung</h3><span>02 / 04</span></div>
        <p>{answer.position}</p>
      </section>
      <section className="scene-rationale" aria-labelledby={`director-rationale-${answer.number}`}>
        <div><h3 id={`director-rationale-${answer.number}`}>Begründung</h3><span>03 / 04</span></div>
        <p>{answer.rationale}</p>
      </section>
      <section className="scene-price" aria-labelledby={`director-price-${answer.number}`}>
        <div><h3 id={`director-price-${answer.number}`}>Preis</h3><span>04 / 04</span></div>
        <p>{answer.price}</p>
      </section>
      <div className="scene-beat-track" aria-hidden="true">{beatNames.map((beat) => <span key={beat}>{beat}</span>)}</div>
    </div>
  </article>
}

function DirectorNavigator({ active, beat }: { active: string; beat: number }) {
  return <nav className="director-nav" aria-label="Filmstreifen-Navigation">
    <a className={active === '00' ? 'is-active' : ''} href="#director-top" aria-label="Zum Anfang">00</a>
    <div className="director-nav-frames">
      {assignmentAnswers.map((answer) => <a
        className={active === answer.number ? 'is-active' : ''}
        href={`#director-question-${answer.number}`}
        key={answer.number}
        aria-label={`Frage ${answer.number}: ${answer.title}`}
        aria-current={active === answer.number ? 'step' : undefined}
      ><span>{answer.number}</span><i /></a>)}
    </div>
    <span className="director-current-beat" aria-live="polite">{active === '09' ? 'END FRAME' : beatNames[beat] ?? 'FRAGE'}</span>
    <a className={active === '09' ? 'is-active' : ''} href="#director-transparency" aria-label="Zur Transparenz">09</a>
  </nav>
}

export function AssignmentV2() {
  useDirectorDocument()
  const rootRef = useRef<HTMLElement>(null)
  const sceneRefs = useRef<HTMLElement[]>([])
  const [active, setActive] = useState('00')
  const [beat, setBeat] = useState(0)
  const [leader, setLeader] = useState(() => {
    if (window.location.hash.startsWith('#director-question-') || window.location.hash === '#director-transparency') return false
    try { return sessionStorage.getItem('vogel-director-leader') !== 'seen' } catch { return false }
  })

  const finishLeader = () => {
    try { sessionStorage.setItem('vogel-director-leader', 'seen') } catch { /* storage may be unavailable */ }
    setLeader(false)
  }

  useLayoutEffect(() => {
    let cancelled = false
    const frames: number[] = []

    const positionHash = () => {
      const hash = window.location.hash
      if (!hash.startsWith('#director-question-') && hash !== '#director-transparency') return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      const navigator = document.querySelector<HTMLElement>('.director-nav')
      const topOffset = window.innerWidth <= 900 ? (navigator?.offsetHeight ?? 0) : 0
      const top = window.scrollY + target.getBoundingClientRect().top - topOffset
      window.scrollTo({ top: Math.max(0, top), left: 0, behavior: 'instant' as ScrollBehavior })
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
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let lastY = window.scrollY
    let velocity = 0
    let decayFrame = 0

    const decay = () => {
      velocity *= .72
      rootRef.current?.style.setProperty('--scroll-velocity', velocity.toFixed(3))
      if (Math.abs(velocity) > .01) decayFrame = window.requestAnimationFrame(decay)
    }
    const update = () => {
      frame = 0
      const viewport = window.innerHeight
      let closest: HTMLElement | null = null
      let closestDistance = Number.POSITIVE_INFINITY
      sceneRefs.current.forEach((scene) => {
        const rect = scene.getBoundingClientRect()
        const travel = Math.max(1, rect.height - viewport)
        const progress = Math.min(1, Math.max(0, -rect.top / travel))
        scene.style.setProperty('--scene-progress', progress.toFixed(4))
        const sceneBeat = progress < .22 ? 0 : progress < .47 ? 1 : progress < .73 ? 2 : 3
        scene.dataset.beat = String(sceneBeat)
        const distance = Math.abs(rect.top + rect.height / 2 - viewport / 2)
        if (distance < closestDistance) {
          closest = scene
          closestDistance = distance
        }
      })
      if (closest) {
        const current = closest as HTMLElement
        setActive(current.dataset.directorScene ?? '00')
        setBeat(Number(current.dataset.beat ?? 0))
      } else if (window.scrollY < viewport * .65) {
        setActive('00')
        setBeat(0)
      }
      const end = document.getElementById('director-transparency')?.getBoundingClientRect()
      if (end && end.top < viewport * .55) setActive('09')
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(update)
      if (!reduced) {
        velocity = Math.max(-1, Math.min(1, (window.scrollY - lastY) / 70))
        lastY = window.scrollY
        rootRef.current?.style.setProperty('--scroll-velocity', velocity.toFixed(3))
        if (decayFrame) window.cancelAnimationFrame(decayFrame)
        decayFrame = window.requestAnimationFrame(decay)
      }
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      if (decayFrame) window.cancelAnimationFrame(decayFrame)
    }
  }, [])

  return <main className="director-app" id="director-content" ref={rootRef}>
    {leader && <FilmLeader onFinish={finishLeader} />}
    <a className="director-skip" href="#director-question-01">Zum ersten Kapitel springen</a>
    <GrainCanvas rootRef={rootRef} />
    <DirectorNavigator active={active} beat={beat} />

    <section className="director-hero" id="director-top">
      <div className="director-gate" aria-hidden="true"><i /><i /></div>
      <div className="director-hero-meta"><span>VOGEL · ASSIGNMENT 2026</span><span>MARIO SCHUBERT</span></div>
      <div className="director-title-block">
        <p>THE DECISION FIELD</p>
        <h1><span>ACHT FRAGEN</span><i>/</i><span>ACHT FESTLEGUNGEN</span></h1>
        <blockquote>Position ist kein Standbild.<br /><em>Sie entsteht in Bewegung.</em></blockquote>
      </div>
      <div className="director-hero-footer">
        <div><strong>Mario Schubert</strong><span>Director’s Cut</span></div>
        <a className="director-download" href={PDF_PATH} download>PDF / Quiet Cut <span>↓</span></a>
        <CutSwitch />
        <a className="director-scroll" href="#director-question-01"><i />Film ab / Scroll to begin</a>
      </div>
    </section>

    <div className="director-sequence" aria-label="Acht Entscheidungsframes">
      {assignmentAnswers.map((answer, index) => <DirectorScene
        answer={answer}
        register={(node) => { if (node) sceneRefs.current[index] = node }}
        key={answer.number}
      />)}
    </div>

    <section className="director-end" id="director-transparency">
      <div className="end-frame-index"><span>09</span><strong>END FRAME / TRANSPARENZ</strong></div>
      <div className="end-frame-copy">
        <p>OFFENLEGUNG</p>
        <h2>{aiDisclosure.question}</h2>
        <div className="end-answer"><span aria-hidden="true">AI</span><p>{aiDisclosure.answer}</p></div>
      </div>
      <blockquote>Positionen dürfen sich entwickeln.<br /><em>Verantwortung bleibt.</em></blockquote>
      <div className="director-end-actions">
        <a className="director-download director-download-end" href={PDF_PATH} download>PDF / Quiet Cut <span>↓</span></a>
        <CutSwitch end />
      </div>
    </section>
  </main>
}
