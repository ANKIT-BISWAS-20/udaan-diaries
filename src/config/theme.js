// ─────────────────────────────────────────────────────────────
//  THEME: every colour on the site comes from here.
//  Palettes are named after the colours of Indian textiles, spices and landscapes.
//  Edit a hex, save, and the whole site (logo + Lottie animations included) re-colours itself.
//
//  Nine colours per mode, in this order:
//  bg, bg2, fg, muted, line, card, accent, accent2, onAccent
// ─────────────────────────────────────────────────────────────
const KEYS = ['bg', 'bg2', 'fg', 'muted', 'line', 'card', 'accent', 'accent2', 'onAccent']
const pal = (label, light, dark) => {
  const to = (arr) => Object.fromEntries(KEYS.map((k, i) => [k, arr[i]]))
  return { label, swatch: light[6], swatch2: light[7], light: to(light), dark: to(dark) }
}

export const theme = {
  defaultMode: 'light', // the site always opens in light mode; visitors can still switch to dark
  defaultPalette: 'jaipur',

  palettes: {
    //                bg         bg2        fg         muted      line                          card       accent     accent2    onAccent
    // Jaipur: haldi (turmeric) and sindoor on cream, indigo ink like a block-printed dupatta
    jaipur: pal('Jaipur Marigold',
      ['#FFF8EC', '#FBEBCF', '#1B1740', '#6B6182', 'rgba(27, 23, 64, 0.14)', '#FFFFFF', '#C2410C', '#E8A317', '#FFFFFF'],
      ['#14102B', '#1C1740', '#FFF1DC', '#B9ACCB', 'rgba(255, 241, 220, 0.16)', '#201A4A', '#FF9A3C', '#FFC83D', '#1A0F05']),
    // Kerala: backwater green with nettipattam gold
    kerala: pal('Kerala Backwaters',
      ['#F4FAF1', '#E2F0DB', '#0F2A1F', '#52695C', 'rgba(15, 42, 31, 0.14)', '#FFFFFF', '#0F7A4F', '#D99A1E', '#FFFFFF'],
      ['#07150F', '#0C1F16', '#E8FBF0', '#8FB3A0', 'rgba(232, 251, 240, 0.16)', '#0F281C', '#3DDC97', '#F2C14E', '#05130C']),
    // Peacock: teal and royal blue
    peacock: pal('Peacock',
      ['#F1FAFA', '#DDF1F2', '#0A2530', '#4F6B75', 'rgba(10, 37, 48, 0.14)', '#FFFFFF', '#0B7C86', '#3B3BA8', '#FFFFFF'],
      ['#06161C', '#0A212A', '#E5FAFC', '#8DB4BC', 'rgba(229, 250, 252, 0.16)', '#0C2833', '#35D0D8', '#8E8CFF', '#04161A']),
    // Sindoor: bridal red and gold, Bengal sarees and Kanjeevaram silk
    sindoor: pal('Sindoor & Gold',
      ['#FFF6F3', '#FCE4DD', '#2A0C10', '#7C5558', 'rgba(42, 12, 16, 0.14)', '#FFFFFF', '#B3202A', '#D9962B', '#FFFFFF'],
      ['#17080A', '#230D10', '#FFEDE6', '#C9A3A0', 'rgba(255, 237, 230, 0.16)', '#2D1015', '#FF5A5F', '#FFC857', '#1A0507']),
    // Kashmir: crocus purple with saffron
    kashmir: pal('Kashmir Saffron',
      ['#FAF6FF', '#EDE3FA', '#1E1233', '#6A5E80', 'rgba(30, 18, 51, 0.14)', '#FFFFFF', '#6B3FA0', '#E8A317', '#FFFFFF'],
      ['#120B20', '#1A1030', '#F5EEFF', '#B7A8D0', 'rgba(245, 238, 255, 0.16)', '#201440', '#B58CFF', '#FFC83D', '#150A26']),
  },
}

// ── Internals (no need to edit below) ────────────────────────
const kebab = (k) => k.replace(/[A-Z0-9]/g, (m) => '-' + m.toLowerCase())
const vars = (o) => Object.entries(o).map(([k, v]) => `--${kebab(k)}:${v};`).join('')

export function paletteCss() {
  const def = theme.palettes[theme.defaultPalette]
  let css = `:root{${vars(def.light)}color-scheme:light}\n`
  for (const [id, p] of Object.entries(theme.palettes)) {
    for (const mode of ['light', 'dark']) {
      css += `:root[data-palette="${id}"][data-theme="${mode}"]{${vars(p[mode])}color-scheme:${mode}}\n`
    }
  }
  return css
}

export function themeBootScript() {
  const cfg = JSON.stringify({
    defaultMode: theme.defaultMode,
    defaultPalette: theme.defaultPalette,
    palettes: Object.keys(theme.palettes),
  })
  return `(function(){var D=${cfg},r=document.documentElement,m=D.defaultMode,p=D.defaultPalette;try{m=localStorage.getItem('ud-mode')||m;var s=localStorage.getItem('palette');if(s&&D.palettes.indexOf(s)>-1)p=s}catch(e){}var dark=m==='dark';r.dataset.theme=dark?'dark':'light';r.dataset.palette=p})();`
}
