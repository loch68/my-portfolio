# Stage 6C — Production Release Report

**Status:** Released — deployed and live-verified
**Date:** 10 November 2026
**Repository:** `/Users/lochgraphy/Documents/Desktop/my-portfolio`
**Branch:** `main`
**Release commit:** `6f28cc5b32eb29b6935eb715f14204c6dcbf4ff8`
**Remote:** `origin` → `https://github.com/loch68/my-portfolio.git`
**Production URL:** `https://lochgraphy.vercel.app`

## 1. Summary

The approved Stage 5.1, Stage 6A, and Stage 6B application changes were committed as `6f28cc5` (`Release portfolio production updates`), pushed fast-forward to `origin/main`, and deployed through the existing GitHub → Vercel Git integration.

The production domain now serves the new JavaScript and CSS bundles, the updated metadata, and the approved 58,030-byte CV. All required live checks passed, with the LinkedIn automated-request limitation noted in section 14:

- Live JS/CSS hashes match the verified local build exactly.
- Live CV size and SHA-256 match the approved local CV.
- The source CV and both diagnostic routes return HTTP 404 from the website.
- Ceylon Pathways points to the correct live destination.
- Nethwin does not advertise an unsupported domain.
- Mobile navigation, the 390 × 390 collision fix, the black-hole background, and the LOCH wordmark all work in Chromium and WebKit.
- No console errors, page errors, failed requests, or HTTP ≥ 400 responses occurred during the 12-run live smoke test.

One release-condition discrepancy remains documented: the GitHub repository is public rather than private. The user authorized continuing with the existing public remote.

## 2. Final commit and pushed state

| Item | Value |
|---|---|
| Commit | `6f28cc5b32eb29b6935eb715f14204c6dcbf4ff8` |
| Subject | `Release portfolio production updates` |
| Parent | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| Author date | 2026-11-10T20:36:25+05:30 |
| Branch | `main` |
| Remote `main` before push | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| Remote `main` after push | `6f28cc5b32eb29b6935eb715f14204c6dcbf4ff8` |
| Local vs remote after push | `0` behind, `0` ahead |
| Force-push / history rewrite | None |

## 3. Files committed

The release commit contains **17 files**: 846 insertions and 406 deletions. Files were staged explicitly by path; `git add -A` and `git add .` were not used.

| File | Status | Release purpose |
|---|---|---|
| `index.html` | Modified | Current metadata, title punctuation, and `<noscript>` copy. |
| `package.json` | Modified | Build pipeline includes the diagnostic-page prune. |
| `public/assets/cv.pdf` | Modified | Approved 58,030-byte CV served by the site. |
| `scripts/prune-diagnostic-pages.mjs` | Added | Removes diagnostic pages from production output. |
| `src/components/CountUp.tsx` | Deleted | Superseded by the current section presentation. |
| `src/components/Hero.tsx` | Modified | Current hero copy and mobile identity strip. |
| `src/components/LoadingIndicator.tsx` | Deleted | Superseded by the current loading treatment. |
| `src/components/Nav.tsx` | Modified | ARIA-label consistency. |
| `src/components/ProjectCard.tsx` | Modified | Current project card structure and accessible external-link arrow. |
| `src/components/Reveal.tsx` | Modified | Observer fallback and reveal behavior. |
| `src/components/Sections.tsx` | Modified | Current About, Education, Services, Contact, and Footer structure. |
| `src/components/ServiceCard.tsx` | Modified | Current service highlights and disclosure content. |
| `src/components/SiteBackground.tsx` | Modified | Previously approved mobile black-hole framing. |
| `src/components/refracted-renderer.ts` | Modified | Previously approved iOS wordmark rendering correction. |
| `src/components/useMediaQuery.ts` | Added | Viewport-aware About presentation. |
| `src/data/content.ts` | Modified | Current project, service, education, and contact content. |
| `src/index.css` | Modified | Current styling, including the Stage 6B short-viewport hero correction. |

