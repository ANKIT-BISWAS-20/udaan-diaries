import { useRef, useState } from 'react'
import { gsap, SplitText, ScrollTrigger, useGSAP, reducedMotion } from '../lib/gsap'
import { photos, photoSet } from '../config/images'

/**
 * Section heading. The title rises line by line out of a mask the first time it scrolls into view.
 * The text is in the HTML from the start (prerendered), so search engines and screen readers get it as-is.
 */
export function SectionHead({ title, sub, children, className = '', as: H = 'h2', id }) {
  const ref = useRef(null)
  useGSAP(() => {
    if (reducedMotion()) return
    const el = ref.current
    SplitText.create(el.querySelector('.sh-title'), {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (self) => gsap.from(self.lines, {
        yPercent: 105, duration: 0.9, stagger: 0.09, ease: 'power4.out',
        scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      }),
    })
    const sub = el.querySelector('.lede')
    if (sub) gsap.from(sub, { opacity: 0, y: 16, duration: 0.8, delay: 0.25, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 85%', once: true } })
  }, { scope: ref })
  return (
    <div className={`section-head ${className}`} ref={ref}>
      <H className="display sh-title" id={id}>{title}</H>
      {sub && <p className="lede">{sub}</p>}
      {children}
    </div>
  )
}

/** Thin saffron progress bar at the top of the page, driven by ScrollTrigger. */
export function ScrollProgress() {
  const ref = useRef(null)
  useGSAP(() => {
    gsap.to(ref.current, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } })
  })
  return <div className="scroll-progress" ref={ref} aria-hidden="true" />
}

/**
 * A stock photo with responsive sizes. Falls back to `fallback` (an illustration) if it can't load.
 * ratio = height / width of the frame, so Unsplash crops to fit and nothing shifts while loading.
 */
export function Photo({ id, ratio = 1.25, sizes = '100vw', fallback = null, eager = false, className = '', alt }) {
  const [broken, setBroken] = useState(false)
  const p = photos[id]
  if (!p || broken) return fallback
  return (
    <img
      className={className}
      {...photoSet(id, ratio)}
      sizes={sizes}
      alt={alt ?? p.alt}
      width={800}
      height={Math.round(800 * ratio)}
      loading={eager ? 'eager' : 'lazy'}
      {...(eager ? { fetchpriority: 'high' } : {})}
      decoding="async"
      draggable="false"
      onError={() => setBroken(true)}
      onLoad={() => ScrollTrigger.refresh?.()}
    />
  )
}

export const Icon = {
  sun: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="4.2" /><path d="M12 2.5v2.4M12 19.1v2.4M2.5 12h2.4M19.1 12h2.4M5.3 5.3l1.7 1.7M17 17l1.7 1.7M5.3 18.7L7 17M17 7l1.7-1.7" /></svg>
  ),
  moon: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.8 6.8 0 0 0 10.5 10.5Z" /></svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.4 0 2-1 1.6-2-.5-1.3.3-2.5 1.7-2.5H17a4 4 0 0 0 4-4C21 7 17 3 12 3Z" /><circle cx="7.6" cy="11" r="1" fill="currentColor" /><circle cx="10.5" cy="7.4" r="1" fill="currentColor" /><circle cx="15" cy="7.8" r="1" fill="currentColor" /></svg>
  ),
  insta: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.2" cy="6.8" r="1" fill="currentColor" /></svg>
  ),
  menu: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M4 7h16M4 12h16M4 17h16" /></svg>
  ),
  close: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.4-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" /></svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" /><circle cx="12" cy="9.5" r="2.4" /></svg>
  ),
  arrow: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="3" /><circle cx="9" cy="10" r="1.8" /><path d="M21 16l-5-5-8 8" /></svg>
  ),
}
