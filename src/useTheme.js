import { useCallback, useEffect, useState } from 'react'
import { theme } from './config'

const write = (key, value) => {
  try { localStorage.setItem(key, value) } catch {}
}

/**
 * Light mode by default for everyone. The boot script in index.html applies any saved choice
 * before first paint; this hook reads it back after mount so prerendered HTML hydrates cleanly.
 */
export function useTheme() {
  const [mode, setMode] = useState(theme.defaultMode)
  const [palette, setPaletteState] = useState(theme.defaultPalette)

  useEffect(() => {
    const root = document.documentElement
    if (root.dataset.theme) setMode(root.dataset.theme)
    if (root.dataset.palette && theme.palettes[root.dataset.palette]) setPaletteState(root.dataset.palette)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.theme = mode
    root.dataset.palette = palette
    const bg = getComputedStyle(root).getPropertyValue('--bg').trim()
    const meta = document.querySelector('meta[name="theme-color"]')
    if (meta && bg) meta.setAttribute('content', bg)
  }, [mode, palette])

  const toggleTheme = useCallback(() => {
    setMode((m) => {
      const next = m === 'dark' ? 'light' : 'dark'
      write('ud-mode', next)
      return next
    })
  }, [])

  const setPalette = useCallback((id) => {
    setPaletteState(id)
    write('palette', id)
  }, [])

  return { theme: mode, toggleTheme, palette, setPalette }
}
