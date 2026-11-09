import { useEffect, useRef, useState } from 'react'
import { Brand } from './Logo'
import { Icon } from './ui'
import { nav, site, theme as themeCfg } from '../config'

function PalettePicker({ palette, setPalette }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)
  useEffect(() => {
    if (!open) return
    const off = (e) => ref.current && !ref.current.contains(e.target) && setOpen(false)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('pointerdown', off)
    document.addEventListener('keydown', esc)
    return () => {
      document.removeEventListener('pointerdown', off)
      document.removeEventListener('keydown', esc)
    }
  }, [open])
  return (
    <div className="palette" ref={ref}>
      <button className="icon-btn" aria-label="Change colour theme" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
        {Icon.palette}
      </button>
      <ul className={`palette-menu ${open ? 'open' : ''}`} hidden={!open}>
        {Object.entries(themeCfg.palettes).map(([id, p]) => (
          <li key={id}>
            <button className={`palette-opt ${id === palette ? 'on' : ''}`} onClick={() => { setPalette(id); setOpen(false) }}>
              <span className="swatch" style={{ background: `linear-gradient(135deg, ${p.swatch} 50%, ${p.swatch2} 50%)` }} />
              {p.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function Nav({ theme, toggleTheme, palette, setPalette }) {
  const [open, setOpen] = useState(false)
  const [stuck, setStuck] = useState(false)
  useEffect(() => {
    const on = () => setStuck(window.scrollY > 24)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    if (open) document.addEventListener('keydown', esc)
    return () => document.removeEventListener('keydown', esc)
  }, [open])

  return (
    <header className={`nav ${stuck ? 'stuck' : ''}`}>
      <div className="container nav-inner">
        <a href="#top" className="brand" aria-label={`${site.name}, back to top`}><Brand size={42} /></a>
        <nav className="nav-links" aria-label="Main">
          {nav.map((n) => <a key={n.href} href={n.href}>{n.label}</a>)}
        </nav>
        <div className="nav-actions">
          <PalettePicker palette={palette} setPalette={setPalette} />
          <button className="icon-btn" aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} onClick={toggleTheme}>
            {theme === 'dark' ? Icon.sun : Icon.moon}
          </button>
          <a className="icon-btn hide-sm" href={site.instagram} target="_blank" rel="noopener" aria-label="Udaan Diaries on Instagram">{Icon.insta}</a>
          <button className="icon-btn menu-btn" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} aria-controls="mobile-menu" onClick={() => setOpen((o) => !o)}>
            {open ? Icon.close : Icon.menu}
          </button>
        </div>
      </div>
      <div id="mobile-menu" className={`mobile-menu ${open ? 'open' : ''}`} hidden={!open}>
        {nav.map((n, i) => (
          <a key={n.href} href={n.href} onClick={() => setOpen(false)} style={{ '--i': i }}>{n.label}</a>
        ))}
        <a className="btn btn-primary" href={site.instagram} target="_blank" rel="noopener">{Icon.insta} {site.handle}</a>
      </div>
    </header>
  )
}
