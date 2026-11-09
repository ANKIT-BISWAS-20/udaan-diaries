// One place to register GSAP plugins (all free since GSAP 3.13). Safe to import during prerender.
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ScrollSmoother } from 'gsap/ScrollSmoother'
import { SplitText } from 'gsap/SplitText'
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'
import { useGSAP } from '@gsap/react'

export const isBrowser = typeof window !== 'undefined'
if (isBrowser) gsap.registerPlugin(ScrollTrigger, ScrollSmoother, SplitText, MotionPathPlugin, useGSAP)

export { gsap, ScrollTrigger, ScrollSmoother, SplitText, MotionPathPlugin, useGSAP }

export const reducedMotion = () => isBrowser && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export const EASE = 'power3.out'
export const NAV_OFFSET = 76

/** Scrolls to an in-page anchor, through ScrollSmoother when it's running. */
export function scrollToHash(hash, instant = false) {
  if (!isBrowser || !hash || hash === '#') return
  const target = hash === '#top' ? document.body : document.querySelector(hash)
  if (!target) return
  const smoother = ScrollSmoother.get()
  if (smoother) smoother.scrollTo(target === document.body ? 0 : target, !instant, `top ${NAV_OFFSET}px`)
  else if (target === document.body) window.scrollTo({ top: 0, behavior: instant ? 'auto' : 'smooth' })
  else window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET, behavior: instant ? 'auto' : 'smooth' })
}