The Stage 6B `max-width: 900px` / `max-height: 540px` hero offset is present in the committed `src/index.css`.

Deliberately **not** committed:

- `assets/cv/Pasindu Lochana.pdf` — source CV, preserved and left unstaged.
- All `STAGE-*` and audit reports, including this report.
- `PORTFOLIO-CONTENT-AUDIT.md`.
- `public/webgl-diag.html`, `webgl-diag2.html`, and `src/webgl-diag2-entry.tsx`.
- `dist/` and other generated or ignored artifacts.

Verification:

- `git show --name-status HEAD` lists exactly the 17 files above.
- No `STAGE-*`, audit, diagnostic, `dist/`, or source-CV path appears in the commit.
- The commit contains no secrets or credential patterns.
- The source CV hash is unchanged from the Stage 6B baseline.

## 4. Build, TypeScript, and pre-release checks

| Check | Result |
|---|---|
| `npm run build` | Passed, exit 0 |
| `npx tsc -b --pretty false` | Passed, exit 0, no output |
| `git diff --check` | Passed, exit 0 |
| `git diff --cached --check` | Passed, exit 0 |
| `git show --check HEAD` | Passed, exit 0 |

Build output:

- Vite 7.3.7; 49 modules transformed.
- CSS: `dist/assets/index-CqdhSsoy.css` (54.59 kB).
- JS: `dist/assets/index-BNoChCU3.js` (304.05 kB).
- `dist`: 22 files, 1.7 MB.
- No `*webgl-diag*` or `*diag*` files in `dist`.
- `dist/index.html` references only `index-CqdhSsoy.css` and `index-BNoChCU3.js`.
- `dist/assets/cv.pdf`: 58,030 bytes, SHA-256 `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3`.

## 5. Git push result

Command:

```text
git push origin main
```

Result:

```text
To https://github.com/loch68/my-portfolio.git
   470421a..6f28cc5  main -> main
```

- Exit 0.
- Fast-forward, no force-push.
- `git ls-remote --heads origin main` now returns `6f28cc5b32eb29b6935eb715f14204c6dcbf4ff8`.
- `git status --short --branch` reports `## main...origin/main` with no ahead/behind marker.

No reset, revert, restore, clean, move, or rename was performed. The release commit's only deletions are the two approved component removals (`CountUp.tsx` and `LoadingIndicator.tsx`).

## 6. Vercel deployment

### 6.1 Deployment status

The existing GitHub → Vercel Git integration picked up the pushed `main` commit automatically. The Vercel CLI was not used for deployment; it remains unauthenticated locally and `.vercel/project.json` is absent.

GitHub commit status for `6f28cc5`:

| Field | Value |
|---|---|
| Context | `Vercel` |
| State | `success` |
| Description | `Deployment has completed` |
| Target URL | `https://vercel.com/loch68s-projects/lochgraphy/33s5bBJLuURig4L33st9BWRgQ2cw` |
| Created | 2026-11-10T16:03:32Z |
| Updated | 2026-11-10T16:03:32Z |

### 6.2 Production deployment commit confirmation

The commit whose Vercel status succeeded is `6f28cc5b32eb29b6935eb715f14204c6dcbf4ff8`. The production domain updated immediately afterward:

- Live HTML `last-modified`: 2026-11-10T16:03:46Z.
- Live CV `last-modified`: 2026-11-10T16:04:19Z.
- Live HTML references the new `index-BNoChCU3.js` and `index-CqdhSsoy.css` bundles.
- The live CV is the new 58,030-byte approved file.

The Vercel deployment page itself requires dashboard authentication, so its rendered metadata could not be opened directly. The GitHub commit status and the production-domain asset/CV update together confirm that this deployment is the live production deployment for `6f28cc5`.

## 7. Live metadata and asset verification

### 7.1 Metadata

