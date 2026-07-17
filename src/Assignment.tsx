import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { aiDisclosure, assignmentAnswers, type AssignmentAnswer } from './assignmentData'
import './assignment.css'

const PDF_PATH = '/documents/Mario_Schubert_Assignment_Vogel.pdf'
const beatNames = ['FRAGE', 'FESTLEGUNG', 'BEGRÜNDUNG', 'PREIS'] as const

function useAssignmentDocument() {
  useEffect(() => {
    const previousTitle = document.title
    document.title = 'Acht Fragen · Acht Entscheidungen · Mario Schubert'
    document.body.classList.add('assignment-body')
    return () => {
      document.title = previousTitle
      document.body.classList.remove('assignment-body')
    }
  }, [])
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

  return <div className="assignment-leader" role="status" aria-label="Filmsequenz wird geöffnet">
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
    const mobile = window.innerWidth <= 760
    canvas.width = mobile ? 128 : 192
    canvas.height = mobile ? 72 : 108

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
      if (!visible) return
      if (time - lastDraw > (mobile ? 125 : 82)) draw(time)
      animationFrame = window.requestAnimationFrame(animate)
    }
    const onVisibility = () => {
      visible = !document.hidden
      if (!visible && animationFrame) {
        window.cancelAnimationFrame(animationFrame)
        animationFrame = 0
      } else if (visible && !reduced && !animationFrame) {
        animationFrame = window.requestAnimationFrame(animate)
      }
    }
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

  return <canvas className="assignment-grain" ref={canvasRef} aria-hidden="true" />
}

function splitQuestion(text: string) {
  const words = text.split(' ')
  const targetGroups = text.length > 92 ? 4 : text.length > 58 ? 3 : 2
  const targetLength = text.length / targetGroups
  const groups: string[] = []
  let group = ''
  words.forEach((word) => {
    if (group && groups.length < targetGroups - 1 && group.length + word.length + 1 > targetLength) {
      groups.push(group)
      group = word
    } else {
      group += `${group ? ' ' : ''}${word}`
    }
  })
  if (group) groups.push(group)
  return groups
}

function splitSentences(text: string) {
  return text.split(/(?<=[.!?])\s+/)
}

function AssignmentScene({ answer, register }: { answer: AssignmentAnswer; register: (node: HTMLElement | null) => void }) {
  const questionGroups = splitQuestion(answer.question)
  const rationaleSentences = splitSentences(answer.rationale)
  return <article
    className={`assignment-scene assignment-scene-${Number(answer.number) % 2 ? 'left' : 'right'}`}
    id={`question-${answer.number}`}
    data-assignment-scene={answer.number}
    data-beat="0"
    tabIndex={-1}
    ref={register}
  >
    <div className="assignment-stage">
      <div className="scene-register" aria-hidden="true"><span>{answer.number}</span><i>FRAME / {answer.number}</i></div>
      <header className="scene-heading">
        <span>FRAGE {answer.number} / 08</span>
        <strong>{answer.title}</strong>
      </header>
      <span className="scene-number" aria-hidden="true">{answer.number}</span>
      <div className="scene-question-plane">
        <p className="scene-beat-label">01 / FRAGE</p>
        <h2 aria-label={answer.question}>{questionGroups.map((group, index) => <span aria-hidden="true" style={{ '--group': index } as React.CSSProperties} key={group}>{group}{index < questionGroups.length - 1 ? ' ' : ''}</span>)}</h2>
      </div>
      <section className="scene-position" aria-labelledby={`assignment-position-${answer.number}`}>
        <div><h3 id={`assignment-position-${answer.number}`}>Festlegung</h3><span>02 / 04</span></div>
        <p>{answer.position}</p>
      </section>
      <section className="scene-rationale" aria-labelledby={`assignment-rationale-${answer.number}`}>
        <span className="scene-paper-plane" aria-hidden="true"><i /></span>
        <div><h3 id={`assignment-rationale-${answer.number}`}>Begründung</h3><span>03 / 04</span></div>
        <p aria-label={answer.rationale}>{rationaleSentences.map((sentence, index) => <span aria-hidden="true" style={{ '--sentence': index } as React.CSSProperties} key={sentence}>{sentence}{index < rationaleSentences.length - 1 ? ' ' : ''}</span>)}</p>
      </section>
      <section className="scene-price" aria-labelledby={`assignment-price-${answer.number}`}>
        <div><h3 id={`assignment-price-${answer.number}`}>Preis</h3><span>04 / 04</span></div>
        <p>{answer.price}</p>
      </section>
      <div className="scene-beat-track" aria-hidden="true">{beatNames.map((beat) => <span key={beat}>{beat}</span>)}</div>
    </div>
  </article>
}

