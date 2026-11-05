/*!
ReactDrops Component License 1.0

Copyright (c) 2026 ReactDrops

1. Scope and definitions

This license applies to ReactDrops software and associated documentation that
expressly carry this license or are distributed under a LICENSE file containing
it (the "Software"). "Licensor" means the copyright holder granting rights in
the Software, and only to the extent that holder has authority to grant them.
"You" means the individual or entity exercising these rights.

An "End Product" is a website, application, service, or other finished project
whose primary purpose is something other than providing reusable components,
source code, templates, or development assets to others.

2. Permitted uses

Subject to this license, Licensor grants You a worldwide, non-exclusive,
royalty-free license to use, copy, modify, and incorporate the Software into
unlimited personal, internal, and commercial End Products. You may charge for
End Products, subscriptions, development services, and work for clients.

You may distribute the Software as an integrated part of an End Product,
including in browser-delivered JavaScript. You may provide End Product source
code to a client, and share the Software with employees and contractors who
need it to develop or maintain End Products. Those recipients may use the
Software for those purposes subject to this license. This permission does not
authorize them to redistribute the Software as a reusable development asset.

3. Restricted redistribution

Unless You obtain separate written permission from Licensor, You may not sell,
sublicense, publish, share, or otherwise redistribute the Software, or a
substantial portion of it, whether unchanged or modified:

(a) as a standalone component, component library, UI kit, source-code bundle,
    registry, or other collection of reusable development assets;
(b) as part of a theme, template, starter project, or similar product offered
    to multiple recipients for reuse in their own projects; or
(c) through a builder or generation service that offers the Software as
    reusable blocks or source-code exports for others' projects.

These restrictions apply to paid and free redistribution. Renaming, restyling,
repackaging, translating, or modifying the Software does not remove them.
Building separate finished websites or applications for multiple clients is
permitted; offering a reusable template or kit containing the Software is not.

Public source-code hosting by Licensor is not permission to republish the
Software under another license. This license does not override any separate
rights granted directly by Licensor or applicable code-hosting terms.

4. Notices and ownership

Retain this license and applicable copyright and third-party notices in source
copies of the Software and permitted source distributions. No visible credit
or ReactDrops logo is required in an End Product's user interface.

Licensor retains ownership of its Software. You retain rights in Your own
contributions, subject to the license for any incorporated Software. No rights
to trademarks, trade names, or logos are granted by this license.

5. Third-party materials and separate grants

Dependencies, fonts, images, videos, and other third-party materials remain
subject to their respective licenses. Separately identified third-party code
is licensed under its stated terms, and these restrictions do not limit rights
granted by its copyright holders. Retain all required third-party notices.
Demo media are not licensed by this document; obtain Your own permission or
replace them with media You are entitled to use.

This license does not revoke rights granted under other valid licenses. It does
not assert ownership of third-party work or grant rights Licensor lacks.

6. Termination

The permissions granted here continue unless terminated for a material breach.
If You fail to cure a material breach within 30 days after receiving written
notice from Licensor, Your permissions terminate. On termination, cease uses
and distributions requiring this license. Rights under independently granted
licenses and rights that applicable law does not allow to be restricted remain
unaffected. Sections 3 through 7 survive termination.

7. Disclaimer

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. TO THE MAXIMUM EXTENT
PERMITTED BY APPLICABLE LAW, LICENSOR AND CONTRIBUTORS SHALL NOT BE LIABLE FOR
ANY CLAIM, DAMAGES, OR OTHER LIABILITY, WHETHER IN CONTRACT, TORT, OR OTHERWISE,
ARISING FROM, OUT OF, OR IN CONNECTION WITH THE SOFTWARE OR ITS USE.

This license does not limit rights or exceptions that applicable law makes
non-waivable. No other permissions are granted by implication.
*/

