# Stage 5.1 — Production-Readiness Fixes: Implementation Report

**Project:** LOCHGRAPHY portfolio (`my-portfolio`)

**Implementation date:** 10 November 2026

**Branch / HEAD:** `main` / `470421a911936b9a27f4c2c7b8b39b9ac009c292`

**Source audit:** `STAGE-5-FINAL-AUDIT-REPORT.md`

**Approval gate:** This report stops for approval. Nothing was staged, committed, pushed, or deployed.

---

## 1. Executive summary and finding classification

Stage 5.1 implemented the approved production-readiness fixes from the Stage 5 audit. The two High findings were handled as follows: **H-02** is fixed in the production build output, and **H-01** remains a deployment-state issue that cannot be resolved without an approved commit/push/deploy. All five Medium findings and both Low findings were addressed and verified.

| ID | Finding | Classification | Evidence / reason |
|---|---|---|---|
| H-01 | Production deployment is stale relative to the working tree | **Not fixed — reason** | This is a deployment-state issue, not a source defect. Stage 5.1 explicitly prohibits staging, committing, pushing, or deploying. The working tree remains uncommitted, so the live site still serves the previous content and CV. Resolution requires an approved release. |
| H-02 | WebGL diagnostic page copied into `dist` | **Fixed and verified** | `npm run build` now runs `scripts/prune-diagnostic-pages.mjs` after the Vite build and legacy-asset prune. A fresh `dist` contains no `webgl-diag*` files; diagnostic source files were preserved. |
| M-01 | Ceylon Pathways caption points to a 404 host | **Fixed and verified** | Caption is now `ceylon-pathways.vercel.app — live site`; `https://ceylon-pathways.vercel.app` returns 200, while `https://ceylonpathways.vercel.app` returns 404. |
| M-02 | Nethwin caption claims a domain with no DNS record | **Fixed and verified** | Caption is now `print & bookshop project — NethwinLK Printers`; `nethwinlk.com` and `www.nethwinlk.com` return no DNS records, and no `nethwinlk.com` references remain in `src`, `public`, `index.html`, or `dist`. |
| M-03 | Mobile-landscape menu clips the Contact link | **Fixed and verified** | Menu is scrollable, uses safe-area padding, and has a short-height layout. All five links are fully visible at 390 × 390, 844 × 390, 740 × 360, 390 × 844, and 360 × 740 in Chromium and WebKit; 390 × 240 and 844 × 240 prove the scroll fallback. |
| M-04 | Hero second line has no guaranteed contrast | **Fixed and verified** | The line now has a semi-opaque dark fill plus the existing light stroke. Worst-case stronger-of-fill/stroke contrast across four shader frames is 3.31:1 on mobile and 4.40:1 on desktop, above the 3:1 large-text threshold. Visual inspection passed. |
| M-05 | CV PDF is untagged | **Fixed and verified (structural)** | The CV was regenerated with Playwright `tagged: true` and a PDFKit metadata pass. It has a structure tree, `/Lang (en)`, headings, lists, links, and reading-order tags. A formal PDF/UA validator is not installed; see the limitation in section 7. |
| L-01 | CSS-generated `↗` appears in the project heading accessible name | **Fixed and verified** | The arrow is now a real `<span aria-hidden="true">` inside the heading. The Chromium accessibility tree reports the heading name as exactly `Ceylon Pathways`; no heading name contains an arrow. |
| L-02 | `<noscript>` copy begins with stray `_pasindu` | **Fixed and verified** | The fallback now begins `Pasindu Lochana Rathnayaka - LOCHGRAPHY.` A JavaScript-disabled browser test confirms the rendered text contains no `_pasindu`. |
| O-01–O-08 | Optional SEO/performance improvements | **Not fixed — out of scope** | These were explicitly optional in the Stage 5 audit and were not part of the approved Stage 5.1 fix set. No current failure is introduced by leaving them unchanged. |

**No finding is classified Partially fixed.** The only residual verification limitation is M-05's formal PDF/UA conformance, which requires a dedicated validator or manual PDF/UA review; the structural tagging defect itself is fixed.

