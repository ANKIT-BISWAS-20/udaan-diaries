/** Small fetch helper: always resolves to { ok, status, data } so callers never need try/catch for HTTP errors. */
export async function api(method, url, body) {
  try {
    const res = await fetch(url, {
      method,
      credentials: 'same-origin',
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    })
    const data = await res.json().catch(() => ({}))
    return { ok: res.ok, status: res.status, data }
  } catch {
    return { ok: false, status: 0, data: { error: 'Network problem. Please check your connection and try again.' } }
  }
}

/** Uploads one file straight to Cloudinary (never through our server) with progress callbacks. */
export function uploadToCloudinary({ file, cloudName, apiKey, upload }, onProgress) {
  return new Promise((resolve, reject) => {
    const fd = new FormData()
    fd.append('file', file)
    fd.append('api_key', apiKey)
    fd.append('timestamp', upload.timestamp)
    fd.append('signature', upload.signature)
    fd.append('public_id', upload.publicId)
    fd.append('allowed_formats', upload.allowedFormats)
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${upload.resourceType}/upload`)
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress(e.loaded / e.total)
    xhr.onerror = () => reject(new Error('Upload failed. Please check your connection.'))
    xhr.onload = () => {
      let out = {}
      try { out = JSON.parse(xhr.responseText) } catch {}
      if (xhr.status >= 200 && xhr.status < 300 && out.public_id) {
        resolve({ public_id: out.public_id, resource_type: upload.resourceType })
      } else {
        reject(new Error(out?.error?.message || 'Upload was rejected.'))
      }
    }
    xhr.send(fd)
  })
}

export function formatWait(ms) {
  const m = Math.max(1, Math.ceil(ms / 60000))
  const h = Math.floor(m / 60)
  return h ? `${h}h ${m % 60}m` : `${m}m`
}

export const formatBytes = (n) => (n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`)
