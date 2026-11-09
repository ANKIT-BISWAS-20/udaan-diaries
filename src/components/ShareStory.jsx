import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import LottiePlayer from './LottiePlayer'
import { SectionHead, Icon, Photo } from './ui'
import { api, uploadToCloudinary, formatBytes, formatWait } from '../lib/api'
import { share, site } from '../config'

const MAX_BYTES = share.maxMb * 1024 * 1024
const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
const VIDEO_TYPES = ['video/mp4', 'video/quicktime', 'video/webm']
const ACCEPT = [...IMAGE_TYPES, ...VIDEO_TYPES].join(',')
const LOCK_KEY = 'ud_lock_until'
const uid = () => Math.random().toString(36).slice(2)

const readLock = () => {
  try {
    const t = Number(localStorage.getItem(LOCK_KEY))
    return t > Date.now() ? t : 0
  } catch {
    return 0
  }
}

function Field({ label, as = 'input', hint, ...props }) {
  const Tag = as
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      <Tag {...props} className={as === 'textarea' ? 'input textarea' : 'input'} />
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}

export default function ShareStory() {
  const [form, setForm] = useState({ name: '', handle: '', place: '', title: '', story: '', website: '' })
  const [consent, setConsent] = useState(false)
  const [files, setFiles] = useState([])
  const [drag, setDrag] = useState(false)
  const [phase, setPhase] = useState('idle') // idle | uploading | saving | done
  const [error, setError] = useState('')
  const [lockUntil, setLockUntil] = useState(0) // read after mount so prerendered HTML matches
  const [now, setNow] = useState(Date.now())
  const [result, setResult] = useState(null)
  const input = useRef(null)

  const locked = lockUntil > now
  const total = useMemo(() => files.reduce((n, f) => n + f.file.size, 0), [files])
  const busy = phase === 'uploading' || phase === 'saving'

  // ask the server whether this visitor is already locked (the server is the source of truth)
  useEffect(() => {
    const saved = readLock()
    if (saved) lock(saved)
    api('GET', '/api/status').then((r) => {
      if (r.ok && r.data.locked) lock(new Date(r.data.retryAt).getTime())
    })
  }, [])
  useEffect(() => {
    if (!locked) return
    const t = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(t)
  }, [locked])
  useEffect(() => () => files.forEach((f) => URL.revokeObjectURL(f.preview)), []) // eslint-disable-line

  function lock(until) {
    setLockUntil(until)
    setNow(Date.now())
    try { localStorage.setItem(LOCK_KEY, String(until)) } catch {}
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const addFiles = useCallback((list) => {
    setError('')
    const next = [...files]
    let bytes = total
    for (const file of Array.from(list)) {
      const isImg = IMAGE_TYPES.includes(file.type)
      const isVid = VIDEO_TYPES.includes(file.type)
      if (!isImg && !isVid) { setError(`"${file.name}" isn't a supported photo or video (JPG, PNG, WebP, GIF, AVIF, MP4, MOV, WebM).`); continue }
      if (next.length >= share.maxFiles) { setError(`You can add up to ${share.maxFiles} files.`); break }
      if (bytes + file.size > MAX_BYTES) { setError(`Together your files can be at most ${share.maxMb} MB. "${file.name}" would go over.`); continue }
      bytes += file.size
      next.push({ id: uid(), file, type: isVid ? 'video' : 'image', preview: URL.createObjectURL(file), progress: 0 })
    }
    setFiles(next)
  }, [files, total])

  const removeFile = (id) => {
    setFiles((fs) => {
      const gone = fs.find((f) => f.id === id)
      if (gone) URL.revokeObjectURL(gone.preview)
      return fs.filter((f) => f.id !== id)
    })
  }

  const setProgress = (id, p) => setFiles((fs) => fs.map((f) => (f.id === id ? { ...f, progress: p } : f)))

  async function submit(e) {
    e.preventDefault()
    if (busy || locked) return
    setError('')
    if (form.name.trim().length < 2) return setError('Please tell us your name.')
    if (form.place.trim().length < 2) return setError('Which place is your story about?')
    if (form.story.trim().length < 20) return setError('Tell us a little more: at least a couple of sentences.')
    if (!consent) return setError('Please tick the permission box so we can post your story on Instagram.')

    try {
      let media = []
      if (files.length) {
        setPhase('uploading')
        const sign = await api('POST', '/api/sign', { files: files.map((f) => ({ name: f.file.name, type: f.file.type, size: f.file.size })) })
        if (sign.status === 429) { lock(new Date(sign.data.retryAt).getTime()); setPhase('idle'); return }
        if (!sign.ok) throw new Error(sign.data.error || 'Could not start the upload.')
        for (let i = 0; i < files.length; i++) {
          const f = files[i]
          media.push(
            await uploadToCloudinary(
              { file: f.file, cloudName: sign.data.cloudName, apiKey: sign.data.apiKey, upload: sign.data.uploads[i] },
              (p) => setProgress(f.id, p),
            ),
          )
          setProgress(f.id, 1)
        }
      }
      setPhase('saving')
      const res = await api('POST', '/api/stories', { ...form, consent, media })
      if (res.status === 429) { lock(new Date(res.data.retryAt).getTime()); setPhase('idle'); return }
      if (!res.ok) throw new Error(res.data.error || 'Could not save your story.')
      lock(new Date(res.data.retryAt).getTime())
      setResult(res.data)
      setPhase('done')
      files.forEach((f) => URL.revokeObjectURL(f.preview))
      setFiles([])
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setPhase('idle')
    }
  }

  return (
    <section className="section share" id="share" aria-labelledby="share-title">
      <div className="container share-grid">
        <div className="share-intro">
          <SectionHead title={share.title} sub={share.sub} id="share-title" />
          <figure className="share-photo arch">
            <Photo id="rider" ratio={0.8} sizes="(max-width: 860px) 90vw, 440px" />
          </figure>
          <ul className="share-points">
            <li>Photos and videos, up to <strong>{share.maxMb} MB</strong> in total per story</li>
            <li>Up to {share.maxFiles} files: JPG, PNG, WebP, GIF, AVIF, MP4, MOV or WebM</li>
            <li>Picked stories are posted on Instagram, not on this website</li>
            <li>{share.lockNote}</li>
          </ul>
        </div>

        <div className="share-card">
          {phase === 'done' ? (
            <div key="done" className="share-state fade-in" role="status">
              <LottiePlayer id="success" className="state-lottie" />
              <h3>{share.doneTitle}</h3>
              <p>{share.doneText}</p>
              <a className="btn btn-ghost" href={site.instagram} target="_blank" rel="noopener">{Icon.insta} Follow {site.handle}</a>
              <p className="muted">You can share another story in {formatWait(lockUntil - now)}.</p>
            </div>
          ) : locked ? (
            <div key="locked" className="share-state fade-in">
              <LottiePlayer id="empty" className="state-lottie" />
              <h3>One story a day</h3>
              <p>You’ve already shared a story. Come back in <strong>{formatWait(lockUntil - now)}</strong> to share another journey.</p>
              <a className="btn btn-ghost" href={site.instagram} target="_blank" rel="noopener">{Icon.insta} Follow {site.handle}</a>
            </div>
          ) : (
            <form key="form" className="fade-in" onSubmit={submit} noValidate aria-label="Share your travel story">
              <div className="form-row">
                <Field label="Your name" name="name" value={form.name} onChange={set('name')} maxLength={80} autoComplete="name" required />
                <Field label="Instagram (optional)" name="handle" value={form.handle} onChange={set('handle')} maxLength={40} placeholder="@yourhandle" hint="So we can tag you if we post it" />
              </div>
              <div className="form-row">
                <Field label="Place" name="place" value={form.place} onChange={set('place')} maxLength={80} placeholder="e.g. Hampi, Karnataka" required />
                <Field label="Story title (optional)" name="title" value={form.title} onChange={set('title')} maxLength={100} />
              </div>
              <Field label="Your story" as="textarea" name="story" rows={7} value={form.story} onChange={set('story')} maxLength={share.maxChars} hint={`${form.story.length}/${share.maxChars}`} required />

              {/* honeypot: hidden from people, bots fill it in */}
              <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" name="website" value={form.website} onChange={set('website')} />

              <div
                className={`dropzone ${drag ? 'drag' : ''}`}
                onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
                onDragLeave={() => setDrag(false)}
                onDrop={(e) => { e.preventDefault(); setDrag(false); addFiles(e.dataTransfer.files) }}
                onClick={() => input.current?.click()}
                role="button"
                tabIndex={0}
                aria-label="Add photos or videos"
                onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && (e.preventDefault(), input.current?.click())}
              >
                <LottiePlayer id="upload" className="drop-lottie" />
                <p><strong>Drop photos or videos here</strong> or tap to choose</p>
                <span className="muted">{formatBytes(total)} of {share.maxMb} MB used</span>
                <div className="meter"><span style={{ width: `${Math.min(100, (total / MAX_BYTES) * 100)}%` }} /></div>
                <input ref={input} type="file" accept={ACCEPT} multiple hidden onChange={(e) => { addFiles(e.target.files); e.target.value = '' }} />
              </div>

              {files.length > 0 && (
                <ul className="previews">
                  {files.map((f) => (
                    <li key={f.id} className="preview">
                      {f.type === 'video' ? <video src={f.preview} muted playsInline /> : <img src={f.preview} alt="" draggable="false" />}
                      <span className="kind">{f.type === 'video' ? 'Video' : 'Photo'}, {formatBytes(f.file.size)}</span>
                      {phase === 'uploading' && <span className="bar"><span style={{ width: `${f.progress * 100}%` }} /></span>}
                      {!busy && <button type="button" className="x" aria-label="Remove file" onClick={() => removeFile(f.id)}>{Icon.close}</button>}
                    </li>
                  ))}
                </ul>
              )}

              <label className="check">
                <input type="checkbox" checked={consent} onChange={(e) => setConsent(e.target.checked)} />
                <span>{share.consent}</span>
              </label>

              {error && <p className="error" role="alert">{error}</p>}

              <button className="btn btn-primary btn-block" disabled={busy}>
                {phase === 'uploading' ? 'Uploading your media…' : phase === 'saving' ? 'Sending your story…' : 'Send my story'}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
