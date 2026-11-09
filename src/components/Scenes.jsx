// Six illustrated "postcards" for the destinations. Original vector art; colours follow the active palette.
// Variables: --bg2 sky, --accent / --accent-2 main colours, --fg dark ink, --card light surfaces.
const fillV = (v, o) => ({ fill: `var(--${v})`, ...(o ? { opacity: o } : {}) })
const strokeV = (v, w = 2) => ({ fill: 'none', stroke: `var(--${v})`, strokeWidth: w, strokeLinecap: 'round', strokeLinejoin: 'round' })

const Sky = ({ children, label }) => (
  <svg viewBox="0 0 400 300" className="scene" role="img" aria-label={label} preserveAspectRatio="xMidYMid slice">
    <rect width="400" height="300" style={fillV('bg2')} />
    {children}
  </svg>
)

/** Hawa-Mahal-style honeycomb facade: stacked tiers of arched jharokha windows. */
function Jaipur() {
  const tiers = [
    { y: 196, w: 280, h: 74, n: 9 },
    { y: 160, w: 232, h: 38, n: 8 },
    { y: 126, w: 184, h: 36, n: 6 },
    { y: 94, w: 136, h: 34, n: 5 },
    { y: 66, w: 88, h: 30, n: 3 },
  ]
  return (
    <Sky label="Jaipur: a jharokha palace facade at sunset">
      <circle cx="318" cy="70" r="34" style={fillV('accent-2')} />
      <path d="M0 250C60 226 90 232 140 246S250 236 400 248V300H0Z" style={fillV('accent', 0.35)} />
      {tiers.map((t, i) => {
        const left = 200 - t.w / 2
        const gap = t.w / t.n
        return (
          <g key={i}>
            <rect x={left} y={t.y} width={t.w} height={t.h} style={fillV(i % 2 ? 'accent' : 'accent-2')} />
            <rect x={left} y={t.y} width={t.w} height="4" style={fillV('fg', 0.55)} />
            {Array.from({ length: t.n }, (_, k) => {
              const cx = left + gap * (k + 0.5)
              const ww = Math.min(14, gap * 0.52)
              return (
                <path key={k} d={`M${cx - ww / 2} ${t.y + t.h - 6}V${t.y + 16}A${ww / 2} ${ww / 2} 0 0 1 ${cx + ww / 2} ${t.y + 16}V${t.y + t.h - 6}Z`} style={fillV('fg', 0.8)} />
              )
            })}
          </g>
        )
      })}
      <path d="M176 66a24 24 0 0 1 48 0Z" style={fillV('accent')} />
      <path d="M200 30v14" style={strokeV('fg', 3)} />
      <path d="M0 270H400V300H0Z" style={fillV('fg', 0.85)} />
    </Sky>
  )
}

/** A houseboat with a curved thatch roof between coconut palms, on slow green water. */
function Kerala() {
  const palm = (x, lean) => (
    <g>
      <path d={`M${x} 232C${x + lean * 0.4} 190 ${x + lean} 150 ${x + lean * 1.4} 112`} style={strokeV('fg', 6)} />
      {[-70, -35, 0, 35, 70, 105].map((a) => (
        <path key={a} d="M0 0C14-10 32-8 50 6C36 0 20 0 0 0Z" transform={`translate(${x + lean * 1.4} 112) rotate(${a - 90})`} style={fillV('accent')} />
      ))}
      {[-110, -145, -180, -215].map((a) => (
        <path key={a} d="M0 0C14-10 32-8 50 6C36 0 20 0 0 0Z" transform={`translate(${x + lean * 1.4} 112) rotate(${a})`} style={fillV('accent')} />
      ))}
    </g>
  )
  return (
    <Sky label="Kerala: a houseboat on the backwaters between palms">
      <circle cx="82" cy="72" r="30" style={fillV('accent-2')} />
      <rect y="214" width="400" height="86" style={fillV('accent', 0.28)} />
      {palm(52, 26)}
      {palm(350, -30)}
      <path d="M96 222H304L286 252H116Z" style={fillV('fg', 0.9)} />
      <path d="M112 222V196H288V222" style={fillV('accent-2')} />
      <path d="M96 198C130 150 270 150 304 198C250 184 150 184 96 198Z" style={fillV('accent')} />
      {[130, 168, 206, 244].map((x) => <rect key={x} x={x} y="202" width="22" height="14" rx="3" style={fillV('card', 0.9)} />)}
      {[0, 1, 2].map((i) => <path key={i} d={`M${60 + i * 40} ${268 + i * 8}h${120 - i * 10}M${230 + i * 20} ${262 + i * 10}h${90 - i * 10}`} style={strokeV('fg', 2)} opacity=".35" />)}
    </Sky>
  )
}

