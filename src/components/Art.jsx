import { useId } from 'react'

// ─── Folk-art building blocks, all original SVG (nothing to license) ─────────────────────────────

/** Paisley (buta / kairi): the teardrop motif of block prints and Kashmir shawls. */
export const PAISLEY = 'M20 3C34 3 41 17 35 31C29 45 12 48 6 37C14 40 23 35 23 26C23 18 12 15 20 3Z'

const petalPath = (w, l) => `M0 0C${-w} ${-l * 0.26} ${-w * 0.78} ${-l * 0.68} 0 ${-l}C${w * 0.78} ${-l * 0.68} ${w} ${-l * 0.26} 0 0Z`

/** Repeating paisley + dot band used as a section divider (Rajasthani border style). */
export function PaisleyBorder({ className = '' }) {
  const id = useId().replace(/:/g, '')
  return (
    <svg className={`border-band ${className}`} width="100%" height="34" aria-hidden="true">
      <defs>
        <pattern id={id} width="64" height="34" patternUnits="userSpaceOnUse">
          <path d={PAISLEY} transform="translate(2 -2) scale(.78)" style={{ fill: 'var(--accent)' }} />
          <circle cx="30" cy="17" r="2.2" style={{ fill: 'var(--accent-2)' }} />
          <path d={PAISLEY} transform="translate(64 34) rotate(180) translate(2 -2) scale(.78)" style={{ fill: 'var(--accent-2)' }} />
          <circle cx="2" cy="17" r="1.6" style={{ fill: 'var(--accent)' }} />
        </pattern>
      </defs>
      <rect width="100%" height="34" fill={`url(#${id})`} />
    </svg>
  )
}

/** Mandala: rings of petals and dots, drawn from maths. Spins slowly via CSS. */
export function Mandala({ size = 520, className = '' }) {
  const ring = (n, w, l, r, opacity, fillVar) =>
    Array.from({ length: n }, (_, i) => (
      <path
        key={`${n}-${r}-${i}`}
        d={petalPath(w, l)}
        transform={`rotate(${(360 / n) * i}) translate(0 ${-r})`}
        style={{ fill: fillVar }}
        opacity={opacity}
      />
    ))
  const dots = (n, r, d, fillVar) =>
    Array.from({ length: n }, (_, i) => {
      const a = (Math.PI * 2 * i) / n
      return <circle key={`d${n}-${r}-${i}`} cx={Math.cos(a) * r} cy={Math.sin(a) * r} r={d} style={{ fill: fillVar }} />
    })
  return (
    <svg className={`mandala ${className}`} width={size} height={size} viewBox="-200 -200 400 400" aria-hidden="true">
      <circle r="196" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="1" strokeDasharray="2 7" />
      {ring(24, 9, 40, 150, 0.9, 'var(--accent-2)')}
      {dots(48, 186, 2.2, 'var(--accent)')}
      {ring(16, 14, 62, 88, 0.85, 'var(--accent)')}
      {dots(32, 142, 2, 'var(--accent-2)')}
      {ring(12, 12, 46, 36, 0.95, 'var(--accent-2)')}
      <circle r="18" style={{ fill: 'var(--accent)' }} />
      <circle r="8" style={{ fill: 'var(--bg)' }} />
    </svg>
  )
}

// ─── The four folk-art tiles for "Threads of India" ─────────────────────────────────────────────

const Frame = ({ children, label }) => (
  <svg viewBox="0 0 240 180" className="art-tile" role="img" aria-label={label}>
    <rect width="240" height="180" style={{ fill: 'var(--bg2)' }} />
    {children}
  </svg>
)

/** Madhubani: a fish in bold double line with cross-hatching, peacock-feather eye, and a dotted border. */
export function Madhubani() {
  const dots = Array.from({ length: 30 }, (_, i) => <circle key={i} cx={10 + i * 7.6} cy="9" r="1.6" style={{ fill: 'var(--accent)' }} />)
  const dots2 = Array.from({ length: 30 }, (_, i) => <circle key={i} cx={10 + i * 7.6} cy="171" r="1.6" style={{ fill: 'var(--accent)' }} />)
  const hatch = Array.from({ length: 9 }, (_, i) => (
    <path key={i} d={`M${86 + i * 11} 66L${72 + i * 11} 114`} style={{ stroke: 'var(--fg)' }} strokeWidth="1.6" opacity=".55" />
  ))
  return (
    <Frame label="Madhubani fish painting">
      {dots}{dots2}
      <rect x="6" y="18" width="228" height="144" rx="8" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="3" />
      <rect x="12" y="24" width="216" height="132" rx="6" fill="none" style={{ stroke: 'var(--accent-2)' }} strokeWidth="1.6" />
      <path d="M52 90C76 52 124 50 158 78C170 66 184 62 198 62C192 76 192 104 198 118C184 118 170 114 158 102C124 130 76 128 52 90Z" style={{ fill: 'var(--accent-2)', stroke: 'var(--fg)' }} strokeWidth="3" strokeLinejoin="round" />
      <clipPath id="mb-clip"><path d="M52 90C76 52 124 50 158 78C170 66 184 62 198 62C192 76 192 104 198 118C184 118 170 114 158 102C124 130 76 128 52 90Z" /></clipPath>
      <g clipPath="url(#mb-clip)">{hatch}</g>
      <circle cx="78" cy="88" r="9" style={{ fill: 'var(--card)', stroke: 'var(--fg)' }} strokeWidth="2.6" />
      <circle cx="78" cy="88" r="3.4" style={{ fill: 'var(--accent)' }} />
      <path d="M170 90h22" style={{ stroke: 'var(--accent)' }} strokeWidth="4" strokeLinecap="round" />
      <path d="M116 56C120 44 130 40 136 46M112 124C118 136 130 138 136 132" fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="3" strokeLinecap="round" />
    </Frame>
  )
}

