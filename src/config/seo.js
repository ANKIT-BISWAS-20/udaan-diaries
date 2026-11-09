// Structured data (JSON-LD) for search engines, built from the site content.
import { site, destinations, threads } from './content.js'
import { photoSrc } from './images.js'

export function jsonLd(url) {
  const org = {
    '@type': 'Organization',
    '@id': `${url}/#org`,
    name: site.name,
    alternateName: site.hindi,
    url: `${url}/`,
    logo: `${url}/icon-512.png`,
    sameAs: [site.instagram],
  }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      org,
      { '@type': 'WebSite', '@id': `${url}/#website`, url: `${url}/`, name: site.name, description: site.description, inLanguage: 'en-IN', publisher: { '@id': `${url}/#org` } },
      {
        '@type': 'WebPage', '@id': `${url}/#page`, url: `${url}/`, name: `${site.name}: ${site.tagline}`, description: site.description,
        isPartOf: { '@id': `${url}/#website` }, about: { '@type': 'Country', name: 'India' }, inLanguage: 'en-IN',
        primaryImageOfPage: { '@type': 'ImageObject', url: photoSrc('jaipur', 1200) },
      },
      {
        '@type': 'ItemList', name: 'Destinations in India', itemListOrder: 'https://schema.org/ItemListUnordered',
        itemListElement: destinations.items.map((d, i) => ({
          '@type': 'ListItem', position: i + 1,
          item: { '@type': 'TouristDestination', name: d.title, description: d.vibe, image: photoSrc(d.id, 1200), containedInPlace: { '@type': 'AdministrativeArea', name: `${d.region}, India` }, touristType: d.tags },
        })),
      },
      {
        '@type': 'ItemList', name: 'Indian folk art traditions',
        itemListElement: threads.items.map((t, i) => ({ '@type': 'ListItem', position: i + 1, item: { '@type': 'CreativeWork', name: t.title, description: t.text, locationCreated: { '@type': 'Place', name: t.place } } })),
      },
    ],
  }
}