/** Layered Himalaya with a string of five-colour prayer flags. */
function Ladakh() {
  const flags = ['#2F6FDB', '#FFFFFF', '#D8342C', '#2E9A58', '#F2B705']
  return (
    <Sky label="Ladakh: snow mountains with prayer flags">
      <circle cx="88" cy="68" r="26" style={fillV('accent-2')} />
      <path d="M0 230L90 130L150 190L240 90L330 190L370 150L400 180V300H0Z" style={fillV('accent', 0.55)} />
      <path d="M0 260L70 190L130 236L220 150L300 240L360 200L400 232V300H0Z" style={fillV('fg', 0.85)} />
      <path d="M240 90L214 124L232 118L240 132L252 116L268 122Z" style={fillV('card')} />
      <path d="M220 150L200 176L214 170L222 182L234 168L246 176Z" style={fillV('card', 0.9)} />
      <path d="M28 40Q200 96 372 40" style={strokeV('fg', 2)} />
      {flags.concat(flags).concat(flags).map((c, i) => {
        const t = (i + 0.5) / 15
        const x = 28 + t * 344
        const y = 40 + 4 * 2 * 0.5 * 0 + Math.sin(Math.PI * t) * 38 + 2
        return <path key={i} d={`M${x - 8} ${y}h16v18l-8-5-8 5Z`} fill={c} stroke="#00000022" strokeWidth=".6" />
      })}
      <path d="M0 268C100 252 300 284 400 262V300H0Z" style={fillV('card', 0.25)} />
    </Sky>
  )
}

/** Ghat steps, a shikhara temple spire, a moon, and diyas drifting on the Ganga. */
function Varanasi() {
  return (
    <Sky label="Varanasi: ghat steps and diyas on the river at dusk">
      <circle cx="310" cy="64" r="26" style={fillV('card')} />
      <circle cx="322" cy="58" r="24" style={fillV('bg2')} />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={20 + i * 8} y={206 - i * 14} width={300 - i * 16} height="14" style={fillV(i % 2 ? 'accent' : 'accent-2')} />)}
      <path d="M120 140C124 100 150 70 164 36C178 70 204 100 208 140Z" style={fillV('accent')} />
      <path d="M164 36v-14" style={strokeV('fg', 3)} />
      <rect x="116" y="136" width="96" height="30" style={fillV('fg', 0.85)} />
      <path d="M150 166v-18a14 14 0 0 1 28 0v18Z" style={fillV('accent-2')} />
      <rect y="222" width="400" height="78" style={fillV('fg', 0.78)} />
      {[[60, 252], [130, 270], [200, 248], [264, 272], [330, 254], [96, 286], [232, 288]].map(([x, y], i) => (
        <g key={i}>
          <ellipse cx={x} cy={y + 4} rx="22" ry="6" style={fillV('accent-2', 0.28)} />
          <path d={`M${x - 11} ${y}h22c-2 8-8 10-11 10s-9-2-11-10Z`} style={fillV('accent')} />
          <path d={`M${x} ${y - 1}C${x - 6} ${y - 8} ${x - 2} ${y - 14} ${x} ${y - 18}C${x + 2} ${y - 14} ${x + 6} ${y - 8} ${x} ${y - 1}Z`} style={fillV('accent-2')} />
        </g>
      ))}
    </Sky>
  )
}