### Manual review items

- **M-05 formal PDF/UA conformance — Requires manual review.** The PDF is structurally tagged, but no formal PDF/UA validator is installed. A validator or manual PDF/UA audit is needed before claiming formal conformance.
- **M-04 continuous shader coverage — Requires manual review for final aesthetic sign-off.** Four frames were sampled and visually inspected; the shader is continuous, so an exhaustive frame-by-frame proof is not practical.

---

## 2. Baseline and constraints

### Baseline

| Item | Value |
|---|---|
| Working directory | `/Users/lochgraphy/Documents/Desktop/my-portfolio` |
| Branch | `main...origin/main` |
| HEAD | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| Staged changes at start | None |
| Stashes at start | None |
| Baseline build (Stage 5 audit) | JS `index-CYbRfRqs.js`; CSS `index-CpuWIMhd.css` |
| Final Stage 5.1 build | JS `index-i8m0H0Qh.js`; CSS `index-SdTncxFv.css` |
| Preview used for verification | `http://localhost:4173/` serving the current `dist` |

The working tree already contained the Stage 2/3/4 implementation changes and the Stage 4 CV when Stage 5.1 began. Those changes were preserved. The source CV `assets/cv/Pasindu Lochana.pdf` was already modified relative to HEAD (110,698 bytes; SHA-256 `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346`) and was not overwritten by Stage 5.1.

### Constraints honored

- No staging, commit, push, or deploy.
- No Git reset, revert, restore, or clean operation.
- No source-file deletion by Stage 5.1. The pre-existing deletions of `src/components/CountUp.tsx` and `src/components/LoadingIndicator.tsx` were preserved. The build's prune scripts remove only generated `dist` artifacts (the diagnostic page and legacy hero media).
- No `.gitignore` modification.
- No overwrite of `assets/cv/Pasindu Lochana.pdf`.
- No modification of `src/components/SiteBackground.tsx`, `src/components/refracted-renderer.ts`, `src/components/refracted-text.tsx`, or any shader file.
- No removal of diagnostic source files.
- Every pre-existing working-tree change was preserved.

### Scope

In scope: H-02, M-01, M-02, M-03, M-04, M-05, L-01, L-02.
Out of scope: H-01 (requires release activity) and O-01–O-08 (optional improvements).

---

## 3. H-02 — Diagnostic-page exclusion

### Implementation

A new post-build guard, `scripts/prune-diagnostic-pages.mjs`, recursively scans `dist/` for any file or directory whose name matches `/webgl-diag/i`, removes only those generated artifacts, and then re-scans to fail the build if anything remains.

`package.json` now runs the guard after the Vite build and the existing legacy-hero prune:

```json
"build": "tsc -b && vite build && node scripts/prune-legacy-hero-assets.mjs && node scripts/prune-diagnostic-pages.mjs"
```

The guard touches only `dist/`. The diagnostic sources remain available locally:

- `public/webgl-diag.html` (untracked, preserved)
- `webgl-diag2.html` (untracked, preserved)
- `src/webgl-diag2-entry.tsx` (untracked, preserved)

This is a deliberate, narrowly scoped alternative to the audit's "remove or move" recommendation, because Stage 5.1 explicitly required the diagnostic source files to remain.

### Verification

The final build log contains:

```text
[prune] excluded webgl-diag.html
```

`find dist -iname '*webgl-diag*'` returns no matches. A fresh `dist` contains 22 files and no diagnostic HTML. The local preview's `/webgl-diag.html` response is the Vite SPA fallback: 2,874 bytes, `<title>Pasindu Lochana Rathnayaka - LOCHGRAPHY</title>`, with zero matches for `premultipliedAlpha` or `WebGL compositing diagnostic`. It is not the diagnostic page. Production has no SPA rewrite rule, so an unknown `/webgl-diag.html` path returns 404 there.

**Residual risk:** the untracked diagnostic source files must not be committed accidentally. Even if they are committed, the build guard removes their output from `dist`; the guard is the production safeguard.

**Status: Fixed and verified.**

