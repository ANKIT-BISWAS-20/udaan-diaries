// ─────────────────────────────────────────────────────────────
//  PHOTOS: free stock photos from Unsplash (https://unsplash.com/license: free for commercial use).
//  To swap one: open a photo on Unsplash, copy the id from its image address (the part after
//  "photo-"), and update the entry with a truthful alt text and the photographer's credit.
//  If a photo fails to load, the destination's illustration is shown instead.
// ─────────────────────────────────────────────────────────────
export const photos = {
  jaipur: {
    id: '1524229648276-e66561fe45a9',
    alt: 'The pink honeycomb façade of Hawa Mahal, the Palace of Winds, in Jaipur',
    caption: 'Hawa Mahal, Jaipur',
    by: 'Annie Spratt', page: 'https://unsplash.com/photos/hawa-mahal-india-RugN1OsUwHM',
  },
  kerala: {
    id: '1593693411515-c20261bcad6e',
    alt: 'A traditional houseboat on the palm-lined backwaters of Alappuzha, Kerala',
    caption: 'Alappuzha backwaters, Kerala',
    by: 'Abhishek Prasad', page: 'https://unsplash.com/photos/houseboat-on-alappuzha-backwaters-ii0oWs5abCo',
  },
  goa: {
    id: '1614082242765-7c98ca0f3df3',
    alt: 'Colourful beach huts and palm trees on a sandy shore in Goa',
    caption: 'Beach huts, Goa',
    by: 'Sumit Sourav', page: 'https://unsplash.com/photos/beach-huts-and-palm-trees-eSRtxPd9q1c',
  },
  ladakh: {
    id: '1593118845043-359e5f628214',
    alt: 'Prayer flags beside a blue lake ringed by bare mountains in Ladakh',
    caption: 'Prayer flags by the lake, Ladakh',
    by: 'Hans-Jurgen Mager', page: 'https://unsplash.com/photos/blue-yellow-and-red-textile-on-gray-sand-near-lake-and-mountain-during-daytime-MrW_AqAFNR0',
  },
  kashmir: {
    id: '1595815771614-ade9d652a65d',
    alt: 'A wooden houseboat on a still lake below snow-covered mountains in Kashmir',
    caption: 'Houseboat on the lake, Kashmir',
    by: 'Isa', page: 'https://unsplash.com/photos/green-and-brown-wooden-house-on-lake-near-snow-covered-mountain-during-daytime-72GwiojCwoI',
  },
  varanasi: {
    id: '1714825755984-2c5967d98e08',
    alt: 'A priest holding up a flaming lamp during the Ganga aarti in Varanasi',
    caption: 'Ganga aarti, Varanasi',
    by: 'Pratyush Mishra', page: 'https://unsplash.com/photos/a-man-standing-in-front-of-a-string-of-lights-nW69xTgxW78',
  },
  agra: {
    id: '1524492412937-b28074a5d7da',
    alt: 'The Taj Mahal at sunrise, reflected in the long pool of its garden in Agra',
    caption: 'Taj Mahal at sunrise, Agra',
    by: 'Julian Yu', page: 'https://unsplash.com/photos/photo-of-taj-mahal-_WuPjE-MPHo',
  },
  rider: {
    id: '1581793745862-99fde7fa73d2',
    alt: 'A motorcyclist riding a mountain road in Ladakh',
    caption: 'On the road, Ladakh',
    by: 'Speedy Sandy', page: 'https://unsplash.com/photos/man-riding-motorcycle-on-road-during-daytime-IJfpVYlRv5I',
  },
}

export const photoSrc = (key, width = 900, ratio) => {
  const p = photos[key]
  if (!p) return ''
  const h = ratio ? `&h=${Math.round(width * ratio)}` : ''
  return `https://images.unsplash.com/photo-${p.id}?auto=format&fit=crop&w=${width}${h}&q=70`
}

/** src + srcSet for <img>. ratio = height / width, so the crop matches the frame. */
export const photoSet = (key, ratio, widths = [480, 800, 1200, 1600]) => ({
  src: photoSrc(key, widths[1], ratio),
  srcSet: widths.map((w) => `${photoSrc(key, w, ratio)} ${w}w`).join(', '),
})
