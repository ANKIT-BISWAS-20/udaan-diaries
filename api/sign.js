// POST /api/sign: validates the files a visitor wants to upload and returns short-lived Cloudinary signatures.
// The files then go straight from the browser to Cloudinary (Vercel functions can't accept 100 MB bodies).
import { randomBytes } from 'node:crypto'
import { cloudinary, configured, FOLDER, MAX_BYTES, MAX_FILES, IMAGE_MIME, VIDEO_MIME, IMAGE_FORMATS, VIDEO_FORMATS } from './_lib/cloud.js'
import { identify } from './_lib/identity.js'
import { getLock, hit } from './_lib/limit.js'

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store')
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }
  if (!configured()) return res.status(500).json({ ok: false, error: 'Uploads are not configured yet.' })

  const body = typeof req.body === 'string' ? safeJson(req.body) : req.body || {}
  const files = Array.isArray(body.files) ? body.files : []
  if (!files.length || files.length > MAX_FILES) {
    return res.status(400).json({ ok: false, error: `Choose between 1 and ${MAX_FILES} files.` })
  }

  let total = 0
  for (const f of files) {
    const size = Number(f?.size)
    if (!Number.isFinite(size) || size <= 0) return res.status(400).json({ ok: false, error: 'One of the files looks empty.' })
    if (![...IMAGE_MIME, ...VIDEO_MIME].includes(f?.type)) {
      return res.status(400).json({ ok: false, error: 'Only photos and videos can be uploaded.' })
    }
    total += size
  }
  if (total > MAX_BYTES) return res.status(400).json({ ok: false, error: 'Your files add up to more than 100 MB.' })

  try {
    const { keys, devTag } = identify(req, res)

    const until = await getLock(keys)
    if (until) return res.status(429).json({ ok: false, error: 'You have already shared a story today.', retryAt: until.toISOString() })

    // cap how often signatures can be requested, so nobody can use us as a free upload pipe
    const [a, b] = await Promise.all([hit(`sign:${keys[0]}`, 10, 3600_000), hit(`sign:${keys[1]}`, 30, 3600_000)])
    if (!a || !b) return res.status(429).json({ ok: false, error: 'Too many attempts. Please try again in an hour.', retryAt: new Date(Date.now() + 3600_000).toISOString() })

    const secret = process.env.CLOUDINARY_API_SECRET
    const timestamp = Math.floor(Date.now() / 1000)
    const uploads = files.map((f) => {
      const isVideo = VIDEO_MIME.includes(f.type)
      const publicId = `${FOLDER}/${devTag}-${randomBytes(8).toString('hex')}`
      const allowedFormats = (isVideo ? VIDEO_FORMATS : IMAGE_FORMATS).join(',')
      const signature = cloudinary.utils.api_sign_request({ allowed_formats: allowedFormats, public_id: publicId, timestamp }, secret)
      return { resourceType: isVideo ? 'video' : 'image', publicId, timestamp, signature, allowedFormats }
    })

    return res.status(200).json({ ok: true, cloudName: process.env.CLOUDINARY_CLOUD_NAME, apiKey: process.env.CLOUDINARY_API_KEY, uploads })
  } catch (err) {
    console.error('sign failed:', err.message)
    return res.status(500).json({ ok: false, error: 'Could not start the upload right now.' })
  }
}

function safeJson(s) {
  try { return JSON.parse(s) } catch { return {} }
}
