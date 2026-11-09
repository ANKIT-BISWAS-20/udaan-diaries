import { useRef } from 'react'
import { SCENES } from './Scenes'
import { Icon, Photo, SectionHead } from './ui'
import { gsap, useGSAP } from '../lib/gsap'
import { destinations } from '../config'

function Postcard({ item }) {
  const Scene = SCENES[item.scene]
  return (
    <article className="postcard" aria-labelledby={`d-${item.id}`}>
      <div className="postcard-art arch">
        <Photo id={item.id} ratio={1.3} sizes="(max-width: 860px) 78vw, 380px" className="pc-img" fallback={Scene ? <Scene /> : <div className="pc-blank" />} />
      </div>
      <div className="postcard-body">
        <span className="region">{Icon.pin} {item.region}</span>
        <h3 id={`d-${item.id}`}>{item.title}</h3>
        <p>{item.vibe}</p>
        <ul className="tags" aria-label="Good for">{item.tags.map((t) => <li key={t}>{t}</li>)}</ul>
      </div>
    </article>
  )
}

/**
 * Destinations as a sideways journey. On wide screens the section pins and vertical scrolling moves
 * the postcards left, while a little bird travels the dotted route below. On phones it's a swipeable row.
 */
export default function Destinations() {
  const ref = useRef(null)
  useGSAP(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 861px) and (prefers-reduced-motion: no-preference)', () => {
      const q = gsap.utils.selector(ref)
      const track = q('.journey-track')[0]
      const distance = () => track.scrollWidth - window.innerWidth
      const move = gsap.to(track, {
        x: () => -distance(),
        ease: 'none',
        scrollTrigger: {
          trigger: q('.journey-pin')[0],
          pin: true,
          scrub: 0.8,
          start: 'top top',
          end: () => `+=${distance()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })
      // route progress + the bird riding it
      gsap.to(q('.route-fill'), { scaleX: 1, ease: 'none', scrollTrigger: { trigger: q('.journey-pin')[0], start: 'top top', end: () => `+=${distance()}`, scrub: 0.8 } })
      gsap.fromTo(q('.route-bird'), { left: '0%' }, { left: '100%', ease: 'none', scrollTrigger: { trigger: q('.journey-pin')[0], start: 'top top', end: () => `+=${distance()}`, scrub: 0.8 } })

      // card text rises in as the section arrives (not tied to the sideways scroll, so the first cards are never blank)
      gsap.from(q('.postcard-body'), {
        y: 36, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out',
        scrollTrigger: { trigger: ref.current, start: 'top 65%', once: true },
      })

      // each photo drifts inside its arch as it crosses the screen
      q('.postcard').forEach((card) => {
        const img = card.querySelector('.pc-img, .scene')
        if (img) {
          gsap.fromTo(img, { xPercent: -9, scale: 1.18 }, {
            xPercent: 9, scale: 1.18, ease: 'none',
            scrollTrigger: { trigger: card, containerAnimation: move, start: 'left right', end: 'right left', scrub: true },
          })
        }
      })
    })
  }, { scope: ref })

  return (
    <section className="journey" id="destinations" ref={ref} aria-labelledby="destinations-title">
      <div className="journey-pin">
        <div className="journey-track">
          <div className="journey-intro">
            <SectionHead title={destinations.title} sub={destinations.sub} id="destinations-title">
              <span className="scroll-hint" aria-hidden="true">Keep scrolling {Icon.arrow}</span>
            </SectionHead>
          </div>
          {destinations.items.map((d) => <Postcard key={d.id} item={d} />)}
          <div className="journey-end">
            <h3>{destinations.endTitle}</h3>
            <p>{destinations.endText}</p>
            <a className="btn btn-primary" href="#share">Share your story</a>
          </div>
        </div>
        <div className="journey-route container" aria-hidden="true">
          <span className="route-line"><span className="route-fill" /></span>
          <span className="route-bird">
            <svg viewBox="0 0 64 40" width="34" height="22"><path d="M2 22C14 20 22 12 28 2C30 14 34 18 40 20C48 14 56 12 62 14C54 18 48 24 44 32C36 34 26 32 20 26C14 28 8 26 2 22Z" /></svg>
          </span>
        </div>
      </div>
    </section>
  )
}