| Item | Live value | Result |
|---|---|---|
| `<title>` | `Pasindu Lochana Rathnayaka - LOCHGRAPHY` | Pass |
| Meta description | `Multidisciplinary digital creator: websites and digital experiences, creative production and branding, content and marketing, and travel & hospitality digital support.` | Pass |
| Canonical | `https://lochgraphy.vercel.app/` | Pass |
| `og:title` | `Pasindu Lochana Rathnayaka - LOCHGRAPHY` | Pass |
| `og:url` | `https://lochgraphy.vercel.app/` | Pass |
| `og:description` | `Websites and digital experiences, creative production, and digital support for travel & hospitality businesses.` | Pass |
| `og:image` | `https://lochgraphy.vercel.app/assets/og.jpg` — HTTP 200, `image/jpeg`, 199,216 bytes | Pass |
| Twitter card | `summary_large_image` | Pass |
| Theme color | `#242C4C` | Pass |
| Robots | `index, follow, max-image-preview:large` | Pass |
| Language | `en` | Pass |

### 7.2 Live JS and CSS

| Asset | Live file | Local SHA-256 | Live SHA-256 | Match |
|---|---|---|---|---|
| JavaScript | `assets/index-BNoChCU3.js` | `18234b59a4617b782273eb0bd2e594b3d720e8a3463dcfdb0c04e476a491f59e` | `18234b59a4617b782273eb0bd2e594b3d720e8a3463dcfdb0c04e476a491f59e` | Yes |
| CSS | `assets/index-CqdhSsoy.css` | `f1f671c4a36cf6f94cdf0ccffe118c6dbea023a871e46c1f52fc25bb214a1137` | `f1f671c4a36cf6f94cdf0ccffe118c6dbea023a871e46c1f52fc25bb214a1137` | Yes |

`cmp` confirms both downloaded live assets are byte-identical to `dist`. The previous live bundles (`index-DWudGXXP.js` and `index-CM7W5S49.css`) are no longer referenced.

### 7.3 Security and caching headers

The live production domain returns HTTP 200 with:

- `content-security-policy` including `default-src 'self'`, `script-src 'self'`, `style-src 'self' 'unsafe-inline'`, `img-src 'self' data:`, `font-src 'self' data:`, `connect-src 'self'`, `form-action 'self'`, and `frame-ancestors 'self'`.
- `x-content-type-options: nosniff`.
- `x-frame-options: SAMEORIGIN`.
- `referrer-policy: strict-origin-when-cross-origin`.
- `permissions-policy: camera=(), microphone=(), geolocation=()`.
- `strict-transport-security: max-age=63072000; includeSubDomains; preload`.
- `cache-control: public, max-age=0, must-revalidate`.

## 8. CV verification

| Item | Size | SHA-256 | Status |
|---|---:|---|---|
| Approved local CV (`public/assets/cv.pdf`) | 58,030 bytes | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Committed |
| Local build CV (`dist/assets/cv.pdf`) | 58,030 bytes | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Verified |
| Live CV (`/assets/cv.pdf`) | 58,030 bytes | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Live, matches |
| Previous live CV | 72,129 bytes | `79a7727634b9c8b4f6b07bbccc46c210dedcd179d23e2facfa91ffc0e62cfcf1` | No longer served |
| Original source CV (worktree) | 110,698 bytes | `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346` | Preserved, uncommitted |

Live CV response:

- HTTP 200.
- `content-type: application/pdf`.
- `content-length: 58030`.
- `content-disposition: inline; filename="cv.pdf"`.
- The site link is `/assets/cv.pdf` with the `download` attribute.

A live click on the **Download CV (PDF)** link triggered a browser download event for `cv.pdf`; the saved file was 58,030 bytes with the same SHA-256, and `download.failure()` returned `null`. The CV download therefore resolves to the approved file, and its bytes match the local approved copy exactly.

## 9. Diagnostic and source-CV exposure checks

| Path | Live result | Diagnostic content exposed |
|---|---|---|
| `/webgl-diag.html` | HTTP 404 | No — Vercel `NOT_FOUND` response only |
| `/webgl-diag2.html` | HTTP 404 | No — Vercel `NOT_FOUND` response only |
| `/assets/cv/Pasindu%20Lochana.pdf` | HTTP 404 | No |
| `/assets/cv/` | HTTP 404 | No |