---

## 4. M-01 and M-02 — Project caption corrections

### Changes

| Finding | Before | After |
|---|---|---|
| M-01 | `ceylonpathways.vercel.app — live site` | `ceylon-pathways.vercel.app — live site` |
| M-02 | `nethwinlk.com — print & bookshop project` | `print & bookshop project — NethwinLK Printers` |

The M-01 caption now matches the actual external link in `src/data/content.ts` (`https://ceylon-pathways.vercel.app`). The M-02 caption no longer presents a non-resolving domain as a destination; it uses a non-URL project descriptor and keeps the client name.

### Verification

| Check | Result |
|---|---|
| `https://ceylon-pathways.vercel.app` | HTTP 200 |
| `https://ceylonpathways.vercel.app` | HTTP 404 |
| `dig +short nethwinlk.com` | No records |
| `dig +short www.nethwinlk.com` | No records |
| `grep -RIn "nethwinlk\\.com" src public index.html dist` | No matches |

The corrected captions are present in the current source and in the built output.

**Status: Fixed and verified.**

---

## 5. M-03 — Mobile-landscape navigation

### Implementation

`src/index.css` now gives the mobile menu:

- `overflow-y: auto` and `overscroll-behavior: contain` so the overlay itself can scroll when its content exceeds the viewport.
- `-webkit-overflow-scrolling: touch` for momentum scrolling on iOS.
- Safe-area-aware top and bottom padding.
- A short-height media query, `@media (max-width: 900px) and (max-height: 500px)`, which switches the menu to `justify-content: flex-start`, tightens the gap, and reduces link size/padding.
- A `.nav.is-open .nav__toggle:focus` visible focus ring, because WebKit can drop `:focus-visible` when the focus trap returns focus to the toggle.

`body.nav-open` still locks page scroll while the overlay is open; the overlay itself remains scrollable.

### Viewport verification

All results are from the final build, in both Chromium and WebKit. “All links visible” means all five navigation links are fully inside the viewport.

| Viewport | Engine | All links visible | Menu `scrollHeight` / `clientHeight` | Horizontal overflow |
|---|---|---|---|---|
| 390 × 390 | Chromium | Yes | 390 / 390 | No |
| 390 × 390 | WebKit | Yes | 390 / 390 | No |
| 844 × 390 | Chromium | Yes | 390 / 390 | No |
| 844 × 390 | WebKit | Yes | 390 / 390 | No |
| 740 × 360 | Chromium | Yes | 360 / 360 | No |
| 740 × 360 | WebKit | Yes | 360 / 360 | No |
| 390 × 844 | Chromium | Yes | 844 / 844 | No |
| 390 × 844 | WebKit | Yes | 844 / 844 | No |
| 360 × 740 | Chromium | Yes | 740 / 740 | No |
| 360 × 740 | WebKit | Yes | 740 / 740 | No |

### Interaction verification

At every viewport above, in both engines:

- The toggle reports `aria-expanded="true"` and the overlay receives `is-open`.
- Focus moves to the first link; `Shift+Tab` wraps to the toggle; `Tab` returns to the first link.
- The toggle and links show a visible `2px solid rgb(151, 215, 255)` focus outline with a 3px offset.
- `Escape` closes the menu, restores `aria-expanded="false"`, unlocks body scroll, hides the overlay, and returns focus to the toggle.
- Selecting Contact closes the menu, updates the hash to `#contact`, unlocks body scroll, and moves focus to the `#contact` section.

### Scroll fallback proof at very short heights

At 390 × 240 and 844 × 240, the five-link stack is taller than the viewport (292px content in a 240px menu). The overlay scrolls by 52px, after which the Contact link is fully visible and hit-testable.

| Viewport | Engine | `scrollTop` after scrolling | Contact fully visible | Contact hit-testable |
|---|---|---|---|---|
| 390 × 240 | Chromium | 52 | Yes | Yes |
| 844 × 240 | Chromium | 52 | Yes | Yes |
| 390 × 240 | WebKit | 52 | Yes | Yes |
| 844 × 240 | WebKit | 52 | Yes | Yes |

