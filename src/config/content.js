// ─────────────────────────────────────────────────────────────
//  CONTENT: all the words on the site. Edit here, no component changes needed.
// ─────────────────────────────────────────────────────────────
export const site = {
  name: 'Udaan Diaries',
  handle: '@udaan.diaries_',
  instagram: 'https://www.instagram.com/udaan.diaries_/',
  // ⚠ Set this to your real domain (no trailing slash). Used for canonical links, Open Graph,
  // sitemap.xml and robots.txt. You can also set SITE_URL in Vercel's environment variables.
  url: 'https://udaan-diaries.vercel.app',
  tagline: 'Stories from every corner of India',
  hindi: 'उड़ान डायरीज़',
  description:
    'Udaan Diaries is an Indian travel diary on Instagram. Explore Jaipur, Kerala, Ladakh, Varanasi, Kashmir, Goa and Agra, discover folk art trails, and send us your own travel story to be featured on @udaan.diaries_.',
}

export const nav = [
  { href: '#destinations', label: 'Destinations' },
  { href: '#threads', label: 'Folk art' },
  { href: '#how', label: 'How it works' },
  { href: '#share', label: 'Share your story' },
]

// Each word is paired with a destination photo (by id) that shows in the hero arch at the same time.
export const hero = {
  before: 'Take flight across',
  words: [
    { word: 'Rajasthan', photo: 'jaipur' },
    { word: 'Kerala', photo: 'kerala' },
    { word: 'Ladakh', photo: 'ladakh' },
    { word: 'Varanasi', photo: 'varanasi' },
    { word: 'Kashmir', photo: 'kashmir' },
    { word: 'Goa', photo: 'goa' },
    { word: 'Agra', photo: 'agra' },
  ],
  after: 'one diary at a time.',
  sub: 'Udaan means flight. We collect Indian journeys (forts and backwaters, folk art and chai stops) and share the best ones on Instagram.',
  primary: { label: 'Follow on Instagram', href: site.instagram },
  secondary: { label: 'Share your story', href: '#share' },
}

export const places = ['Jaipur', 'Hampi', 'Munnar', 'Spiti', 'Varanasi', 'Shillong', 'Udaipur', 'Gokarna', 'Srinagar', 'Pondicherry', 'Kutch', 'Darjeeling']

// `id` is the key for the photo in images.js; `scene` is the illustration shown if the photo can't load.
export const destinations = {
  title: 'Pick a postcard',
  sub: 'Seven corners of India we keep flying back to. Scroll sideways through the route.',
  endTitle: 'Been somewhere we haven’t?',
  endText: 'Send us the story. The best ones get posted on our Instagram, with credit to you.',
  items: [
    { id: 'jaipur', scene: 'jaipur', title: 'Jaipur & the Pink City', region: 'Rajasthan', vibe: 'Jharokhas, bazaars and forts at golden hour.', tags: ['Forts', 'Bazaars', 'Block print'] },
    { id: 'kerala', scene: 'kerala', title: 'Alleppey Backwaters', region: 'Kerala', vibe: 'Houseboats, coconut palms and slow green water.', tags: ['Backwaters', 'Food', 'Slow travel'] },
    { id: 'goa', scene: null, title: 'Goa’s Quiet Coves', region: 'Goa', vibe: 'Beach shacks, Portuguese lanes and sunsets that take their time.', tags: ['Beaches', 'Seafood', 'Heritage'] },
    { id: 'ladakh', scene: 'ladakh', title: 'Pangong & Ladakh', region: 'Ladakh', vibe: 'Prayer flags, thin air and endless mountain roads.', tags: ['Mountains', 'Monasteries', 'Roadtrips'] },
    { id: 'kashmir', scene: 'kashmir', title: 'Dal Lake, Srinagar', region: 'Kashmir', vibe: 'Houseboats, shikaras and snow on the horizon.', tags: ['Lakes', 'Gardens', 'Winters'] },
    { id: 'varanasi', scene: 'varanasi', title: 'Varanasi Ghats', region: 'Uttar Pradesh', vibe: 'Dawn boats, evening aarti and a river of diyas.', tags: ['Spiritual', 'Culture', 'Photography'] },
    { id: 'agra', scene: 'agra', title: 'Agra & the Taj', region: 'Uttar Pradesh', vibe: 'Marble, symmetry and sunrise reflections.', tags: ['Heritage', 'Sunrise', 'Architecture'] },
  ],
}

export const threads = {
  title: 'Every road has an art',
  sub: 'Folk traditions are the quiet souvenirs of a journey. Four we love, and where to find them.',
  items: [
    { art: 'madhubani', title: 'Madhubani', place: 'Mithila, Bihar', text: 'Fish, peacocks and suns in bold double lines, once painted on mud walls for weddings.' },
    { art: 'warli', title: 'Warli', place: 'Sahyadri hills, Maharashtra', text: 'Circles, triangles and dancing figures drawn in white rice paste on red earth.' },
    { art: 'kolam', title: 'Kolam', place: 'Tamil Nadu', text: 'Rice-flour dots joined by looping lines, drawn at the doorstep every dawn.' },
    { art: 'blockprint', title: 'Block print', place: 'Bagru & Sanganer, Rajasthan', text: 'Hand-carved wooden blocks and natural dyes, patterns repeating like a heartbeat.' },
  ],
}

// Accepted stories are not shown on this website: they are posted on Instagram.
export const how = {
  title: 'From your notebook to our feed',
  sub: 'Stories aren’t published on this website. We share the ones we pick on Instagram.',
  steps: [
    { title: 'You send it', text: 'Write about one place and add up to 8 photos or videos.' },
    { title: 'We read every one', text: 'Our team reads each story. It can take a few days.' },
    { title: 'It goes on Instagram', text: 'If we pick yours, we post it on @udaan.diaries_ and credit you by name (and tag your handle if you add it).' },
  ],
}

export const share = {
  title: 'Your journey belongs here',
  sub: 'Send us a story with photos or a short video. We read every one, and the ones we pick are posted on our Instagram.',
  maxMb: 100,
  maxFiles: 8,
  maxChars: 2500,
  lockNote: 'You can send one story per day.',
  consent:
    'I took these photos/videos myself (or have permission), and I’m happy for Udaan Diaries to post my story, photos and name on Instagram (@udaan.diaries_).',
  doneTitle: 'Dhanyavaad! Your story has taken flight.',
  doneText: 'We’ll read it soon. If it’s picked, it will be posted on Instagram. Follow @udaan.diaries_ so you don’t miss it.',
}
