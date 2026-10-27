import { mkdir, copyFile, cp, access, rm, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';

for (const file of ['assets/balance.avif', 'assets/steine.avif']) {
  try { await access(file); } catch { throw new Error(`Required original image missing: ${file}`); }
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
await copyFile('robots.txt', 'dist/robots.txt');
await cp('assets', 'dist/assets', { recursive: true });

// Every page loads the exact stylesheet and script belonging to this build.
// Shared filenames would allow a cached prototype stylesheet on the landing page.
for (const directory of ['', 'prototyp/']) {
  await mkdir(`dist/${directory}`, { recursive: true });
  let html = await readFile(`${directory}index.html`, 'utf8');
  for (const file of ['styles.css', 'app.js']) {
    const content = await readFile(`${directory}${file}`);
    const hash = createHash('sha256').update(content).digest('hex').slice(0, 12);
    const dot = file.lastIndexOf('.');
    const versioned = `${file.slice(0, dot)}.${hash}${file.slice(dot)}`;
    await writeFile(`dist/${directory}${versioned}`, content);
    // Keep the original paths available for already open pages.
    await writeFile(`dist/${directory}${file}`, content);
    html = html.replaceAll(`"${file}"`, `"${versioned}"`);
  }
  await writeFile(`dist/${directory}index.html`, html);
}
console.log('Built landing page and /prototyp/ with versioned CSS and JavaScript → dist/');