**Status: Fixed and verified.**

---

## 6. M-04 — Hero heading contrast

### Implementation

`.hero__statement .dim` now uses:

```css
color: rgba(3, 16, 26, 0.72);
-webkit-text-stroke: 0.5px var(--color-text);
text-shadow: 0 1px 3px rgba(3, 16, 26, 0.55);
```

The semi-opaque dark fill gives the glyph body a legible fallback when a bright shader highlight passes behind the headline. The existing light stroke preserves the outline treatment over dark regions. The change is scoped to the hero statement's second line; it does not touch the shader, the wordmark, or the black-hole composition.

### Contrast method and results

Background-only screenshots of the headline area were captured at four shader frames on desktop (1440 × 900) and mobile (390 × 844). For every background pixel, the analysis computed:

- the contrast of the composited fill (`rgba(3,16,26,0.72)` over the background), and
- the contrast of the opaque stroke (`#E7E6E7`).

Because the glyph has both a filled body and a stroke, the relevant worst-case check is the stronger of the two at each pixel. Results:

| Viewport | Frame 0 | Frame 1 | Frame 2 | Frame 3 | Worst |
|---|---|---|---|---|---|
| Desktop 1440 × 900 | 6.02:1 | 5.87:1 | 5.47:1 | 4.40:1 | **4.40:1** |
| Mobile 390 × 844 | 3.31:1 | 3.31:1 | 3.31:1 | 3.31:1 | **3.31:1** |

The computed font sizes are 48px at desktop and 24px at mobile, both meeting the WCAG large-text threshold (at least 24px regular or 18.66px bold). The applicable AA threshold is 3:1; both worst cases exceed it.

The stroke-only minimum is lower on mobile (2.18:1) because the shader can be bright behind the thin outline, but at those pixels the fill is the legible component (3.31:1). The fill-only minimum is low over dark regions (1.06:1), but there the stroke is the legible component. This is the intended complementary treatment.

### Visual and reduced-motion checks

- Desktop and mobile full-page screenshots were inspected after the change; the second line is readable and the outline character of the design is preserved.
- With `prefers-reduced-motion: reduce`, the computed color, stroke, and text-shadow are unchanged. The fix is CSS-only and introduces no new motion.
- The wordmark and black-hole composition remain unchanged; no protected background or shader file was edited in Stage 5.1.

### Limitation

The shader is continuous, so the four-frame sample cannot prove every possible frame. The sampled worst case is above the threshold, and the visual review passed; a final aesthetic/contrast sign-off in a real browser remains a reasonable manual review step.

**Status: Fixed and verified.**

---

## 7. M-05 — Tagged CV PDF

### Generation pipeline

The Stage 4 CV source HTML (`/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage4/cv-build/cv.html`) was rendered with Playwright Chromium:

```js
await page.pdf({
  format: 'A4',
  printBackground: true,
  preferCSSPageSize: true,
  margin: { top: '0', right: '0', bottom: '0', left: '0' },
  tagged: true,
});
```

The resulting tagged PDF then received the Stage 4 PDFKit metadata pass (`set-metadata.swift`) to restore the title, author, subject, keywords, and creator. The tags survive that pass. The output replaced `public/assets/cv.pdf`; the source CV was not touched.

### File identity

| File | Size | SHA-256 |
|---|---|---|
| New web CV `public/assets/cv.pdf` | 58,030 bytes | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` |
| New web CV `dist/assets/cv.pdf` | 58,030 bytes | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` |
| Source CV `assets/cv/Pasindu Lochana.pdf` | 110,698 bytes | `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346` |
| Previous Stage 4 web CV backup | 40,469 bytes | `ed7795b1788c9d0fa1e0b70bd9ea9654b7f27884379e2bc9424e922e42694395` |

The source CV hash matches its pre-Stage-5.1 value, confirming it was not overwritten.

### Structural verification

