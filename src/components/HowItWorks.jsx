import { useRef } from 'react'
import { Icon, SectionHead } from './ui'
import { gsap, useGSAP } from '../lib/gsap'
import { how, site } from '../config'

// Flight path above the three steps (desktop). It dips to each step number (at 1/6, 1/2 and 5/6 of the width).
const PATH = 'M10 40 C 90 40, 110 190, 167 190 C 224 190, 276 30, 333 30 C 390 30, 443 190, 500 190 C 557 190, 610 30, 667 30 C 724 30, 776 190, 833 190 C 890 190, 930 40, 990 40'

/** Explains where stories go: they are posted on Instagram, not on this website. */
export default function HowItWorks() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(ref)
      const path = q('.how-path-line')[0]
      const len = path.getTotalLength()
      const tl = gsap.timeline({ scrollTrigger: { trigger: q('.how-flight')[0], start: 'top 75%', end: 'bottom 45%', scrub: 0.8 } })
      tl.fromTo(path, { strokeDashoffset: len }, { strokeDashoffset: 0, ease: 'none' }, 0)
        .to(q('.how-bird')[0], { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], autoRotate: true }, ease: 'none' }, 0)
      gsap.set(path, { strokeDasharray: len })
      gsap.from(q('.how-step'), {
        y: 50, opacity: 0, duration: 0.9, stagger: 0.18, ease: 'power3.out',
        scrollTrigger: { trigger: q('.how-steps')[0], start: 'top 80%', once: true },
      })
    })
  }, { scope: ref })

  return (
    <section className="section how" id="how" ref={ref} aria-labelledby="how-title">
      <div className="container">
        <SectionHead title={how.title} sub={how.sub} id="how-title" />
        <div className="how-flight">
          <svg className="how-path" viewBox="0 0 1000 220" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
            <path className="how-path-dots" d={PATH} />
            <path className="how-path-line" d={PATH} />
            <g className="how-bird">
              <path d="M-16 2C-10 1 -6 -3 -3 -8C-2 -2 0 0 3 1C7 -2 11 -3 14 -2C10 0 7 3 5 7C1 8 -4 7 -7 4C-10 5 -13 4 -16 2Z" />
            </g>
          </svg>
          <ol className="how-steps">
            {how.steps.map((s, i) => (
              <li className="how-step" key={s.title}>
                <span className="how-num" aria-hidden="true">{i + 1}</span>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
        <div className="how-cta">
          <a className="btn btn-primary" href={site.instagram} target="_blank" rel="noopener">{Icon.insta} See the stories on {site.handle}</a>
        </div>
      </div>
    </section>
  )
}