/** Warli: white stick-figure dancers circling a sun, on red earth. */
export function Warli() {
  const n = 9
  const figs = Array.from({ length: n }, (_, i) => {
    const a = (360 / n) * i
    return (
      <g key={i} transform={`translate(120 90) rotate(${a}) translate(0 -58)`}>
        <circle cy="-13" r="4.4" />
        <path d="M-7 -8H7L0 3ZM-7 12H7L0 1Z" />
        <path d="M-6 -4L-15 -12M6 -4L15 -12M-3 12L-5 22M3 12L5 22" fill="none" stroke="#FFF8EC" strokeWidth="2" strokeLinecap="round" />
      </g>
    )
  })
  return (
    <svg viewBox="0 0 240 180" className="art-tile" role="img" aria-label="Warli dancers in a circle">
      <rect width="240" height="180" fill="#9C3D1F" />
      <g fill="#FFF8EC">{figs}</g>
      <circle cx="120" cy="90" r="17" fill="none" stroke="#FFF8EC" strokeWidth="2.6" />
      <path d="M120 66v-8M120 114v8M96 90h-8M144 90h8M103 73l-6-6M137 107l6 6M137 73l6-6M103 107l-6 6" stroke="#FFF8EC" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 168h30l8-14 8 14h30M170 168h30l8-14 8 14h14" fill="none" stroke="#FFF8EC" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity=".8" />
    </svg>
  )
}

/** Kolam: a pulli (dot) grid wrapped by a single looping line. */
export function Kolam() {
  const dots = []
  const rows = [1, 3, 5, 7, 5, 3, 1]
  rows.forEach((count, r) => {
    for (let c = 0; c < count; c++) {
      dots.push(<circle key={`${r}-${c}`} cx={120 + (c - (count - 1) / 2) * 24} cy={22 + r * 22.5} r="2.6" style={{ fill: 'var(--fg)' }} />)
    }
  })
  return (
    <Frame label="Kolam dot pattern">
      <path
        d="M120 14C150 22 150 44 120 52C90 44 90 22 120 14ZM120 128C150 136 150 158 120 166C90 158 90 136 120 128ZM60 90C68 60 90 60 98 90C90 120 68 120 60 90ZM142 90C150 60 172 60 180 90C172 120 150 120 142 90ZM98 52C112 62 128 62 142 52M98 128C112 118 128 118 142 128M98 52C86 60 80 74 98 90M142 52C154 60 160 74 142 90M98 128C86 120 80 106 98 90M142 128C154 120 160 106 142 90"
        fill="none" style={{ stroke: 'var(--accent)' }} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round"
      />
      {dots}
    </Frame>
  )
}

/** Block print: a diamond lattice of buta motifs, like an Ajrakh / Bagru cloth. */
export function BlockPrint() {
  const cells = []
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 4; c++) {
      const off = r % 2 ? 30 : 0
      cells.push(
        <g key={`${r}-${c}`} transform={`translate(${14 + c * 60 + off - (r % 2 ? 0 : 0)} ${14 + r * 52}) scale(.95)`}>
          <path d={PAISLEY} style={{ fill: (r + c) % 2 ? 'var(--accent)' : 'var(--accent-2)' }} />
          <circle cx="22" cy="24" r="3.2" style={{ fill: 'var(--bg2)' }} />
        </g>,
      )
    }
  }
  return (
    <Frame label="Block-print paisley pattern">
      <clipPath id="bp-clip"><rect x="6" y="6" width="228" height="168" rx="6" /></clipPath>
      <g clipPath="url(#bp-clip)">{cells}</g>
      <rect x="6" y="6" width="228" height="168" rx="6" fill="none" style={{ stroke: 'var(--fg)' }} strokeWidth="2.4" opacity=".7" />
    </Frame>
  )
}

export const ARTS = { madhubani: Madhubani, warli: Warli, kolam: Kolam, blockprint: BlockPrint }
