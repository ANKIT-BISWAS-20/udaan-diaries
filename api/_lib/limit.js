import { getDb } from './db.js'

export const LOCK_MS = 24 * 60 * 60 * 1000 // one story, then locked for a day

/** The latest unexpired lock covering any of these keys, as a Date, or null. */
export async function getLock(keys) {
  const db = await getDb()
  const rows = await db.collection('locks').find({ _id: { $in: keys }, expiresAt: { $gt: new Date() } }).toArray()
  if (!rows.length) return null
  return new Date(Math.max(...rows.map((r) => r.expiresAt.getTime())))
}

/**
 * Atomically locks every key for 24 hours. The _id unique constraint makes this race-safe:
 * two parallel submissions can't both win. Returns { ok: true } or { ok: false, retryAt }.
 */
export async function acquireLock(keys) {
  const col = (await getDb()).collection('locks')
  const now = new Date()
  const expiresAt = new Date(now.getTime() + LOCK_MS)
  const taken = []
  for (const key of keys) {
    await col.deleteOne({ _id: key, expiresAt: { $lte: now } }) // clear an expired lock the TTL job hasn't removed yet
    try {
      await col.insertOne({ _id: key, createdAt: now, expiresAt })
      taken.push(key)
    } catch (err) {
      if (err?.code !== 11000) throw err
      if (taken.length) await col.deleteMany({ _id: { $in: taken } })
      return { ok: false, retryAt: (await getLock(keys)) || expiresAt }
    }
  }
  return { ok: true, retryAt: expiresAt }
}

export async function releaseLock(keys) {
  await (await getDb()).collection('locks').deleteMany({ _id: { $in: keys } }).catch(() => {})
}

/** Fixed-window counter, e.g. hit('sign:abc', 12, 3600_000). Returns false once the limit is exceeded. */
export async function hit(key, max, windowMs) {
  const col = (await getDb()).collection('sign_hits')
  const now = new Date()
  await col.deleteOne({ _id: key, expireAt: { $lte: now } })
  const doc = await col.findOneAndUpdate(
    { _id: key },
    { $inc: { n: 1 }, $setOnInsert: { expireAt: new Date(now.getTime() + windowMs) } },
    { upsert: true, returnDocument: 'after' },
  )
  return (doc?.n ?? 1) <= max
}
