// Tiny helpers for hand-writing Lottie JSON in code.
// Shapes named "accent" / "secondary" / "fg" / "bg" / "card" / "muted" are re-coloured from the
// live theme (see tintLottie in lib/lottie.js), so every animation follows the palette picker.

export const FR = 60

export const num = (k) => ({ a: 0, k })

/** frames: [time, value, hold?]. mode: 'ease' | 'linear' | 'back' (overshoot) */
export const keys = (frames, mode = 'ease') => ({
  a: 1,
  k: frames.map(([t, s, h]) => ({
    t,
    s: Array.isArray(s) ? s : [s],
    i: mode === 'linear' ? { x: 1, y: 1 } : mode === 'back' ? { x: 0.3, y: 1.35 } : { x: 0.35, y: 1 },
    o: mode === 'linear' ? { x: 0, y: 0 } : mode === 'back' ? { x: 0.5, y: 0 } : { x: 0.65, y: 0 },
    ...(h ? { h: 1 } : {}),
  })),
})

/** value helper: static number/array or keyframed */
const val = (v) => (v && v.a !== undefined ? v : num(v))

// ── shapes ────────────────────────────────────────────────────
export const rect = (w, h, r = 0, p = [0, 0]) => ({ ty: 'rc', d: 1, s: num([w, h]), p: num(p), r: num(r) })
export const circle = (d, p = [0, 0]) => ({ ty: 'el', d: 1, s: num([d, d]), p: num(p) })
export const poly = (pts, closed = false) => ({
  ty: 'sh',
  ks: { a: 0, k: { i: pts.map(() => [0, 0]), o: pts.map(() => [0, 0]), v: pts, c: closed } },
})
export const bez = (v, i, o, closed = false) => ({ ty: 'sh', ks: { a: 0, k: { i, o, v, c: closed } } })

/** 4-point sparkle centred on 0,0 */
export const star = (R = 20, r = 5) => {
  const pts = []
  for (let n = 0; n < 8; n++) {
    const a = (Math.PI / 4) * n - Math.PI / 2
    const rad = n % 2 === 0 ? R : r
    pts.push([+(Math.cos(a) * rad).toFixed(2), +(Math.sin(a) * rad).toFixed(2)])
  }
  return poly(pts, true)
}

// ── paint ─────────────────────────────────────────────────────
export const fill = (nm, o = 100) => ({ ty: 'fl', nm, c: num([1, 1, 1, 1]), o: val(o), r: 1 })
export const stroke = (nm, w, o = 100) => ({ ty: 'st', nm, c: num([1, 1, 1, 1]), o: val(o), w: num(w), lc: 2, lj: 2 })
export const trim = (s = 0, e = 100) => ({ ty: 'tm', s: val(s), e: val(e), o: num(0), m: 1 })

// ── structure ─────────────────────────────────────────────────
/** group transform. Pass static values or keys() results. */
export const tr = ({ p = [0, 0], a = [0, 0], s = [100, 100], r = 0, o = 100 } = {}) => ({
  ty: 'tr', p: val(p), a: val(a), s: val(s), r: val(r), o: val(o), sk: num(0), sa: num(0),
})
export const grp = (nm, items, t) => ({ ty: 'gr', nm, it: [...items, tr(t)] })

export const ks = ({ p = [200, 200, 0], a = [0, 0, 0], s = [100, 100, 100], r = 0, o = 100 } = {}) => ({
  p: val(p), a: val(a), s: val(s), r: val(r), o: val(o),
})
export const layer = (ind, nm, shapes, k, op) => ({
  ddd: 0, ind, ty: 4, nm, sr: 1, ks: k || ks(), ao: 0, shapes, ip: 0, op, st: 0, bm: 0,
})
export const comp = (nm, op, layers) => ({ v: '5.7.0', fr: FR, ip: 0, op, w: 400, h: 400, nm, ddd: 0, assets: [], layers })

// ── common motion patterns ────────────────────────────────────
/** pops in with overshoot at `t`, stays until `out`, shrinks away */
export const pop = (t, out, to = 100, len = 18) =>
  keys([[0, [0, 0, 100], true], [t, [0, 0, 100]], [t + len, [to, to, 100]], [out, [to, to, 100]], [out + 14, [0, 0, 100]]], 'back')

/** opacity: invisible until `t`, visible until `out`, fades by `out + fade` */
export const showBetween = (t, out, fade = 14) =>
  keys([[0, 0, true], [t, 0], [t + 8, 100], [out, 100], [out + fade, 0]], 'linear')
