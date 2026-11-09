import { useEffect, useState } from 'react'

/** matchMedia as state. Starts false on the server and first render, so hydration matches. */
export function useMedia(query) {
  const [on, setOn] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setOn(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [query])
  return on
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')

/** true once the element has been near the viewport; `stay` keeps it true after that. */
export function useInView(ref, { margin = '120px', stay = false } = {}) {
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || !('IntersectionObserver' in window)) return setInView(true)
    const io = new IntersectionObserver(([e]) => {
      setInView(e.isIntersecting)
      if (e.isIntersecting && stay) io.disconnect()
    }, { rootMargin: margin })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, margin, stay])
  return inView
}