function AssignmentNavigator({ active, beat }: { active: string; beat: number }) {
  return <nav className="assignment-nav" aria-label="Filmstreifen-Navigation" data-current-beat={beat}>
    <a className={active === '00' ? 'is-active' : ''} href="#assignment-top" aria-label="Zum Anfang">00</a>
    <div className="assignment-nav-frames">
      {assignmentAnswers.map((answer) => <a
        className={active === answer.number ? 'is-active' : ''}
        href={`#question-${answer.number}`}
        key={answer.number}
        aria-label={`Frage ${answer.number}: ${answer.title}`}
        aria-current={active === answer.number ? 'step' : undefined}
      ><span>{answer.number}</span><i /></a>)}
    </div>
    <span className="assignment-current-beat" aria-live="polite">{active === '09' ? 'END FRAME' : beatNames[beat] ?? 'FRAGE'}</span>
    <a className={active === '09' ? 'is-active' : ''} href="#transparency" aria-label="Zur Transparenz">09</a>
  </nav>
}

function ContinueIndicator({ active, beat }: { active: string; beat: number }) {
  const isChapter = assignmentAnswers.some((answer) => answer.number === active)
  const label = beat === 3 ? 'Nächste Frage' : 'Weiter scrollen'
  return <aside className={`assignment-continue${isChapter ? ' is-visible' : ''}`} aria-live="polite" aria-hidden={!isChapter}>
    <span className="continue-copy"><b>{label}</b><small>{beatNames[beat]}</small></span>
    <span className="continue-steps" aria-hidden="true">{beatNames.map((name, index) => <i className={index <= beat ? 'is-complete' : ''} key={name} />)}</span>
    <span className="continue-arrow" aria-hidden="true">↓</span>
  </aside>
}