Local production output contains no `*diag*` files, and the live JS/CSS bundles contain no `webgl-diag` references.

**Source-CV caveat:** the website does not publish the source CV. However, the GitHub repository is public and the previously tracked 72,129-byte source CV remains in Git `HEAD`/history on GitHub. The local 110,698-byte source CV was not committed. Repository visibility is discussed in section 14.

## 10. Content and link verification

### 10.1 Project content

| Project | Link | Verification |
|---|---|---|
| Ceylon Pathways | `https://ceylon-pathways.vercel.app` | Correct destination; `target="_blank"`, `rel="noopener noreferrer"`; destination HTTP 200. |
| Telca Solutions CCTV | None | No link, as designed for an in-development project. |
| Nethwin Bookshop | None | No link and no domain in the card copy; only “NethwinLK Printers (Pvt) Ltd.” is named. No unsupported domain is advertised. |
| Campus Portfolio | None | No link, as designed for academic work. |

### 10.2 Contact and social links

| Link | Live value | Verification |
|---|---|---|
| Email | `mailto:lochgraphy@gmail.com?subject=%5BPortfolio%5D%20Project%20inquiry` | Well-formed mailto link. |
| Phone | `tel:+94778660753` | Well-formed tel link. |
| Instagram | `https://instagram.com/lochgraphy` | HTTP 200; `target="_blank"`, `rel="noopener noreferrer"`. |
| LinkedIn | `https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/` | Correct approved profile URL; automated request returned HTTP 999 (LinkedIn bot protection). |
| GitHub | `https://github.com/loch68` | HTTP 200; `target="_blank"`, `rel="noopener noreferrer"`. |
| CV | `/assets/cv.pdf` | HTTP 200; 58,030 bytes; correct SHA-256; `download` attribute. |

### 10.3 Internal anchors

All internal anchors resolve to existing targets: `#main`, `#top`, `#work`, `#about`, `#education`, `#services`, and `#contact`. The page contains 23 anchors in total.

## 11. Responsive and browser smoke test

The live site was tested in headless Chromium and WebKit at all six required viewports. Each run loaded the production URL, waited for fonts and WebGL, scrolled through the page, exercised navigation, and checked the CV endpoint.

### 11.1 Six-viewport results

| Viewport | Eyebrow top (C / W) | Wordmark-to-eyebrow gap (C / W) | Hero height (C / W) | Wordmark overlap | Horizontal overflow | Runtime errors |
|---|---:|---:|---:|---|---:|---:|
| 360 × 740 | 157.3 / 157.5 | 107.4 / 107.6 | 740 / 740 | None | No | 0 |
| 390 × 844 | 220.6 / 220.9 | 170.7 / 171.0 | 844 / 844 | None | No | 0 |
| 390 × 390 | 108.0 / 108.0 | 58.1 / 58.1 | 542.8 / 542.2 | None | No | 0 |
| 844 × 390 | 126.6 / 126.6 | 76.7 / 76.7 | 604.0 / 602.8 | None | No | 0 |
| 1440 × 900 | 209.7 / 210.0 | 165.9 / 166.3 | 900 / 900 | None | No | 0 |
| 1920 × 1080 | 299.4 / 299.4 | 255.6 / 255.6 | 1080 / 1080 | None | No | 0 |

**12/12 runs passed** (6 viewports × 2 engines). No wordmark/eyebrow collision, no horizontal scrolling, and no runtime errors.

### 11.2 Mobile navigation

Tested at 360 × 740, 390 × 844, 390 × 390, and 844 × 390 in both engines (**8/8 runs passed**):

