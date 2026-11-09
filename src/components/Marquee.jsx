import { useRef } from 'react'
import { gsap, ScrollTrigger, useGSAP, reducedMotion } from '../lib/gsap'
import { places } from '../config'

/** Endless strip of place names. Speeds up and flips direction with your scroll. */
export default function Marquee() {
  const ref = useRef(null)
  const row = [...places, ...places]
  useGSAP(() => {
    if (reducedMotion()) return
    const loop = gsap.to(ref.current.querySelector('.marquee-track'), { xPercent: -50, duration: 40, ease: 'none', repeat: -1 })
    let dir = 1
    ScrollTrigger.create({
      onUpdate: (self) => {
        dir = self.direction
        gsap.to(loop, { timeScale: dir * Math.min(6, 1 + Math.abs(self.getVelocity()) / 250), duration: 0.2, overwrite: true })
        gsap.to(loop, { timeScale: dir, duration: 1.2, delay: 0.25, overwrite: false })
      },
    })
  }, { scope: ref })
  return (
    <div className="marquee" aria-hidden="true" ref={ref}>
      <div className="marquee-track">
        {row.map((p, i) => (
          <span key={i} className="marquee-item">
            {p}
            <svg width="18" height="18" viewBox="0 0 40 48"><path d="M20 3C34 3 41 17 35 31C29 45 12 48 6 37C14 40 23 35 23 26C23 18 12 15 20 3Z" /></svg>
          </span>
        ))}
      </div>
    </div>
  )
}