/** A shikara with a fringed canopy on Dal Lake, snow peaks behind, chinar leaf. */
function Kashmir() {
  return (
    <Sky label="Kashmir: a shikara on Dal Lake with snow peaks">
      <circle cx="320" cy="64" r="24" style={fillV('accent-2')} />
      <path d="M0 176L84 92L132 148L214 70L300 160L350 118L400 164V300H0Z" style={fillV('accent', 0.5)} />
      <path d="M214 70L190 100L204 96L214 108L226 94L240 100Z" style={fillV('card')} />
      <path d="M84 92L66 114L80 110L88 120L98 108L110 114Z" style={fillV('card', 0.9)} />
      <path d="M0 176C110 200 290 200 400 176V300H0Z" style={fillV('fg', 0.8)} />
      <rect y="206" width="400" height="94" style={fillV('accent', 0.4)} />
      <path d="M96 252C140 270 270 270 312 242C290 258 150 258 96 252Z" style={fillV('fg', 0.95)} />
      <path d="M130 244V214H266V242" style={fillV('accent-2')} />
      <path d="M122 214H274L264 200H132Z" style={fillV('accent')} />
      {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${136 + i * 9.4} 214v8`} style={strokeV('card', 1.6)} />)}
      <path d="M56 268h60M284 272h70M150 282h110" style={strokeV('card', 2)} opacity=".4" />
      <path d="M358 238c-8-14 6-26 14-30 4 8 12 14 8 28-6-4-12-2-14 4Z" style={fillV('accent')} />
    </Sky>
  )
}

/** Dome, four minarets and a long reflection: the Taj at sunrise. */
function Agra() {
  const minaret = (x) => (
    <g>
      <rect x={x - 6} y="120" width="12" height="94" style={fillV('card')} />
      <rect x={x - 9} y="150" width="18" height="5" style={fillV('card')} />
      <rect x={x - 9} y="182" width="18" height="5" style={fillV('card')} />
      <path d={`M${x - 8} 120a8 8 0 0 1 16 0Z`} style={fillV('accent-2')} />
    </g>
  )
  return (
    <Sky label="Agra: a white marble mausoleum with minarets and its reflection">
      <circle cx="200" cy="168" r="120" style={fillV('accent-2', 0.5)} />
      {minaret(78)}{minaret(322)}{minaret(120)}{minaret(280)}
      <rect x="140" y="152" width="120" height="62" style={fillV('card')} />
      <path d="M200 160V128" style={strokeV('fg', 0)} />
      <path d="M160 152C160 108 200 92 200 62C200 92 240 108 240 152Z" style={fillV('card')} />
      <path d="M200 62v-18" style={strokeV('accent', 3)} />
      <path d="M182 214v-32a18 18 0 0 1 36 0v32Z" style={fillV('fg', 0.8)} />
      <path d="M146 214v-22a9 9 0 0 1 18 0v22ZM236 214v-22a9 9 0 0 1 18 0v22Z" style={fillV('fg', 0.55)} />
      <rect y="214" width="400" height="86" style={fillV('accent', 0.45)} />
      <g opacity=".3" transform="translate(0 428) scale(1 -1)">
        <rect x="140" y="152" width="120" height="62" style={fillV('card')} />
        <path d="M160 152C160 108 200 92 200 62C200 92 240 108 240 152Z" style={fillV('card')} />
      </g>
      <path d="M0 252h400M40 270h320M90 286h220" style={strokeV('card', 1.6)} opacity=".35" />
    </Sky>
  )
}

export const SCENES = { jaipur: Jaipur, kerala: Kerala, ladakh: Ladakh, varanasi: Varanasi, kashmir: Kashmir, agra: Agra }
