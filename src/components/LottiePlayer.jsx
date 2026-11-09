import { lazy, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { animations } from '../config'
import { loadLottie, tintLottie, useThemeColors } from '../lib/lottie'
import { fallbacks } from '../animations/fallbacks'
import { useInView, useReducedMotion } from '../hooks/useMedia'

// Loaded on demand so the first paint isn't blocked by the Lottie runtime.
// (lottie-react is CommonJS, so the component can sit one level deeper after bundling)
const Lottie = lazy(() => import('lottie-react').then((m) => ({ default: m.default?.default ?? m.default })))

/**
 * Renders the animation configured under `id` in src/config/animations.js.
 * Uses the LottieFiles URL when set, otherwise the built-in animation.
 * Re-colours with the theme, plays only while on screen, and shows a still frame for reduced motion.
 */
export default function LottiePlayer({ id, className = '', style, onComplete, active = true }) {
  const spec = animations[id] || {}
  const reduce = useReducedMotion()
  const colors = useThemeColors()
  const [remote, setRemote] = useState(null)
  const wrap = useRef(null)
  const lottie = useRef(null)
  const inView = useInView(wrap)

  useEffect(() => {
    let alive = true
    setRemote(null)
    if (spec.url) loadLottie(spec.url).then((d) => alive && setRemote(d))
    return () => { alive = false }
  }, [spec.url])

  const data = useMemo(() => {
    if (!colors) return null
    const base = remote || fallbacks[spec.fallback]?.()
    return base ? tintLottie(base, colors) : null
  }, [remote, spec.fallback, colors])

  const sync = useCallback(() => {
    const a = lottie.current
    if (!a) return
    if (reduce) a.goToAndStop(spec.still ?? 0, true)
    else if (inView && active) a.play()
    else a.pause()
  }, [reduce, inView, active, spec.still])

  useEffect(sync, [sync, data])

  return (
    <div ref={wrap} className={className} style={style} aria-hidden="true">
      {data && (
        <Suspense fallback={null}>
          <Lottie
            lottieRef={lottie}
            animationData={data}
            loop={spec.loop !== false}
            autoplay={false}
            onDOMLoaded={sync}
            onComplete={onComplete}
            rendererSettings={{ preserveAspectRatio: 'xMidYMid meet' }}
            style={{ width: '100%', height: '100%' }}
          />
        </Suspense>
      )}
    </div>
  )
}
