import { mkdir, copyFile, cp, access, rm } from 'node:fs/promises';
// Do not publish a landing page with missing original images.
for (const file of ['assets/balance.avif', 'assets/steine.avif']) {
  try { await access(file); } catch { throw new Error(`Required original image missing: ${file}`); }
}
await rm('dist', { recursive: true, force: true });
await mkdir('dist', { recursive: true });
for (const file of ['index.html', 'styles.css', 'app.js', 'robots.txt']) await copyFile(file, `dist/${file}`);
for (const folder of ['assets', 'prototyp']) await cp(folder, `dist/${folder}`, { recursive: true });
console.log('Built landing page and /prototyp/ → dist/');
