// ─────────────────────────────────────────────────────────────
//  LOTTIE ANIMATIONS
//
//  Every slot can use any animation from LottieFiles:
//   1. Open an animation on lottiefiles.com → Download → "Lottie JSON".
//   2. Put the file in /public/lottie/ and set  url: '/lottie/your-file.json'
//      (or paste a direct lottie.host JSON link that allows cross-origin requests).
//  Animations are cached after the first load (memory + Cache Storage).
//
//  If `url` is empty or fails, the built-in animation plays instead (src/animations/), so there's
//  never an empty gap. The hero bird is src/animations/bird.json, a standard Lottie file
//  (regenerate it with `node scripts/gen-bird.mjs`). Built-ins re-colour with the palette picker;
//  inside the LottieFiles editor you can name a fill/stroke  accent / secondary / fg  to get the same.
// ─────────────────────────────────────────────────────────────
export const animations = {
  hero: { url: '', fallback: 'bird', loop: true, still: 10 }, // swallow in flight over the hero
  empty: { url: '', fallback: 'diya', loop: true, still: 20 }, // flickering diya (locked state)
  success: { url: '', fallback: 'bloom', loop: false, still: 150 }, // lotus blooming after a story is sent
  upload: { url: '', fallback: 'upload', loop: true, still: 10 }, // dropzone
}

export const animationCache = {
  preload: true,
  name: 'udaan-lottie-v2', // bump (v3, v4…) to force everyone to re-download
}