| Property | Result |
|---|---|
| Pages | 1 |
| Page size | A4 — 594.96 × 841.92 pt |
| Rotation | 0 |
| Link annotations | 5 |
| Text extraction | 56 lines; profile, experience, projects, education, skills, languages, and reference intact |
| `/StructTreeRoot` | Present |
| `/MarkInfo` | Present — `/Marked true` |
| `/Lang` | Present — `/Lang (en)` |
| Heading tags | 1 × H1, 6 × H2, 10 × H3 |
| List tags | `/L`, `/LI`, `/Lbl` present |
| Link tags | 10 × `/Link` |
| Reading-order/artifact tags | `/P`, `/NonStruct`, `/Art` present |

Metadata after the PDFKit pass:

- Title: `Pasindu Lochana Rathnayaka - Curriculum Vitae`
- Author: `Pasindu Lochana Rathnayaka`
- Subject: `Curriculum Vitae`
- Keywords: Web Development, Data Analysis, HTML, CSS, JavaScript, Tailwind CSS, Node.js, MongoDB, Next.js, TypeScript
- Creator: `LOCHGRAPHY`
- Producer: `Skia/PDF m156`

Link annotations preserved:

1. `mailto:lochgraphy@gmail.com`
2. `tel:+94778660753`
3. `https://lochgraphy.vercel.app/`
4. `https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/`
5. `https://github.com/loch68`

### Served and download verification

- `GET /assets/cv.pdf` from the preview returns 200, `application/pdf`, 58,030 bytes.
- The downloaded file's SHA-256 matches the public file: `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3`.
- `dist/assets/cv.pdf` is byte-for-byte identical to `public/assets/cv.pdf`.
- The one-page A4 visual layout was inspected and remains consistent with the Stage 4 CV.

### Limitation

No formal PDF/UA validator is installed in this environment. Verification is structural (raw object markers, metadata, page geometry, annotations, text extraction, and visual layout), not a formal PDF/UA conformance certificate. A dedicated PDF/UA validator or manual review is recommended before making a formal accessibility claim.

**Status: Fixed and verified (structural); formal PDF/UA conformance requires manual/validator review.**

---

## 8. L-01 and L-02 — Low-severity fixes

### L-01 — Project heading accessible name

The CSS pseudo-element arrow was replaced with a real decorative span in `src/components/ProjectCard.tsx`:

```tsx
<h3 className="project__title">
  {project.title}
  {project.link && (
    <span className="project__title-mark" aria-hidden="true">
      {project.link.external ? '↗' : '→'}
    </span>
  )}
</h3>
```

The CSS now styles `.project__title-mark` directly and keeps the hover/focus reveal.

Verification:

- Chromium accessibility tree: the Ceylon Pathways heading name is exactly `Ceylon Pathways` (level 3).
- No heading name in the accessibility tree contains an arrow character.
- The arrow still appears visually on hover and on `:focus-within` (`opacity: 1`, `transform: none`).

**Status: Fixed and verified.**

### L-02 — `<noscript>` copy

`index.html` now begins:

```html
<noscript>
  Pasindu Lochana Rathnayaka - LOCHGRAPHY. Websites, creative production,
  and digital support for travel &amp; hospitality businesses. Reach
  lochgraphy@gmail.com. (Enable JavaScript for the full experience.)
</noscript>
```

Verification with JavaScript disabled: the rendered fallback text contains `Pasindu Lochana Rathnayaka - LOCHGRAPHY.` and does not contain `_pasindu`.

**Status: Fixed and verified.**

---

## 9. Build, verification, and regression results

### Commands

| Command | Result |
|---|---|
| `npx tsc -b --pretty false` | Exit 0 |
| `npm run build` | Exit 0 |
| `git diff --check` | Exit 0 (no whitespace errors) |

Final build output:

```text
dist/index.html                                              2.87 kB │ gzip:  0.92 kB
dist/assets/index-SdTncxFv.css                              54.48 kB │ gzip: 26.89 kB
dist/assets/index-i8m0H0Qh.js                              304.05 kB │ gzip: 96.20 kB
✓ 49 modules transformed
✓ built in 417ms
[prune] excluded assets/hero/heroVideo.mp4
[prune] excluded assets/hero/hero-1200.jpg
[prune] excluded assets/hero/hero-2400.jpg
[prune] removed empty dist/assets/hero
[prune] excluded webgl-diag.html
```

