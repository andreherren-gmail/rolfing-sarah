import { readFile } from 'node:fs/promises';
const config = JSON.parse(await readFile(new URL('../site.config.json', import.meta.url), 'utf8'));
const parsedOrigin = new URL(config.origin);
if (parsedOrigin.protocol !== 'https:' || parsedOrigin.pathname !== '/' || parsedOrigin.search || parsedOrigin.hash) {
  throw new Error('site.config.json must specify an HTTPS origin without a path, query or fragment.');
}
export const origin = parsedOrigin.origin;
const url = path => new URL(path, origin).href;
const escapeAttribute = value => value.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;');
const entityId = fragment => `${origin}/#${fragment}`;

function structuredData() {
  const organization = entityId('balance');
  const person = entityId('sarah-herren');
  return {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'WebSite', '@id': entityId('website'), url: url('/'), name: config.name, inLanguage: 'de-CH', publisher: { '@id': organization } },
      { '@type': 'WebPage', '@id': entityId('webpage'), url: url('/'), name: 'Rolfing & Faszientherapie Bern | Sarah Herren', inLanguage: 'de-CH', isPartOf: { '@id': entityId('website') }, about: { '@id': organization } },
      { '@type': 'Person', '@id': person, name: 'Sarah Herren', jobTitle: 'Certified Advanced Rolfer®', worksFor: { '@id': organization } },
      {
        '@type': 'Organization', '@id': organization, name: config.name, url: url('/'),
        logo: url('/assets/balance.avif'), email: 'info@rolfing-herren.ch', telephone: '+41792327139',
        department: [{ '@id': entityId('praxis-bern') }, { '@id': entityId('praxis-niederscherli') }],
        hasOfferCatalog: {
          '@type': 'OfferCatalog', name: 'Tätigkeitsbereiche',
          itemListElement: ['Rolfing®: Strukturelle Integration', 'Faszientherapie', 'ScarWork: Narbenarbeit'].map(name => ({
            '@type': 'Offer', itemOffered: { '@type': 'Service', name, provider: { '@id': organization } }
          }))
        }
      },
      ...[
        ['praxis-bern', 'Praxis Bern', 'Kramgasse 12', '3011', 'Bern'],
        ['praxis-niederscherli', 'Praxis Niederscherli', 'Schwarzenburgstrasse 854', '3145', 'Niederscherli']
      ].map(([id, label, street, postalCode, locality]) => ({
        '@type': 'LocalBusiness', '@id': entityId(id), name: `${config.name}, ${label}`,
        url: url('/'), parentOrganization: { '@id': organization }, telephone: '+41792327139', email: 'info@rolfing-herren.ch',
        address: { '@type': 'PostalAddress', streetAddress: street, postalCode, addressLocality: locality, addressCountry: 'CH' }
      }))
    ]
  };
}

export function addSeo(html, path) {
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1];
  if (!title || !description) throw new Error(`Missing SEO metadata for ${path}`);
  const canonical = url(path);
  const image = url('/assets/steine.avif');
  const metadata = [
    `<link rel="canonical" href="${escapeAttribute(canonical)}">`,
    '<meta property="og:type" content="website">',
    '<meta property="og:locale" content="de_CH">',
    `<meta property="og:site_name" content="${escapeAttribute(config.name)}">`,
    `<meta property="og:title" content="${title}">`,
    `<meta property="og:description" content="${description}">`,
    `<meta property="og:url" content="${escapeAttribute(canonical)}">`,
    `<meta property="og:image" content="${escapeAttribute(image)}">`,
    '<meta property="og:image:alt" content="Balance-Motiv: aufeinander ruhende Steine vor hellblauem Hintergrund">',
    '<meta property="og:image:width" content="2545">',
    '<meta property="og:image:height" content="994">',
    '<meta name="twitter:card" content="summary_large_image">'
  ];
  if (path === '/') metadata.push(`<script type="application/ld+json">${JSON.stringify(structuredData()).replaceAll('<', '\\u003c')}</script>`);
  return html.replace('</head>', `  ${metadata.join('\n  ')}\n</head>`);
}

export function sitemap() {
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${origin}/</loc></url></urlset>\n`;
}