- The toggle opens the overlay with `aria-expanded="true"`, `body.nav-open`, and `main[inert]`.
- All five links are visible and fit within the overlay at every mobile viewport.
- At 390 × 390 the overlay is 390 px high and the links occupy 68–271.7 px; `scrollHeight` equals `clientHeight`.
- `Shift+Tab` from the first link wraps focus to the toggle; `Tab` returns focus to the first link.
- `Escape` closes the overlay, removes `body.nav-open` and `main[inert]`, and returns focus to the toggle.
- Activating `#about` closes the menu, updates the hash, and lands the About section at approximately 79.7–80.4 px below the viewport top, clearing the fixed nav.

Desktop navigation at 1440 × 900 and 1920 × 1080 (**4/4 runs passed**):

- The mobile toggle is hidden (`display: none`).
- The nav remains fixed at `top: 0` after scrolling and gains `is-scrolled`.
- The active-link state updates as sections enter view.

### 11.3 390 × 390 collision fix

| Measurement | Chromium | WebKit |
|---|---:|---:|
| Nav bottom | 76.0 | 76.0 |
| Wordmark bottom | 49.9 | 49.9 |
| Eyebrow top | 108.0 | 108.0 |
| Wordmark-to-eyebrow gap | 58.1 | 58.1 |
| Overlap area | 0 | 0 |
| Hero height | 542.8 | 542.2 |
| CTA position | 397.9–423.2 | 397.3–422.6 |

The Stage 6B fix is live: the wordmark and eyebrow no longer collide. As accepted in Stage 6B, the hero is taller than the 390 px viewport, so the CTA and scroll cue sit below the initial fold and remain reachable by scrolling. No content is clipped.

At 844 × 390 the eyebrow starts at 126.6 px with a 76.7 px gap; the hero is 604.0 px (Chromium) / 602.8 px (WebKit), also extending below the fold by design.

### 11.4 Section reveals and full-page rendering

The page contains 24 `.reveal` elements. After a stepwise scroll through the full page, **24/24 were marked `is-in`** at 390 × 844 and 1440 × 900 in both engines. All five service items had `opacity: 1`. Full-page screenshots after the stepwise scroll confirm the content renders after its reveal; no section remains permanently hidden.

## 12. Hero, background, and LOCH rendering

### 12.1 Black-hole background

| Viewport | Backing size (Chromium / WebKit) | WebGL context | Canvas opacity | Luminance mean / std. dev. / max (Chromium) | Bright pixels |
|---|---|---|---:|---|---:|
| 360 × 740 | 450 × 925 / 450 × 925 | Live | 1 | 78.2 / 61.5 / 247.4 | 32.6% |
| 390 × 844 | 488 × 1055 / 488 × 1055 | Live | 1 | 75.9 / 60.8 / 247.6 | 31.2% |
| 390 × 390 | 488 × 488 / 488 × 488 | Live | 1 | 59.2 / 49.1 / 247.6 | 19.1% |
| 844 × 390 | 1055 × 488 / 1055 × 488 | Live | 1 | 63.9 / 53.7 / 247.6 | 22.2% |
| 1440 × 900 | 2160 × 1350 / 2160 × 1350 | Live | 1 | 68.3 / 55.5 / 248.4 | 25.5% |
| 1920 × 1080 | 2880 × 1620 / 2880 × 1620 | Live | 1 | 70.5 / 57.0 / 248.4 | 27.0% |

All **12/12** background checks passed in both engines. The background canvas is present, has a live WebGL context, is fully opaque, and renders a high-variance image rather than a flat or blank surface. WebKit luminance means are within approximately 0.2 of Chromium; standard deviations and maxima are within about 1.2.

### 12.2 LOCH wordmark

