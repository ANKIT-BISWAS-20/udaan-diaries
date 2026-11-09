// Built-in Lottie animations for Udaan Diaries, written as plain Lottie JSON in code.
// Shapes named accent / secondary / fg / card re-colour with the palette picker (see tintLottie).
// Any of them can be swapped for a LottieFiles download in src/config/animations.js.
import birdJson from './bird.json'
import { keys, rect, circle, poly, bez, star, fill, stroke, grp, ks, layer, comp } from './kit'

const TAU = Math.PI * 2
const r2 = (n) => +n.toFixed(2)

/** Samples fn(t) every `step` frames into linear keyframes: seamless loops straight from maths. */
const sampled = (fn, op, step = 4) => {
  const f = []
  for (let t = 0; t <= op; t += step) f.push([t, fn(t)])
  if (f[f.length - 1][0] !== op) f.push([op, fn(op)])
  return keys(f, 'linear')
}

/** A pointed petal / wing / flame, base at (0,0), tip at (0,-L), half-width W. */
const petal = (W, L) =>
  bez(
    [[0, 0], [0, -L]],
    [[W, -L * 0.26], [-W * 0.78, L * 0.32]],
    [[-W, -L * 0.26], [W * 0.78, L * 0.32]],
    true,
  )

// ── 2. Diya: a flickering oil lamp (empty / locked states) ───
function diya() {
  const op = 120
  const w = (t, k, ph = 0) => Math.sin((TAU * k * t) / op + ph)
  const flick = (t) => [r2(100 + 6 * w(t, 3) + 3 * w(t, 5, 1)), r2(100 + 8 * w(t, 2, 2) + 4 * w(t, 5))]
  const sway = sampled((t) => r2(3 * w(t, 2)), op)

  const sparkle = (x, y, ph) =>
    grp('sp', [star(14, 3.5), fill('accent')], {
      p: [x, y],
      s: sampled((t) => { const v = r2(Math.max(0, 100 * w(t, 1, ph))); return [v, v] }, op),
    })

  const lamp = layer(
    1, 'diya',
    [
      sparkle(-88, -150, 0), sparkle(92, -130, 2), sparkle(-62, -40, 4), sparkle(70, -48, 1),
      grp('flameIn', [petal(13, 54), fill('card')], { p: [0, -16], s: sampled(flick, op), r: sway }),
      grp('flame', [petal(26, 94), fill('secondary')], { p: [0, -16], s: sampled(flick, op), r: sway }),
      grp('rim', [rect(158, 12, 6, [0, 0]), fill('secondary')]),
      grp('bowl', [bez([[-72, 4], [0, 44], [72, 4]], [[0, 0], [-40, 0], [0, 26]], [[0, 26], [40, 0], [0, 0]], true), fill('accent')]),
      grp('glow', [circle(220, [0, -64]), fill('secondary', sampled((t) => r2(18 + 8 * w(t, 2)), op))]),
    ],
    ks({ p: [200, 236, 0] }),
    op,
  )
  return comp('diya', op, [lamp])
}

// ── 3. Lotus bloom (plays once after a story is sent) ────────
function bloom() {
  const op = 180
  const pop = (t) => keys([[0, [0, 0], true], [t, [0, 0]], [t + 28, [100, 100]]], 'back')
  const outer = [-72, -36, 0, 36, 72].map((a, i) => grp('outer', [petal(40, 118), fill('secondary', 92)], { r: a, s: pop(8 + i * 5) }))
  const mid = [-48, -16, 16, 48].map((a, i) => grp('mid', [petal(32, 98), fill('accent', 94)], { r: a, s: pop(36 + i * 5) }))
  const bud = grp('bud', [petal(22, 70), fill('card')], { s: pop(62) })

  const sparkle = (x, y, t) =>
    grp('sp', [star(13, 3.5), fill('accent')], {
      p: [x, y],
      s: keys([[0, [0, 0], true], [t, [0, 0]], [t + 20, [100, 100]], [t + 50, [70, 70]]], 'back'),
    })

  const flower = layer(
    1, 'lotus',
    [
      sparkle(-120, -120, 90), sparkle(124, -108, 100), sparkle(-150, -40, 112), sparkle(150, -34, 118),
      bud, ...mid.reverse(), ...outer.reverse(),
      grp('water', [rect(190, 8, 4, [0, 8]), fill('fg', 22)]),
    ],
    ks({ p: [200, 262, 0] }),
    op,
  )
  return comp('bloom', op, [flower])
}

// ── 4. Compass (destinations heading) ────────────────────────
function compass() {
  const op = 240
  const ticks = Array.from({ length: 8 }, (_, i) =>
    grp('tick', [rect(i % 2 ? 5 : 8, i % 2 ? 14 : 22, 3, [0, -104]), fill(i === 0 ? 'accent' : 'fg', i === 0 ? 100 : 55)], { r: i * 45 }),
  )
  const needle = grp(
    'needle',
    [grp('n', [poly([[-17, 0], [0, -92], [17, 0]], true), fill('accent')]), grp('s', [poly([[-17, 0], [0, 92], [17, 0]], true), fill('fg', 55)])],
    { r: keys([[0, -40], [60, 38], [120, -22], [180, 16], [op, -40]], 'ease') },
  )
  const dial = layer(
    1, 'compass',
    [
      grp('pin', [circle(9), fill('accent')]),
      grp('pinRing', [circle(22), fill('card')]),
      needle,
      ...ticks,
      grp('ring2', [circle(188), stroke('accent', 2.5, 80)]),
      grp('ring', [circle(236), stroke('fg', 5, 55)]),
    ],
    ks({ p: [200, 200, 0] }),
    op,
  )
  return comp('compass', op, [dial])
}

// ── 5. Upload arrow (media dropzone) ─────────────────────────
function upload() {
  const op = 120
  const w = (t, k = 1, ph = 0) => Math.sin((TAU * k * t) / op + ph)
  const pulse = (ph) => (t) => { const f = (((t + ph) % op) + op) % op / op; return f }
  const ring = (ind, ph) =>
    layer(
      ind, `ring${ind}`,
      [grp('ring', [circle(250), stroke('accent', 4)])],
      ks({
        p: [200, 200, 0],
        s: sampled((t) => { const f = pulse(ph)(t); return [r2(48 + 52 * f), r2(48 + 52 * f), 100] }, op, 6),
        o: sampled((t) => r2(100 * (1 - pulse(ph)(t))), op, 6),
      }),
      op,
    )
  const arrow = layer(
    1, 'arrow',
    [
      grp('arrow', [poly([[0, 34], [0, -38]]), poly([[-26, -12], [0, -40], [26, -12]]), stroke('accent', 11)], { p: sampled((t) => [0, r2(-9 * w(t))], op) }),
      grp('base', [rect(96, 9, 4, [0, 58]), fill('fg', 50)]),
      grp('disc', [circle(150), fill('accent', 16)]),
    ],
    ks({ p: [200, 200, 0] }),
    op,
  )
  return comp('upload', op, [arrow, ring(2, 0), ring(3, 60)])
}

// The hero bird is a standalone Lottie file (generated by scripts/gen-bird.mjs).
export const fallbacks = { bird: () => birdJson, diya, bloom, compass, upload }