### Production output inventory

`dist` contains 22 files (1.7 MB):

- `index.html`
- `assets/index-i8m0H0Qh.js`
- `assets/index-SdTncxFv.css`
- `assets/cv.pdf`
- `assets/og.jpg`
- `assets/logo.png`
- `assets/profile/profile-pic-800.webp`
- `assets/profile/profile-pic-1200.webp`
- 4 project JPEGs (`ceylon-pathways`, `nethwin-bookshop`, `ps-portfolio`, `telca-cctv`)
- 4 Space Grotesk font files (woff/woff2)
- 4 Inter font files (woff/woff2)
- `robots.txt`
- `sitemap.xml`

No `webgl-diag*` file is present. The normal assets, CV, fonts, images, robots, and sitemap are present. The built CSS contains the final hero fill (`#03101ab8`, i.e. alpha 0.72) and the mobile focus rule.

### Browser and regression matrix

Final verification covered Chromium and WebKit:

- Menu and interaction: 390 × 390, 844 × 390, 740 × 360, 390 × 844, 360 × 740.
- Hero contrast and screenshots: desktop 1440 × 900 and mobile 390 × 844.
- Scroll fallback: 390 × 240 and 844 × 240.
- Accessibility tree: Chromium CDP `Accessibility.getFullAXTree`.
- JavaScript-disabled `<noscript>`: Chromium with `javaScriptEnabled: false`.
- CV download: Chromium preview download.

Across the instrumented verification suite (menu, hero, accessibility tree, JavaScript-disabled fallback, and CV download):

- **0** console errors.
- **0** page errors.
- **0** failed requests.
- **0** HTTP responses ≥ 400.
- No horizontal overflow.
- No new layout collapse.

The 390 × 240 and 844 × 240 scroll-fallback checks were geometry and hit-test checks; they did not record network logs.

Additional checks:

- Re-verified in Stage 5.1: mobile menu open/Escape/focus trap/focus restoration and section focus after menu navigation; heading names and levels; CV link, `download` attribute, served bytes, and hash; hero computed style under reduced motion.
- Stage 5 baseline checks not affected by Stage 5.1's scoped changes: skip link, desktop anchors, logo-to-top, active-section state, and Service/About disclosures. No Stage 5.1 edit touches those code paths.

### Evidence artifacts

- Full browser verification JSON: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/cv51/stage51-verify-final.json`
- Menu screenshots: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/cv51/stage51-menu-{chromium,webkit}-{viewport}.png`
- Hero screenshots: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/cv51/stage51-final-hero-*`
- Downloaded CV: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/cv51/stage51-downloaded-cv.pdf`
- Tagged CV source HTML: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage4/cv-build/cv.html`
- Tagged PDF generator and metadata pass: `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/cv51/render-tagged.mjs`, `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage4/set-metadata.swift`

### Limitations

- Headless Chromium uses software WebGL in this environment; its frame-rate and long-task numbers are not representative and were not used for performance conclusions.
- No physical screen-reader or low-vision user test was performed; accessibility-tree and keyboard evidence were used.
- No formal PDF/UA validator was available; M-05 verification is structural and visual.
- The shader contrast sample covers four frames, not every possible animation frame.

---

## 10. Final Git status, preservation, and stop confirmation

### Final status

```text
## main...origin/main
 M "assets/cv/Pasindu Lochana.pdf"
 M index.html
 M package.json
 M public/assets/cv.pdf
 D src/components/CountUp.tsx
 M src/components/Hero.tsx
 D src/components/LoadingIndicator.tsx
 M src/components/Nav.tsx
 M src/components/ProjectCard.tsx
 M src/components/Reveal.tsx
 M src/components/Sections.tsx
 M src/components/ServiceCard.tsx
 M src/components/SiteBackground.tsx
 M src/components/refracted-renderer.ts
 M src/data/content.ts
 M src/index.css
