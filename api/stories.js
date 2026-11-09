// POST /api/stories: save a story (media is already on Cloudinary) and lock the visitor for 24 hours.
// Stories are never listed publicly: the team reviews them in MongoDB and posts the chosen ones on Instagram.
import { cloudinary, configured, FOLDER, MAX_BYTES, MAX_FILES, IMAGE_FORMATS, VIDEO_FORMATS } from './_lib/cloud.js'
import { getDb } from './_lib/db.js'
import { identify } from './_lib/identity.js'
import { acquireLock, getLock, releaseLock } from './_lib/limit.js'

const clean = (v, max) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '')
const safeJson = (s) => { try { return JSON.parse(s) } catch { return {} } }

export default async function handler(req, res) {
  if (req.method === 'POST') return create(req, res)
  res.setHeader('Allow', 'POST')
  return res.status(405).json({ ok: false, error: 'Method not allowed' })
}

// ── POST ─────────────────────────────────────────────────────
async function create(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  const b = typeof req.body === 'string' ? safeJson(req.body) : req.body || {}

  // honeypot: real visitors never fill this hidden field, bots do. Pretend success.
  if (clean(b.website, 200)) return res.status(200).json({ ok: true, status: 'pending', retryAt: new Date(Date.now() + 86400000).toISOString() })

  const handle = clean(b.handle, 40).replace(/^@/, '')
  const doc = {
    name: clean(b.name, 80),
    handle: /^[A-Za-z0-9._]{1,30}$/.test(handle) ? handle : '',
    place: clean(b.place, 80),
    title: clean(b.title, 100),
    story: clean(b.story, 2500),
  }
  if (doc.name.length < 2) return bad(res, 'Please tell us your name.')
  if (doc.place.length < 2) return bad(res, 'Which place is your story about?')
  if (doc.story.length < 20) return bad(res, 'Please tell us a little more about your journey.')
  if (b.consent !== true) return bad(res, 'Please confirm you have permission to share these photos and videos.')

  const media = Array.isArray(b.media) ? b.media : []
  if (media.length > MAX_FILES) return bad(res, `You can add up to ${MAX_FILES} files.`)
  if (media.length && !configured()) return res.status(500).json({ ok: false, error: 'Uploads are not configured yet.' })

  let identity
  let verified = []
  try {
    identity = identify(req, res)

    const until = await getLock(identity.keys)
    if (until) return res.status(429).json({ ok: false, error: 'You have already shared a story today.', retryAt: until.toISOString() })

    // 1) only accept uploads this visitor was signed for
    const prefix = `${FOLDER}/${identity.devTag}-`
    const items = media.map((m) => ({ id: clean(m?.public_id, 200), type: m?.resource_type === 'video' ? 'video' : m?.resource_type === 'image' ? 'image' : '' }))
    if (items.some((m) => !m.type || !m.id.startsWith(prefix) || !/^[\w\-/]+$/.test(m.id))) return bad(res, 'One of the uploads could not be verified.')

    // 2) ask Cloudinary what was really uploaded (type, format and size), never trust the browser's numbers
    for (const type of ['image', 'video']) {
      const ids = items.filter((m) => m.type === type).map((m) => m.id)
      if (!ids.length) continue
      const found = await cloudinary.api.resources_by_ids(ids, { resource_type: type, type: 'upload' })
      verified.push(...(found.resources || []).map((r) => ({ type, public_id: r.public_id, bytes: r.bytes, format: r.format })))
      if ((found.resources || []).length !== ids.length) return reject(res, items, 'Some uploads did not finish. Please try again.')
    }
    const total = verified.reduce((n, m) => n + (m.bytes || 0), 0)
    const okFormat = (m) => (m.type === 'image' ? IMAGE_FORMATS : VIDEO_FORMATS).includes(String(m.format).toLowerCase())
    if (total > MAX_BYTES) return reject(res, items, 'Your files add up to more than 100 MB.')
    if (!verified.every(okFormat)) return reject(res, items, 'Only photos and videos are allowed.')

    // 3) lock first (atomic), then save. If saving fails the lock is released again.
    const lock = await acquireLock(identity.keys)
    if (!lock.ok) return res.status(429).json({ ok: false, error: 'You have already shared a story today.', retryAt: lock.retryAt.toISOString() })

    const status = 'new' // change to 'posted' or 'skipped' in Atlas once you've reviewed it
    try {
      const db = await getDb()
      await db.collection('stories').insertOne({
        ...doc,
        media: verified,
        status,
        createdAt: new Date(),
        netHash: identity.netHash,
        userAgent: clean(req.headers['user-agent'], 300),
      })
    } catch (err) {
      await releaseLock(identity.keys)
      throw err
    }
    return res.status(200).json({ ok: true, status, retryAt: lock.retryAt.toISOString() })
  } catch (err) {
    console.error('story save failed:', err.message)
    return res.status(500).json({ ok: false, error: 'Could not save your story right now. Please try again.' })
  }
}

const bad = (res, error) => res.status(400).json({ ok: false, error })

/** Rejects a submission and deletes whatever was uploaded for it, so Cloudinary doesn't fill with orphans. */
async function reject(res, items, error) {
  for (const type of ['image', 'video']) {
    const ids = items.filter((m) => m.type === type).map((m) => m.id)
    if (ids.length) await cloudinary.api.delete_resources(ids, { resource_type: type }).catch(() => {})
  }
  return bad(res, error)
}
