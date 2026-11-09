import { useEffect } from 'react'
import { useTheme } from './useTheme'
import { ScrollProgress, Icon } from './components/ui'
import Nav from './components/Nav'
import Hero from './components/Hero'
import Marquee from './components/Marquee'
import Destinations from './components/Destinations'
import Threads from './components/Threads'
import HowItWorks from './components/HowItWorks'
import ShareStory from './components/ShareStory'
import { Brand } from './components/Logo'
import { site, nav, animations, animationCache } from './config'
import { photos } from './config/images'
import { preloadLottie } from './lib/lottie'
import { ScrollSmoother, ScrollTrigger, useGSAP, reducedMotion, scrollToHash, gsap } from './lib/gsap'

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-top">
          <Brand size={48} />
          <nav className="footer-links" aria-label="Footer">
            {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
            <a href={site.instagram} target="_blank" rel="noopener">Instagram</a>
          </nav>
        </div>
        <a className="footer-word" href={site.instagram} target="_blank" rel="noopener" aria-label={`Follow ${site.handle} on Instagram`}>
          {Icon.insta}<span>{site.handle}</span>
        </a>
        <p className="credits">
          © {new Date().getFullYear()} {site.name}. Illustrations drawn for Udaan Diaries. Photos on Unsplash by{' '}
          {Object.values(photos).map((p, i, all) => (
            <span key={p.page}><a href={p.page} target="_blank" rel="noopener">{p.by}</a>{i < all.length - 2 ? ', ' : i === all.length - 2 ? ' and ' : '.'}</span>
          ))}
        </p>
      </div>
    </footer>
  )
}

/**
 * Smooth scrolling + in-page links. Rendered first so ScrollSmoother exists before any section
 * creates its ScrollTriggers (effects run in tree order).
 */
function SmoothScroll() {
  useGSAP(() => {
    if (!reducedMotion()) {
      ScrollSmoother.create({ wrapper: '#smooth-wrapper', content: '#smooth-content', smooth: 1.1, effects: true, smoothTouch: false })
    }
    const onClick = (e) => {
      const a = e.target.closest('a[href^="#"]')
      if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey) return
      const hash = a.getAttribute('href')
      if (hash.length < 2) return
      e.preventDefault()
      scrollToHash(hash)
      history.replaceState(null, '', hash === '#top' ? location.pathname : hash)
    }
    document.addEventListener('click', onClick)
    // arriving on a #section link: wait for pins to add their height, then jump
    if (location.hash) gsap.delayedCall(0.5, () => scrollToHash(location.hash, true))
    document.fonts?.ready.then(() => ScrollTrigger.refresh())
    return () => document.removeEventListener('click', onClick)
  })
  return null
}

export default function App() {
  const { theme, toggleTheme, palette, setPalette } = useTheme()

  useEffect(() => {
    if (animationCache.preload) preloadLottie(Object.values(animations).map((a) => a.url))
  }, [])

  return (
    <>
      <SmoothScroll />
      <a className="skip" href="#main">Skip to content</a>
      <ScrollProgress />
      <Nav theme={theme} toggleTheme={toggleTheme} palette={palette} setPalette={setPalette} />
      <div id="smooth-wrapper">
        <div id="smooth-content">
          <main id="main">
            <Hero />
            <Marquee />
            <Destinations />
            <Threads />
            <HowItWorks />
            <ShareStory />
          </main>
          <Footer />
        </div>
      </div>
    </>
  )
}
