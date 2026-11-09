// Generates src/animations/bird.json: a side-view bird in flight, as a standard Lottie file.
// Wings are real path morphs (up → spread → down → folded) so they bend at the wrist instead of
// rotating like stiff petals. Fills are named accent / secondary / fg / card so the site's palette
// picker can re-colour it (see tintLottie in src/lib/lottie.js).
// Run: node scripts/gen-bird.mjs
import { writeFileSync } from 'node:fs'

const FR = 60
const PERIOD = 40 // frames per wing beat
const BEATS = 4
const OP = PERIOD * BEATS
const r = (n) => Math.round(n * 100) / 100

/** Smooth closed path through points; indices in `sharp` keep pointed corners (feather tips). */
function smooth(pts, sharp = [], k = 0.32) {
  const n = pts.length
  const i = [], o = []
  for (let j = 0; j < n; j++) {
    const p0 = pts[(j - 1 + n) % n], p2 = pts[(j + 1) % n]
    let tx = (p2[0] - p0[0]) * k, ty = (p2[1] - p0[1]) * k
    if (sharp.includes(j)) { tx = 0; ty = 0 }
    i.push([r(-tx), r(-ty)]); o.push([r(tx), r(ty)])
  }
  return { i, o, v: pts.map(([x, y]) => [r(x), r(y)]), c: true }
}

// Wing poses, shoulder at 0,0, bird faces +x. Same vertex count in every pose so they morph.
// [rootFront, lead1, lead2, tip, trail2, trail1, rootBack]
const POSES = {
  up:     [[10, 0], [4, -36], [-10, -76], [-30, -112], [-36, -74], [-30, -36], [-22, 2]],
  spread: [[10, 0], [-4, -16], [-40, -30], [-104, -30], [-74, -10], [-44, -2], [-22, 4]],
  down:   [[10, 0], [4, 28], [-8, 64], [-22, 100], [-30, 64], [-28, 30], [-22, 4]],
  fold:   [[10, 0], [-2, -20], [-26, -40], [-66, -62], [-56, -34], [-38, -12], [-22, 2]],
}
const ORDER = ['up', 'spread', 'down', 'fold']
const SHARP = [3]

const ease = { i: { x: [0.45], y: [1] }, o: { x: [0.55], y: [0] } }

/** Animated wing path. phase shifts the beat by quarter-beats. scale shrinks the inner feathers. */
function wingPath(phase = 0, scale = 1) {
  const k = []
  for (let b = 0; b <= BEATS * 4; b++) {
    const t = (b * PERIOD) / 4
    const pose = POSES[ORDER[(b + phase) % 4]].map(([x, y]) => [x * scale, y * scale])
    k.push({ t, s: [smooth(pose, SHARP)], ...(b < BEATS * 4 ? ease : {}) })
  }
  return { ty: 'sh', ks: { a: 1, k } }
}

const st = (v) => ({ a: 0, k: v })
const fill = (nm, o = 100) => ({ ty: 'fl', nm, c: st([1, 1, 1, 1]), o: st(o), r: 1 })
const tr = (p = [0, 0], s = [100, 100], rot = 0, o = 100) => ({
  ty: 'tr', p: typeof p[0] === 'object' ? p[0] : st(p), a: st([0, 0]), s: st(s), r: typeof rot === 'object' ? rot : st(rot), o: st(o), sk: st(0), sa: st(0),
})
const grp = (nm, it, t = tr()) => ({ ty: 'gr', nm, it: [...it, t] })
const path = (pts, sharp = []) => ({ ty: 'sh', ks: st(smooth(pts, sharp)) })
const ell = (w, h, p = [0, 0]) => ({ ty: 'el', d: 1, s: st([w, h]), p: st(p) })

/** Sampled loop keyframes from a function (seamless because fn(0) === fn(OP)). */
function sampled(fn, step = 8) {
  const k = []
  for (let t = 0; t <= OP; t += step) k.push({ t, s: [].concat(fn(t)), i: { x: [1], y: [1] }, o: { x: [0], y: [0] } })
  return { a: 1, k }
}
const TAU = Math.PI * 2
const beat = (t, lag = 0) => Math.sin((TAU * (t - lag)) / PERIOD)

function wing(nm, phase, colors) {
  // three nested feather layers, like a paisley: outer, middle, inner
  return grp(nm, [
    grp('inner', [wingPath(phase, 0.46), fill(colors[2])]),
    grp('mid', [wingPath(phase, 0.72), fill(colors[1])]),
    grp('outer', [wingPath(phase, 1), fill(colors[0])]),
  ])
}

function bird(ind, nm, { x, y, scale, phase = 0, bob = 10, drift = 0, opacity = 100 }) {
  const shapes = [
    // near wing (in front of body)
    wing('nearWing', phase, ['accent', 'secondary', 'card']),
    // head, eye, beak
    grp('eye', [ell(7, 7, [50, -12]), fill('card')]),
    grp('pupil', [ell(3.4, 3.4, [51, -12]), fill('fg')]),
    grp('beak', [path([[60, -14], [82, -6], [60, -4]], [0, 1, 2]), fill('secondary')]),
    grp('head', [ell(30, 28, [46, -9]), fill('fg')]),
    // chest + body
    grp('chest', [path([[40, 4], [16, 18], [-20, 12], [-6, 2], [24, -2]]), fill('secondary', 90)]),
    grp('body', [path([[58, -6], [34, 16], [-10, 14], [-46, 4], [-42, -6], [-6, -16], [34, -20]]), fill('fg')]),
    // forked tail, flutters slightly with the beat
    grp('tail', [path([[4, -5], [-50, -18], [-22, 1], [-54, 20], [4, 6]], [1, 3]), fill('fg')],
      tr([-40, 0], [100, 100], sampled((t) => r(5 * beat(t, 8))))),
    // far wing (behind body), slightly smaller and a beat behind
    grp('farWingWrap', [wing('farWing', (phase + 0) % 4, ['secondary', 'accent', 'secondary'])],
      tr([8, -10], [86, 86], 0, 85)),
  ]
  return {
    ddd: 0, ind, ty: 4, nm, sr: 1, ao: 0, ip: 0, op: OP, st: 0, bm: 0,
    ks: {
      p: sampled((t) => [r(x + drift * Math.sin((TAU * t) / OP)), r(y - bob * Math.sin((TAU * t) / OP) + 3 * beat(t, 10)), 0]),
      a: st([0, 0, 0]),
      s: st([scale, scale, 100]),
      r: sampled((t) => r(-6 + 4 * beat(t, 6))),
      o: st(opacity),
    },
    shapes,
  }
}

const comp = {
  v: '5.7.0', fr: FR, ip: 0, op: OP, w: 480, h: 360, nm: 'udaan-bird', ddd: 0, assets: [],
  layers: [
    bird(1, 'bird', { x: 236, y: 186, scale: 128, bob: 14 }),
    bird(2, 'friend-1', { x: 396, y: 92, scale: 42, phase: 2, bob: 8, drift: 6, opacity: 70 }),
    bird(3, 'friend-2', { x: 92, y: 74, scale: 30, phase: 1, bob: 6, drift: -5, opacity: 55 }),
  ],
}

writeFileSync(new URL('../src/animations/bird.json', import.meta.url), JSON.stringify(comp))
console.log('bird.json written', JSON.stringify(comp).length, 'bytes')
