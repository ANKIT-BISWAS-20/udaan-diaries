import { useId } from 'react'
import { site } from '../config'

/**
 * Udaan mark: a jharokha (Mughal cusped arch) window with a bird taking flight inside it.
 * Colours follow the live theme (--accent / --accent-2), so the palette picker re-colours the logo too.
 */
export default function Logo({ size = 40, className = '' }) {
  const gid = useId().replace(/:/g, '')
  return (
    <svg className={`logo-mark ${className}`} width={size} height={size} viewBox="0 0 64 64" role="img" aria-label="Udaan Diaries logo">
      <defs>
        <linearGradient id={gid} x1="8" y1="4" x2="56" y2="62" gradientUnits="userSpaceOnUse">
          <stop offset="0" style={{ stopColor: 'var(--accent)' }} />
          <stop offset="1" style={{ stopColor: 'var(--accent-2)' }} />
        </linearGradient>
      </defs>
      <path d="M7 61V31C7 21 17 17 24 12C28 9 30 6 32 2C34 6 36 9 40 12C47 17 57 21 57 31V61Z" fill={`url(#${gid})`} />
      <circle cx="32" cy="17" r="3.2" fill="none" stroke="#FFF8EC" strokeWidth="1.6" />
      <g className="logo-bird">
        <path d="M32 40C25 39 18 34 14 24C22 24 29 29 32 40Z" fill="#FFF8EC" />
        <path d="M32 40C39 39 46 34 50 24C42 24 35 29 32 40Z" fill="#FFF8EC" />
        <path d="M19 28C22 29 25 32 28 36" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        <path d="M45 28C42 29 39 32 36 36" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" opacity="0.55" />
        <path d="M32 33C30 38 30 44 32 50C34 44 34 38 32 33Z" fill="#FFF8EC" />
        <circle cx="32" cy="31" r="2.6" fill="#FFF8EC" />
      </g>
      {[18, 25, 32, 39, 46].map((x) => <circle key={x} cx={x} cy="56" r="1.5" fill="#FFF8EC" opacity="0.9" />)}
    </svg>
  )
}

/** Mark + wordmark for the navbar and footer. */
export function Brand({ size = 40 }) {
  const [first, second] = site.name.split(' ')
  return (
    <span className="brand-lockup">
      <Logo size={size} />
      <span className="brand-words">
        <span className="brand-name">{first}</span>
        <span className="brand-sub">{second}</span>
      </span>
    </span>
  )
}
