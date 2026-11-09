import { createHash, randomBytes } from 'node:crypto'

const SALT = () => process.env.RATE_SALT || process.env.CLOUDINARY_API_SECRET || 'udaan-diaries'
const sha = (s) => createHash('sha256').update(`${SALT()}|${s}`).digest('hex')

const parseCookies = (header = '') =>
  Object.fromEntries(
    header.split(';').map((c) => c.trim().split('=')).filter((p) => p[0]).map(([k, ...v]) => [k, decodeURIComponent(v.join('='))]),
  )

/**
 * Who is this visitor? Two independent keys, so clearing cookies alone (or changing network alone) doesn't dodge the lock:
 *   dev: a random id in an HttpOnly cookie that we set,
 *   net: a hash of IP + browser string.
 * Only salted hashes are stored, never the raw IP.
 */
export function identify(req, res) {
  let dev = parseCookies(req.headers.cookie).ud_dev
  if (!/^[a-f0-9]{32}$/.test(dev || '')) {
    dev = randomBytes(16).toString('hex')
    const secure = req.headers['x-forwarded-proto'] === 'https' ? '; Secure' : ''
    res.setHeader('Set-Cookie', `ud_dev=${dev}; Path=/; Max-Age=31536000; HttpOnly; SameSite=Lax${secure}`)
  }
  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim()
  const ua = String(req.headers['user-agent'] || '').slice(0, 200)
  const devHash = sha(`dev:${dev}`)
  const netHash = sha(`net:${ip}|${ua}`)
  return {
    keys: [`dev:${devHash}`, `net:${netHash}`],
    devTag: devHash.slice(0, 12), // goes into the Cloudinary public_id so people can only submit their own uploads
    netHash,
  }
}