| Viewport | Canvas backing (Chromium / WebKit) | Context | ARIA label | Mark luminance mean / std. dev. / max (Chromium) | Bright pixels |
|---|---|---|---:|---|---:|
| 360 × 740 | 320 × 57 / 320 × 56 | Live | `LOCH` | 111.2 / 76.2 / 255.0 | 55.9% |
| 390 × 844 | 350 × 62 / 350 × 62 | Live | `LOCH` | 109.9 / 76.9 / 255.0 | 55.0% |
| 390 × 390 | 350 × 62 / 350 × 62 | Live | `LOCH` | 109.9 / 77.0 / 255.0 | 55.0% |
| 844 × 390 | 691 × 121 / 691 × 120 | Live | `LOCH` | 96.3 / 70.5 / 255.0 | 51.6% |
| 1440 × 900 | 720 × 127 / 720 × 125 | Live | `LOCH` | 94.5 / 72.5 / 255.0 | 51.7% |
| 1920 × 1080 | 720 × 127 / 720 × 125 | Live | `LOCH` | 93.6 / 73.3 / 255.0 | 51.7% |

All **12/12** wordmark checks passed. The canvas has a live WebGL context, a nonzero backing size, the correct `aria-label="LOCH"`, and rendered glass highlights rather than a blank or solid rectangle. WebKit produced comparable results (mean 90.8–106.3, standard deviation 69.6–74.4, maximum 233.4–234.9, bright pixels 50.1–55.2%). Visual screenshots at 390 × 390 and 1440 × 900 confirm the expected LOCH treatment over the black-hole background.

## 13. Runtime errors

Across the 12 live runs (6 viewports × 2 engines):

| Error type | Count |
|---|---:|
| Console errors | 0 |
| Page errors | 0 |
| Failed requests | 0 |
| HTTP responses ≥ 400 during normal page load | 0 |

The intentional source-CV and diagnostic-route probes returned 404 in the separate global checks; those are expected security results, not runtime defects.

Headless software-WebGL performance was not evaluated as a real-device performance signal.

## 14. Remaining issues and notes

1. **Repository visibility mismatch (documented, not blocking):** GitHub reports `loch68/my-portfolio` as `public` (`visibility: public`), while the release checklist described a private repository. The user reviewed this and authorized continuing with the existing public remote. The release commit contains no secrets and excludes reports, diagnostics, `dist/`, and the source CV.
2. **Source CV in the public repository:** the website does not serve the source CV (`/assets/cv/Pasindu Lochana.pdf` and `/assets/cv/` return 404), but because the repository is public, the previously tracked 72,129-byte source CV remains visible in Git `HEAD`/history on GitHub. The local 110,698-byte source CV was not committed. If repository-level privacy is required, handle repository visibility or tracked-file history separately with explicit approval.
3. **Vercel dashboard authentication:** the deployment page requires a Vercel login, so its rendered metadata could not be inspected directly. The GitHub commit status for `6f28cc5` reports Vercel success with the deployment target, and the production domain serves the new bundles and CV, confirming the live production deployment.
4. **LinkedIn automated check:** LinkedIn returned HTTP 999 to the automated request (bot protection). The link is the approved profile URL and uses `target="_blank"` with `rel="noopener noreferrer"`. A manual browser check is recommended if desired.
5. **Accepted short-viewport trade-off:** at 390 × 390 and 844 × 390 the hero extends below the initial fold so the fixed nav does not overlap the wordmark. The CTA and scroll cue are reachable by scrolling; no content is clipped. This is the Stage 6B trade-off, now confirmed live.
6. **Preserved working-tree state:** `assets/cv/Pasindu Lochana.pdf` remains modified and unstaged; 12 untracked reports and diagnostic files remain, including this report. No unrelated changes were committed or deleted. No staging remains.

## 15. Release conclusion

**Stage 6C is complete.** The release commit is pushed, the Vercel Git integration deployment succeeded, and the production site is live with the approved application, metadata, CV, and content. All required live checks passed in Chromium and WebKit at the six specified viewports.

The only documented caveats are the public repository visibility, the resulting public visibility of the previously tracked source CV on GitHub, the authenticated Vercel dashboard, LinkedIn's automated-request block, and the accepted short-viewport fold trade-off. None is a deployment failure.

No new features or redesigns were introduced in Stage 6C. No protected shader/background files were modified by Stage 6C; the release commit contains the previously approved changes to those files. No force-push, reset, revert, restore, clean, move, or rename was performed. The only deletions are the two approved component removals in the release commit.
