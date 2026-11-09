import { useRef } from 'react'
import { SectionHead } from './ui'
import { ARTS, PaisleyBorder } from './Art'
import { gsap, useGSAP, reducedMotion } from '../lib/gsap'
import { threads } from '../config'

export default function Threads() {
  const ref = useRef(null)
  useGSAP(() => {
    if (reducedMotion()) return
    // cards deal out like postcards on a table, each with its own small tilt
    gsap.from('.thread-card', {
      y: 80, rotate: (i) => [-6, 4, -3, 5][i % 4], opacity: 0, duration: 1, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.grid-4', start: 'top 82%', once: true },
    })
  }, { scope: ref })
  return (
    <section className="section threads" id="threads" ref={ref} aria-labelledby="threads-title">
      <PaisleyBorder className="threads-border top" />
      <div className="container">
        <SectionHead title={threads.title} sub={threads.sub} id="threads-title" />
        <div className="grid-4">
          {threads.items.map((t) => {
            const Art = ARTS[t.art]
            return (
              <article className="thread-card" key={t.art}>
                <div className="thread-art"><Art /></div>
                <h3>{t.title}</h3>
                <span className="region">{t.place}</span>
                <p>{t.text}</p>
              </article>
            )
          })}
        </div>
      </div>
      <PaisleyBorder className="threads-border bottom" />
    </section>
  )
}
