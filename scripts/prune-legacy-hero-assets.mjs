/**
 * Remove legacy Hero media from the production output only.
 *
 * The current Hero uses the procedural WebGL background and the refracted
 * wordmark, so the old video and poster files under public/assets/hero are not
 * referenced by the application. They remain in public/ as source assets; this
 * post-build step keeps them out of dist/ so they are not deployed.
 */
import { readdir, rm, stat } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve('dist');
const legacyHeroAssets = [
  'assets/hero/heroVideo.mp4',
  'assets/hero/hero-1200.jpg',
  'assets/hero/hero-2400.jpg',
];

for (const asset of legacyHeroAssets) {
  const file = resolve(outDir, asset);
  try {
    await stat(file);
  } catch (error) {
    if (error.code === 'ENOENT') continue;
    throw error;
  }
  await rm(file);
  console.log(`[prune] excluded ${asset}`);
}

const heroDir = resolve(outDir, 'assets/hero');
try {
  const entries = await readdir(heroDir);
  if (entries.length === 0) {
    await rm(heroDir, { recursive: true });
    console.log('[prune] removed empty dist/assets/hero');
  }
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