?? PORTFOLIO-CONTENT-AUDIT.md
?? STAGE-2-IMPLEMENTATION-REPORT.md
?? STAGE-3-IMPLEMENTATION-REPORT.md
?? STAGE-4-CV-IMPLEMENTATION-REPORT.md
?? STAGE-5-FINAL-AUDIT-REPORT.md
?? STAGE-5.1-IMPLEMENTATION-REPORT.md
?? public/webgl-diag.html
?? scripts/prune-diagnostic-pages.mjs
?? src/components/useMediaQuery.ts
?? src/webgl-diag2-entry.tsx
?? webgl-diag2.html
```

### Diff stat

```text
 assets/cv/Pasindu Lochana.pdf        | Bin 72129 -> 110698 bytes
 index.html                           |  14 +-
 package.json                         |   2 +-
 public/assets/cv.pdf                 | Bin 72129 -> 58030 bytes
 src/components/CountUp.tsx           |  70 ----
 src/components/Hero.tsx              |  10 +-
 src/components/LoadingIndicator.tsx  |  50 ---
 src/components/Nav.tsx               |   2 +-
 src/components/ProjectCard.tsx       |  33 +-
 src/components/Reveal.tsx            |  40 ++-
 src/components/Sections.tsx          | 108 +++---
 src/components/ServiceCard.tsx       |  43 ++-
 src/components/SiteBackground.tsx    |  23 +-
 src/components/refracted-renderer.ts |   9 +-
 src/data/content.ts                  | 122 ++++---
 src/index.css                        | 645 +++++++++++++++++++++++++++--------
 16 files changed, 765 insertions(+), 406 deletions(-)
```

- **Staged:** none.
- **Stashes:** none.
- **HEAD:** `470421a911936b9a27f4c2c7b8b39b9ac009c292` (unchanged).
- **Commits / pushes / deploys during Stage 5.1:** none.

### Files changed by Stage 5.1

| File | Stage 5.1 change |
|---|---|
| `scripts/prune-diagnostic-pages.mjs` | New post-build guard; removes `webgl-diag*` artifacts from `dist` only. |
| `package.json` | Build script now runs the diagnostic prune after the legacy-asset prune. |
| `src/data/content.ts` | M-01 and M-02 caption corrections. |
| `src/index.css` | M-03 mobile menu scrolling/short-height/focus rules; M-04 hero fill/stroke; L-01 title-mark styling. |
| `src/components/ProjectCard.tsx` | L-01 real `aria-hidden` arrow span. |
| `index.html` | L-02 `<noscript>` copy. |
| `public/assets/cv.pdf` | M-05 tagged, metadata-preserving CV. |
| `STAGE-5.1-IMPLEMENTATION-REPORT.md` | This report. |

All other modified/deleted/untracked files in the status above are pre-existing Stage 2/3/4 work and were preserved.

### Preservation confirmation

| Protected item | Evidence |
|---|---|
| `assets/cv/Pasindu Lochana.pdf` | Size 110,698 bytes; SHA-256 `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346`; unchanged by Stage 5.1. |
| `src/components/SiteBackground.tsx` | mtime 2026-11-07 12:21:36; no Stage 5.1 edit. |
| `src/components/refracted-renderer.ts` | mtime 2026-11-07 12:09:58; no Stage 5.1 edit. |
| `src/components/refracted-text.tsx` | mtime 2026-11-05 13:33:58; no Stage 5.1 edit. |
| Diagnostic source files | `public/webgl-diag.html`, `webgl-diag2.html`, `src/webgl-diag2-entry.tsx` remain present and untouched. |
| `.gitignore` | Unchanged. |

No Git reset, revert, restore, or clean operation was performed, and Stage 5.1 deleted no source file. The pre-existing deletions of `CountUp.tsx` and `LoadingIndicator.tsx` were preserved. The build prune removed only generated `dist` artifacts. No pre-existing working-tree change was discarded.

### Stop point

This is the end of Stage 5.1 implementation and verification. The working tree is ready for review. **Nothing has been staged, committed, pushed, or deployed.** Awaiting approval before any release activity.