export function Assignment() {
  useAssignmentDocument()
  const rootRef = useRef<HTMLElement>(null)
  const sceneRefs = useRef<HTMLElement[]>([])
  const [active, setActive] = useState('00')
  const [beat, setBeat] = useState(0)
  const [leader, setLeader] = useState(() => {
    if (window.location.hash.startsWith('#question-') || window.location.hash === '#transparency') return false
    try { return sessionStorage.getItem('vogel-assignment-leader') !== 'seen' } catch { return false }
  })

  const finishLeader = () => {
    try { sessionStorage.setItem('vogel-assignment-leader', 'seen') } catch { /* storage may be unavailable */ }
    setLeader(false)
  }

  useLayoutEffect(() => {
    let cancelled = false
    const frames: number[] = []

    const positionHash = () => {
      const hash = window.location.hash
      if (!hash.startsWith('#question-') && hash !== '#transparency') return
      const target = document.querySelector<HTMLElement>(hash)
      if (!target) return
      const navigator = document.querySelector<HTMLElement>('.assignment-nav')
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
        scene.style.setProperty('--question-progress', Math.min(1, Math.max(0, (progress + .13) / .153)).toFixed(4))
        scene.style.setProperty('--position-progress', Math.min(1, Math.max(0, (progress - .19) / .21)).toFixed(4))
        scene.style.setProperty('--rationale-progress', Math.min(1, Math.max(0, (progress - .43) / .22)).toFixed(4))
        scene.style.setProperty('--price-progress', Math.min(1, Math.max(0, (progress - .69) / .2)).toFixed(4))
        const sceneBeat = progress < .22 ? 0 : progress < .47 ? 1 : progress < .73 ? 2 : 3
        scene.dataset.beat = String(sceneBeat)
        const distance = Math.abs(rect.top + rect.height / 2 - viewport / 2)
        if (distance < closestDistance) {
          closest = scene
          closestDistance = distance
        }
      })
      const hero = document.getElementById('assignment-top')?.getBoundingClientRect()
      let resolvedActive = '00'
      let resolvedBeat = 0
      if (hero && hero.bottom > viewport * .35) {
        resolvedActive = '00'
      } else if (closest) {
        let current = closest as HTMLElement
        if (window.innerWidth <= 760) {
          const incoming = sceneRefs.current.find((scene) => {
            const top = scene.getBoundingClientRect().top
            return top > 0 && top < viewport * .72
          })
          if (incoming) current = incoming
        }
        resolvedActive = current.dataset.assignmentScene ?? '00'
        resolvedBeat = Number(current.dataset.beat ?? 0)
      } else if (window.scrollY < viewport * .65) {
        resolvedActive = '00'
      }
      const end = document.getElementById('transparency')?.getBoundingClientRect()
      if (end && end.top < viewport * .55) {
        resolvedActive = '09'
        resolvedBeat = 0
      }
      setActive(resolvedActive)
      setBeat(resolvedBeat)
      if (rootRef.current) {
        rootRef.current.dataset.scrolled = window.scrollY > 24 ? 'true' : 'false'
        rootRef.current.dataset.activeBeat = String(resolvedBeat)
        const chapterEntering = sceneRefs.current.some((scene) => {
          const top = scene.getBoundingClientRect().top
          return top > viewport - 145 && top < viewport
        })
        rootRef.current.dataset.sceneTransition = chapterEntering ? 'true' : 'false'
        const indicator = rootRef.current.querySelector<HTMLElement>('.assignment-continue')
        const indicatorRect = indicator?.getBoundingClientRect()
        const copyOverlaps = indicatorRect ? sceneRefs.current.some((scene) => (
          Array.from(scene.querySelectorAll<HTMLElement>('.scene-question-plane h2,.scene-position p,.scene-rationale p,.scene-price p'))
            .some((copy) => {
              const rect = copy.getBoundingClientRect()
              return rect.bottom > indicatorRect.top && rect.top < indicatorRect.bottom && rect.right > indicatorRect.left && rect.left < indicatorRect.right
            })
        )) : false
        rootRef.current.dataset.indicatorOverlap = copyOverlaps ? 'true' : 'false'
      }
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

  return <main className="assignment-app" id="assignment-content" ref={rootRef}>
    {leader && <FilmLeader onFinish={finishLeader} />}
    <a className="assignment-skip" href="#question-01">Zum ersten Kapitel springen</a>
    <GrainCanvas rootRef={rootRef} />
    <AssignmentNavigator active={active} beat={beat} />
    <ContinueIndicator active={active} beat={beat} />

    <section className="assignment-hero" id="assignment-top">
      <div className="assignment-gate" aria-hidden="true"><i /><i /></div>
      <div className="assignment-hero-meta"><span>VOGEL · ASSIGNMENT 2026</span><span>MARIO SCHUBERT</span></div>
      <div className="assignment-title-block">
        <p>THE DECISION FIELD</p>
        <h1><span>ACHT FRAGEN</span><i>/</i><span>ACHT ENTSCHEIDUNGEN</span></h1>
        <blockquote>Position ist kein Standbild.<br /><em>Sie entsteht in Bewegung.</em></blockquote>
      </div>
      <div className="assignment-hero-footer">
        <div><strong>Mario Schubert</strong><span>Acht Entscheidungen</span></div>
        <a className="assignment-download" href={PDF_PATH} download>PDF / Quiet Cut <span>↓</span></a>
        <a className="assignment-scroll" href="#question-01"><span className="scroll-transport" aria-hidden="true"><i /><i /><i /></span><b>Scrollen, um die Storyline zu starten</b><em aria-hidden="true">↓</em></a>
      </div>
    </section>

    <div className="assignment-sequence" aria-label="Acht Entscheidungsframes">
      {assignmentAnswers.map((answer, index) => <AssignmentScene
        answer={answer}
        register={(node) => { if (node) sceneRefs.current[index] = node }}
        key={answer.number}
      />)}
    </div>

    <section className="assignment-end" id="transparency">
      <div className="end-frame-index"><span>09</span><strong>END FRAME / TRANSPARENZ</strong></div>
      <div className="end-frame-copy">
        <p>OFFENLEGUNG</p>
        <h2>{aiDisclosure.question}</h2>
        <div className="end-answer"><span aria-hidden="true">AI</span><p>{aiDisclosure.answer}</p></div>
      </div>
      <blockquote>Positionen dürfen sich entwickeln.<br /><em>Verantwortung bleibt.</em></blockquote>
      <div className="assignment-end-actions">
        <a className="assignment-download assignment-download-end" href={PDF_PATH} download>PDF / Quiet Cut <span>↓</span></a>
      </div>
    </section>
  </main>
}
