/**
 * Remove development-only diagnostic pages from the production output only.
 *
 * `public/webgl-diag.html` remains in the repository so the shader diagnostic
 * stays available under `vite dev`, but it must not be copied into a deployed
 * build. `webgl-diag2.html` and `src/webgl-diag2-entry.tsx` live outside the
 * Vite entry graph, so they are not emitted today; the recursive check below
 * keeps that true if the diagnostic is ever wired into the build.
 *
 * Only generated files under `dist/` are touched. Diagnostic source files are
 * never removed.
 */
import { readdir, rm } from 'node:fs/promises';
import { resolve } from 'node:path';

const outDir = resolve('dist');

async function findDiagnostics(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const found = [];

  for (const entry of entries) {
    const target = resolve(dir, entry.name);
    if (/webgl-diag/i.test(entry.name)) {
      found.push(target);
    } else if (entry.isDirectory()) {
      found.push(...(await findDiagnostics(target)));
    }
  }

  return found;
}

const diagnostics = await findDiagnostics(outDir);

for (const file of diagnostics) {
  await rm(file, { recursive: true, force: true });
  console.log(`[prune] excluded ${file.slice(outDir.length + 1)}`);
}

const remaining = await findDiagnostics(outDir);
if (remaining.length > 0) {
  throw new Error(
    `Diagnostic artifacts remain in dist/: ${remaining
      .map((file) => file.slice(outDir.length + 1))
      .join(', ')}`,
  );
}
