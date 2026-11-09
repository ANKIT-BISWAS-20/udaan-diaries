// Build step: renders the page to static HTML (so search engines see all the content without
// running JavaScript), then writes sitemap.xml and robots.txt for the configured site URL.
import { readFileSync, writeFileSync, rmSync } from 'node:fs'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'

const dist = resolve('dist')
const { render } = await import(pathToFileURL(resolve('dist-ssr/entry-server.js')).href)
const { site } = await import(pathToFileURL(resolve('src/config/content.js')).href)
const url = (process.env.SITE_URL || site.url).replace(/\/$/, '')

const html = readFileSync(`${dist}/index.html`, 'utf8')
const out = html.replace('<!--app-html-->', render())
if (out === html) throw new Error('prerender: <!--app-html--> marker not found in dist/index.html')
writeFileSync(`${dist}/index.html`, out)

const today = new Date().toISOString().slice(0, 10)
writeFileSync(`${dist}/sitemap.xml`, `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${url}/</loc><lastmod>${today}</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
</urlset>
`)
writeFileSync(`${dist}/robots.txt`, `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${url}/sitemap.xml\n`)
rmSync('dist-ssr', { recursive: true, force: true })
console.log(`prerendered dist/index.html (${(out.length / 1024).toFixed(0)} KB), sitemap.xml and robots.txt for ${url}`)
