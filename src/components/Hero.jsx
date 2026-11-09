import { useEffect, useRef, useState } from 'react'
import LottiePlayer from './LottiePlayer'
import { Mandala } from './Art'
import { SCENES } from './Scenes'
import { Icon, Photo } from './ui'
import { gsap, SplitText, ScrollTrigger, useGSAP, reducedMotion } from '../lib/gsap'
import { hero, destinations } from '../config'
import { photos } from '../config/images'

const sceneFor = (photoId) => SCENES[destinations.items.find((d) => d.id === photoId)?.scene]
const WIDE = "'wdth' 112"

export default function Hero() {
  const ref = useRef(null)
  // Only the first arch photo is in the prerendered HTML (fast first paint); the rest load just after.
  const [more, setMore] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setMore(true), 700)
    return () => clearTimeout(t)
  }, [])

  useGSAP(() => {
    const q = gsap.utils.selector(ref)
    const words = q('.word')
    const caps = q('.cap')
    if (reducedMotion()) return

    // ── 1. Page-load sequence ─────────────────────────────
    const lines = SplitText.create(q('.ht-line'), { type: 'words', mask: 'words' })
    const chars = words.map((w) => SplitText.create(w, { type: 'chars', mask: 'chars' }))
    const intro = gsap.timeline({ defaults: { ease: 'power4.out' } })
    intro
      .from(q('.arch-frame'), { clipPath: 'inset(100% 0% 0% 0% round 50% 50% 28px 28px)', duration: 1.3, ease: 'expo.inOut' }, 0)
      .from(q('.arch-img[data-i="0"]'), { scale: 1.25, duration: 1.8, ease: 'power3.out' }, 0.2)
      .from(q('.mandala-wrap'), { opacity: 0, scale: 0.7, rotate: -40, duration: 2 }, 0.1)
      .from(lines.words, { yPercent: 110, duration: 1, stagger: 0.05 }, 0.25)
      .from(chars[0].chars, { yPercent: 110, fontVariationSettings: "'wdth' 40", duration: 1.1, stagger: 0.04 }, 0.45)
      .from(q('.hero-lede, .cta-row, .arch-caption'), { opacity: 0, y: 22, duration: 0.9, stagger: 0.1, ease: 'power3.out' }, 0.75)
      .from(q('.hero-bird'), { xPercent: -160, yPercent: 60, rotate: 14, opacity: 0, duration: 2, ease: 'power2.out' }, 0.5)

    // ── 2. Word + arch photo change together; widths are reserved, so nothing shifts ──
    let i = 0
    let z = 2
    const cycle = () => {
      const next = (i + 1) % words.length
      const img = q(`.arch-img[data-i="${next}"]`)[0]
      const tl = gsap.timeline()
      tl.to(chars[i].chars, { yPercent: -110, duration: 0.45, stagger: 0.025, ease: 'power2.in' })
        .set(words[i], { autoAlpha: 0 })
        .set(words[next], { autoAlpha: 1 })
        .fromTo(chars[next].chars,
          { yPercent: 110, fontVariationSettings: "'wdth' 40" },
          { yPercent: 0, fontVariationSettings: WIDE, duration: 0.8, stagger: 0.035, ease: 'power3.out' })
        .to(caps[i], { autoAlpha: 0, y: -8, duration: 0.3 }, 0.2)
        .fromTo(caps[next], { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4 }, 0.55)
      if (img) {
        gsap.set(img, { zIndex: ++z, autoAlpha: 1 })
        tl.fromTo(img,
          { clipPath: 'inset(100% 0% 0% 0%)' },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15, ease: 'power3.inOut' }, 0.15)
          .fromTo(img.querySelector('img, svg'), { scale: 1.2 }, { scale: 1, duration: 1.6, ease: 'power3.out' }, 0.15)
      }
      i = next
    }
    const timer = gsap.delayedCall(3, function loop() { cycle(); timer.restart(true) })
    timer.pause()
    intro.eventCallback('onComplete', () => timer.restart(true))

    // pause the cycle while the hero is off screen
    ScrollTrigger.create({ trigger: ref.current, start: 'top bottom', end: 'bottom top', onToggle: (s) => (s.isActive ? timer.resume() : timer.pause()) })

    // ── 3. Scroll away: the bird flies off, the arch drifts up ──
    const out = gsap.timeline({ scrollTrigger: { trigger: ref.current, start: 'top top', end: 'bottom top', scrub: 0.6 } })
    out.to(q('.hero-bird-fly'), { x: '42vw', y: '-38vh', rotate: -16, scale: 0.6, ease: 'power1.in' }, 0)
      .to(q('.arch-frame-wrap'), { y: -70, ease: 'none' }, 0)
      .to(q('.mandala-wrap'), { rotate: 50, ease: 'none' }, 0)
      .to(q('.hero-copy'), { y: -50, opacity: 0.25, ease: 'none' }, 0)
  }, { scope: ref })

  return (
    <section className="hero" id="top" ref={ref} aria-labelledby="hero-title">
      <div className="container hero-grid">
        <div className="hero-copy">
          <p className="hero-hindi" lang="hi">उड़ान · udaan, flight</p>
          <h1 id="hero-title" className="hero-title">
            <span className="sr-only">{hero.before} India, {hero.after}</span>
            <span className="ht" aria-hidden="true">
              <span className="ht-line">{hero.before}</span>
              <span className="word-slot">
                {hero.words.map((w, i) => (
                  <span key={w.word} className="word" style={i ? { visibility: 'hidden', opacity: 0 } : undefined}>{w.word}</span>
                ))}
              </span>
              <span className="ht-line">{hero.after}</span>
            </span>
          </h1>
          <p className="lede hero-lede">{hero.sub}</p>
          <div className="cta-row">
            <a className="btn btn-primary" href={hero.primary.href} target="_blank" rel="noopener">{Icon.insta} {hero.primary.label}</a>
            <a className="btn btn-ghost" href={hero.secondary.href}>{hero.secondary.label}</a>
          </div>
        </div>

        <div className="hero-art">
          <div className="mandala-wrap"><Mandala className="hero-mandala" size={560} /></div>
          <figure className="arch-frame-wrap">
            <div className="arch-frame">
              {hero.words.map((w, i) => {
                if (i > 0 && !more) return null
                const Scene = sceneFor(w.photo)
                return (
                  <div key={w.photo} className="arch-img" data-i={i} style={i ? { visibility: 'hidden' } : { zIndex: 2 }}>
                    <Photo id={w.photo} ratio={1.25} eager={i === 0} sizes="(max-width: 860px) 80vw, 420px" fallback={Scene ? <Scene /> : null} />
                  </div>
                )
              })}
            </div>
            <figcaption className="arch-caption">
              {hero.words.map((w, i) => {
                const p = photos[w.photo]
                return (
                  <span key={w.photo} className="cap" style={i ? { visibility: 'hidden', opacity: 0 } : undefined}>
                    {Icon.pin} {p?.caption}
                    {p && <a href={p.page} target="_blank" rel="noopener" tabIndex={i ? -1 : 0}>Photo: {p.by}</a>}
                  </span>
                )
              })}
            </figcaption>
          </figure>
          <div className="hero-bird-fly"><LottiePlayer id="hero" className="hero-bird" /></div>
        </div>
      </div>
    </section>
  )
}
