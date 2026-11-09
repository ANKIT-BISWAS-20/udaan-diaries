# Udaan Diaries

Website for the Instagram travel page [@udaan.diaries_](https://www.instagram.com/udaan.diaries_/).
React + Vite + GSAP (ScrollTrigger, ScrollSmoother, SplitText, MotionPath) + Lottie, Google Sans Flex, with a Vercel serverless API that stores stories in MongoDB and media on Cloudinary.

## Run it

```bash
npm install
npm i -g vercel
vercel dev        # site + /api on http://localhost:3000  (plain `npm run dev` doesn't serve /api)
npm run build     # production build in /dist (prerendered HTML + sitemap.xml + robots.txt)
```

Secrets live in `.env.local` (git-ignored). See `.env.example`. On Vercel add the same variables under Project → Settings → Environment Variables, then redeploy.
MongoDB Atlas → Network Access must allow `0.0.0.0/0` (Vercel has no fixed IPs).

| Variable | Purpose |
|---|---|
| `MONGODB_URI` | Same cluster as the studio-portfolio project. Data goes to its own database. |
| `MONGODB_DB` | `udaan_diaries` (collections `stories`, `locks`, `sign_hits`) |
| `CLOUDINARY_CLOUD_NAME` / `_API_KEY` / `_API_SECRET` | Media storage |
| `SITE_URL` (optional) | Your real domain, e.g. `https://udaandiaries.in`. Overrides `site.url` in `content.js` for SEO tags. |

## How story submission works

1. The visitor picks photos/videos (max **100 MB total**, 8 files; images and videos only).
2. `POST /api/sign` checks the file list, checks the visitor isn't locked, and returns Cloudinary signatures. Only image/video formats are ever signed.
3. The browser uploads straight to Cloudinary with a progress bar (Vercel functions can't accept 100 MB request bodies).
4. `POST /api/stories` re-checks everything with Cloudinary's Admin API (real file type, format, total size; deletes the upload if it fails), takes the 24-hour lock, then saves the story.

**Rate limit.** After one successful submission the visitor is locked for 24 hours. The lock is stored in MongoDB (`locks`, auto-expiring) under two keys: an HttpOnly device cookie and a salted hash of IP + browser. Either one is enough to block, so clearing cookies or switching Wi-Fi alone doesn't bypass it. It is atomic, so two parallel submits can't both succeed. Signature requests are also capped per hour. Trade-off: people sharing a network and an identical browser string (rare) can block each other. Raw IPs are never stored.

**Reviewing stories.** Stories are **not shown on the website**. New ones are saved in `udaan_diaries.stories` with `status: "new"`. Read them in MongoDB Atlas, download the media from Cloudinary (the `public_id`s are on each story), post the ones you pick on Instagram, then set `status` to `"posted"` or `"skipped"` to keep track. If someone gave their handle (`handle`), tag them.

**Cloudinary plan limits.** Your Cloudinary plan has its own per-file size limits (the free plan is lower than 100 MB for images). If a file is too large for your plan, the visitor sees Cloudinary's message.

## No text selection

`src/styles.css` disables selection and the long-press callout everywhere except form fields (they must stay selectable or typing breaks on iPhones). This is a CSS deterrent only: it can't stop someone who views the page source or screenshots it.

## Customising

Everything editable is in `src/config/`:

| File | Controls |
|---|---|
| `content.js` | All the words: hero, destinations, folk arts, form copy |
| `theme.js` | All colours (five palettes, light and dark) |
| `animations.js` | Lottie slots |
| `images.js` | Unsplash photos (hero arch, destination postcards, share section) with credits |
| `seo.js` | Structured data (JSON-LD) for search engines |

**Lottie.** The hero bird is a standalone Lottie file, `src/animations/bird.json` (regenerate with `npm run bird`). Diya, lotus bloom and upload animations are in `src/animations/fallbacks.js`. To use a LottieFiles animation instead: download it as Lottie JSON, drop it in `public/lottie/`, and set `url: '/lottie/yourfile.json'` for that slot. Built-ins re-colour with the palette picker; for LottieFiles animations name a fill/stroke `accent`, `secondary` or `fg` in their editor to get the same.

**Images.** Destination and hero photos are free Unsplash photos (Unsplash licence, commercial use allowed), credited in the footer. To swap one, change its id in `images.js`. If a photo fails to load, the original SVG illustration shows instead. Folk-art tiles are original illustrations.

**Instagram.** The handle and link are in `src/config/content.js` (`site`).

## SEO

- `npm run build` prerenders the whole page into `dist/index.html`, so search engines read all the text without running JavaScript. The browser then hydrates it.
- Title, description, canonical, Open Graph and Twitter tags are in `index.html`; `%SITE_URL%` is filled in at build time from `site.url` (or the `SITE_URL` env var).
- JSON-LD (Organization, WebSite, the destinations and folk arts) comes from `src/config/seo.js`.
- `sitemap.xml` and `robots.txt` are generated into `dist/`. After going live, add the site in Google Search Console and submit `/sitemap.xml`.

## Theme

The site always opens in light mode (`defaultMode: 'light'` in `theme.js`); visitors can still switch to dark with the moon button.
