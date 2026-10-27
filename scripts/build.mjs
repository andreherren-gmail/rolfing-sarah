import { mkdir, cp, access, rm, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { addSeo, origin, sitemap } from './seo.mjs';

for (const file of ['assets/balance.avif', 'assets/steine.avif']) {
  try { await access(file); } catch { throw new Error(`Required original image missing: ${file}`); }
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
const robots = await readFile('robots.txt', 'utf8');
await writeFile('dist/robots.txt', `${robots.trimEnd()}\n\nSitemap: ${origin}/sitemap.xml\n`);
await writeFile('dist/sitemap.xml', sitemap());
const originalPngs = new Set(['faszien.png', 'narbe.png', 'praxis-bern-platzhalter.png', 'praxis-niederscherli-platzhalter.png']);
await cp('assets', 'dist/assets', { recursive: true, filter: source => !originalPngs.has(source.split('/').pop()) });

// Every page loads the exact stylesheet and script belonging to this build.
// Shared filenames would allow a cached prototype stylesheet on the landing page.
for (const directory of ['', 'prototyp/']) {
  await mkdir(`dist/${directory}`, { recursive: true });
  let html = await readFile(`${directory}index.html`, 'utf8');
  for (const file of (directory === 'prototyp/' ? ['styles.css', 'app.js', 'termin.js'] : ['styles.css', 'app.js'])) {
    const content = await readFile(`${directory}${file}`);
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    const dot = file.lastIndexOf('.');
    const versioned = `${file.slice(0, dot)}.${hash}${file.slice(dot)}`;
    await writeFile(`dist/${directory}${versioned}`, content);
    // Keep the original paths available for already open pages.
    await writeFile(`dist/${directory}${file}`, content);
    html = html.replaceAll(`"${file}"`, `"${versioned}"`);
  }
  await writeFile(`dist/${directory}index.html`, addSeo(html, `/${directory}`));
}
// Prototype subpages share its versioned stylesheet and script.
for (const page of ['preise', 'praxen', 'termin']) {
  await mkdir(`dist/prototyp/${page}`, { recursive: true });
  let html = await readFile(`prototyp/${page}/index.html`, 'utf8');
  for (const file of ['styles.css', 'app.js', 'termin.js']) {
    const content = await readFile(`prototyp/${file}`);
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    const dot = file.lastIndexOf('.');
    const versioned = `${file.slice(0, dot)}.${hash}${file.slice(dot)}`;
    html = html.replaceAll(`"../${file}"`, `"../${versioned}"`);
  }
  await writeFile(`dist/prototyp/${page}/index.html`, addSeo(html, `/prototyp/${page}/`));
}
console.log('Built landing page, prototype and subpages with versioned assets → dist/');
