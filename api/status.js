// GET /api/status: is this visitor currently locked out of submitting?
import { identify } from './_lib/identity.js'
import { getLock } from './_lib/limit.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'GET') return res.status(405).json({ ok: false, error: 'Method not allowed' })
  try {
    const { keys } = identify(req, res)
    const until = await getLock(keys)
    return res.status(200).json({ ok: true, locked: Boolean(until), retryAt: until ? until.toISOString() : null })
  } catch (err) {
    console.error('status failed:', err.message)
    return res.status(200).json({ ok: true, locked: false }) // never block the form because of a status hiccup
  }
}