// Round the glyph silhouette before generating its refraction and light masks.
// An elliptical brush follows the font's own scale, including flattened text.
export function roundGlyphCorners(
  pixels: Uint8ClampedArray,
  width: number,
  height: number,
  radiusX: number,
  radiusY: number,
) {
  if (!Number.isFinite(radiusX) || !Number.isFinite(radiusY) || Math.min(radiusX, radiusY) <= 0.5)
    return;
  let left = width;
  let right = -1;
  let top = height;
  let bottom = -1;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (pixels[(y * width + x) * 4 + 3] < 128) continue;
      left = Math.min(left, x);
      right = Math.max(right, x);
      top = Math.min(top, y);
      bottom = Math.max(bottom, y);
    }
  }
  if (right < left) return;
  // Keep small punctuation and narrow stems from disappearing at high values.
  const limit = Math.min(1, (right - left + 1) / (radiusX * 4), (bottom - top + 1) / (radiusY * 4));
  radiusX *= limit;
  radiusY *= limit;
  left = Math.max(0, left - Math.ceil(radiusX) - 2);
  right = Math.min(width - 1, right + Math.ceil(radiusX) + 2);
  top = Math.max(0, top - Math.ceil(radiusY) - 2);
  bottom = Math.min(height - 1, bottom + Math.ceil(radiusY) + 2);
  const cropWidth = right - left + 1;
  const cropHeight = bottom - top + 1;
  const size = cropWidth * cropHeight;
  let ink = new Uint8Array(size);
  let next = new Uint8Array(size);
  let originalArea = 0;
  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      const alpha = pixels[((y + top) * width + x + left) * 4 + 3];
      const value = alpha >= 128 ? 1 : 0;
      ink[y * cropWidth + x] = value;
      originalArea += value;
    }
  }
  const horizontal = new Float64Array(size);
  const distances = new Float64Array(size);
  const length = Math.max(cropWidth, cropHeight);
  const line = new Float64Array(length);
  const result = new Float64Array(length);
  const sites = new Int32Array(length);
  const edges = new Float64Array(length + 1);

  // Exact squared Euclidean distances in linear time, with separate x/y scales.
  function transform(count: number, scale: number) {
    let last = -1;
    for (let q = 0; q < count; q++) {
      if (!Number.isFinite(line[q])) continue;
      let crossing = -Infinity;
      while (last >= 0) {
        const site = sites[last];
        crossing =
          (line[q] - line[site] + scale * (q * q - site * site)) / (2 * scale * (q - site));
        if (crossing > edges[last]) break;
        last--;
      }
      last++;
      sites[last] = q;
      edges[last] = last === 0 ? -Infinity : crossing;
      edges[last + 1] = Infinity;
    }
    if (last < 0) {
      result.fill(Infinity, 0, count);
      return;
    }
    let siteIndex = 0;
    for (let q = 0; q < count; q++) {
      while (edges[siteIndex + 1] < q) siteIndex++;
      const site = sites[siteIndex];
      result[q] = line[site] + scale * (q - site) ** 2;
    }
  }

  function distanceTo(value: number) {
    for (let y = 0; y < cropHeight; y++) {
      const offset = y * cropWidth;
      for (let x = 0; x < cropWidth; x++) line[x] = ink[offset + x] === value ? 0 : Infinity;
      transform(cropWidth, 1 / (radiusX * radiusX));
      horizontal.set(result.subarray(0, cropWidth), offset);
    }
    for (let x = 0; x < cropWidth; x++) {
      for (let y = 0; y < cropHeight; y++) line[y] = horizontal[y * cropWidth + x];
      transform(cropHeight, 1 / (radiusY * radiusY));
      for (let y = 0; y < cropHeight; y++) distances[y * cropWidth + x] = result[y];
    }
  }

  function offset(dilate: boolean, radius: number) {
    distanceTo(dilate ? 1 : 0);
    const threshold = radius * radius;
    for (let index = 0; index < size; index++) {
      next[index] = (dilate ? distances[index] <= threshold : distances[index] > threshold) ? 1 : 0;
    }
    [ink, next] = [next, ink];
  }

  // A smaller inward radius keeps letter apertures open. Opening rounds the
  // outer corners without adding a stroke or moving the straight edges.
  offset(true, 0.35);
  offset(false, 0.35);
  offset(false, 1);
  distanceTo(1);
  const coverage = new Uint8Array(size);
  const antialiasScale = Math.min(radiusX, radiusY);
  let roundedArea = 0;
  for (let index = 0; index < size; index++) {
    coverage[index] = Math.round(
      Math.max(0, Math.min(1, 0.5 + (1 - Math.sqrt(distances[index])) * antialiasScale)) * 255,
    );
    if (coverage[index] >= 128) roundedArea++;
  }
  // Preserve delicate glyphs if the requested radius would erase their stems.
  if (roundedArea < originalArea * 0.65) return;
  for (let y = 0; y < cropHeight; y++) {
    for (let x = 0; x < cropWidth; x++) {
      pixels[((y + top) * width + x + left) * 4 + 3] = coverage[y * cropWidth + x];
    }
  }
}
