import { useEffect, useState } from 'react'
import { animationCache } from '../config'

const memory = new Map()

/**
 * Loads a Lottie JSON with three layers of caching:
 * 1. in-memory (same page), 2. Cache Storage (survives reloads and revisits), 3. network.
 * Resolves to null on any failure so the caller can use its built-in fallback.
 */
export function loadLottie(url) {
  if (!url) return Promise.resolve(null)
  if (memory.has(url)) return memory.get(url)

  const job = (async () => {
    try {
      const store = 'caches' in window ? await caches.open(animationCache.name) : null
      let res = store ? await store.match(url) : null
      if (!res) {
        res = await fetch(url, { mode: 'cors' })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        if (store) await store.put(url, res.clone())
      }
      return await res.json()
    } catch {
      memory.delete(url)
      return null
    }
  })()

  memory.set(url, job)
  return job
}

export function preloadLottie(urls) {
  urls.filter(Boolean).forEach((u) => loadLottie(u))
}

// ── Theme tinting ─────────────────────────────────────────────
// Any fill/stroke named "accent", "secondary" or "fg" takes the live theme colour.

function hexToRgba(raw, fallback = [0.4, 0.4, 0.9, 1]) {
  const h = (raw || '').trim().replace('#', '')
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h
  if (!/^[0-9a-f]{6}$/i.test(full)) return fallback
  const n = parseInt(full, 16)
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255, 1]
}

function readColors() {
  const cs = getComputedStyle(document.documentElement)
  const get = (name) => hexToRgba(cs.getPropertyValue(name))
  return {
    accent: get('--accent'),
    secondary: get('--accent-2'),
    fg: get('--fg'),
    bg: get('--bg'),
    card: get('--card'),
    muted: get('--muted'),
  }
}

/** Live theme colours for tinting. null until mounted (nothing to tint during prerender). */
export function useThemeColors() {
  const [colors, setColors] = useState(null)
  useEffect(() => {
    const update = () =>
      setColors((prev) => {
        const next = readColors()
        return prev && JSON.stringify(next) === JSON.stringify(prev) ? prev : next
      })
    update()
    const mo = new MutationObserver(update)
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-palette'] })
    return () => mo.disconnect()
  }, [])
  return colors
}

export function tintLottie(json, colors) {
  const copy = structuredClone(json)
  const walk = (o) => {
    if (Array.isArray(o)) return o.forEach(walk)
    if (!o || typeof o !== 'object') return
    if ((o.ty === 'fl' || o.ty === 'st') && typeof o.nm === 'string' && o.c) {
      const c = colors[o.nm.toLowerCase()]
      if (c) o.c = { a: 0, k: c }
    }
    Object.values(o).forEach(walk)
  }
  walk(copy)
  return copy
}
