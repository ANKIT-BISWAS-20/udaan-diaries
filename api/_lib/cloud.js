import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
})

export { cloudinary }

export const MAX_BYTES = 100 * 1024 * 1024 // 100 MB per submit
export const MAX_FILES = 8
export const FOLDER = 'udaan-diaries/stories'

// Images and videos only: nothing else is ever signed for upload
export const IMAGE_MIME = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
export const VIDEO_MIME = ['video/mp4', 'video/quicktime', 'video/webm']
export const IMAGE_FORMATS = ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif']
export const VIDEO_FORMATS = ['mp4', 'mov', 'webm']

export const configured = () =>
  Boolean(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
