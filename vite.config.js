import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { paletteCss, themeBootScript } from './src/config/theme.js'
import { site } from './src/config/content.js'
import { jsonLd } from './src/config/seo.js'

const SITE_URL = (process.env.SITE_URL || site.url).replace(/\/$/, '')

// Injects the palettes, the no-flash theme script, the site URL and JSON-LD into index.html.
const htmlInjector = () => ({
  name: 'udaan-html',
  transformIndexHtml: {
    order: 'pre', // before Vite parses the URLs in the HTML
    handler: (html) => ({
      html: html
        .replaceAll('%SITE_URL%', SITE_URL)
        .replaceAll('%SITE_DESCRIPTION%', site.description)
        .replace('<!--json-ld-->', `<script type="application/ld+json">${JSON.stringify(jsonLd(SITE_URL))}</script>`),
      tags: [
        { tag: 'style', children: paletteCss(), injectTo: 'head-prepend' },
        { tag: 'script', children: themeBootScript(), injectTo: 'head-prepend' },
      ],
    }),
  },
})

export default defineConfig({
  plugins: [react(), htmlInjector()],
  // GSAP ships ES modules without "type": "module"; bundle it for the prerender step.
  ssr: { noExternal: ['gsap', '@gsap/react'] },
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => (id.includes('node_modules/gsap') || id.includes('@gsap') ? 'gsap' : undefined),
      },
    },
  },
})
