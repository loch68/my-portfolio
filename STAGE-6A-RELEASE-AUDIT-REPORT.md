# Stage 6A — Final Release Audit Report

**Project:** LOCHGRAPHY portfolio (`my-portfolio`)  
**Repository:** `/Users/lochgraphy/Documents/Desktop/my-portfolio`  
**Production:** `https://lochgraphy.vercel.app`  
**Branch / HEAD:** `main` / `470421a911936b9a27f4c2c7b8b39b9ac009c292`  
**Audit date:** 10 November 2026  
**Mode:** Strictly read-only final release audit. No application edits, staging, commit, push, deploy, reset, revert, restore, clean, move, rename, or deletion. No `.gitignore`, CV, or protected shader/background modification.  
**Approval gate:** This report stops for explicit release approval. The only new file created by this audit is this report.

---

## 1. Executive summary

The working tree is build-clean, TypeScript-clean, and functionally sound across the required browser matrix. The production build contains the approved tagged CV, no diagnostic HTML, and the latest generated JS/CSS references. All 12 browser runs (Chromium and WebKit at six viewports) completed with **0 console errors, 0 page errors, 0 failed requests, and 0 HTTP responses ≥ 400**. Mobile-menu, disclosure, CV-download, project-destination, footer, and focus behaviour checks passed.

Two release-state issues remain:

1. **H-01 — production is stale.** The live site still serves the previous JS/CSS bundles, the previous metadata, and the old 72,129-byte CV. The current working tree is entirely uncommitted, so Vercel's Git-based build cannot include it.
2. **H-02 — diagnostic source files remain in the working tree.** The build guard now removes `webgl-diag*` from `dist`, and the current `dist` contains none. The untracked diagnostic sources must still be excluded from the release commit; `git add -A` or a working-tree CLI upload would be unsafe.

Stage 6A also found one **new Medium responsive issue** not recorded in Stage 5.1:

- **M-06 — hero/nav collision at 390 × 390.** The fixed nav wordmark and the hero eyebrow overlap at the initial scroll position. At 844 × 390 the eyebrow sits inside the nav band but does not collide with the wordmark glyphs. This is a visual defect at a required audit viewport, not a runtime failure. It was not part of the completed Stage 5.1 fix set and is reported here as new evidence.

**Final recommendation: READY WITH CONDITIONS.** The application source, build, CV, and repository-side Vercel configuration pass their technical release checks. Release should proceed only with selective staging, a decision on M-06, a Git-based deploy, and post-deploy verification. If M-06 is treated as a must-fix, the tree is not ready until it is corrected; if it is explicitly accepted as a known short-viewport limitation, the release may proceed under the conditions in section 12.

| Area | Result |
|---|---|
| Build / TypeScript / whitespace | Pass |
| Production output | 22 files, 1.7 MB; no diagnostic HTML; latest JS/CSS referenced |
| CV integrity | Pass — one-page A4, selectable text, 5 hyperlinks, hashes match |
| Browser matrix | Pass — 12/12 runs clean; no overflow; menu and interactions pass |
| Responsive visual review | One Medium defect at 390 × 390 (M-06) |
| Live vs local | Live is stale; old bundles and old CV |
| Vercel repo config | Coherent; no config blocker found; dashboard settings not fully verifiable |
| Critical source defects | None found |

---

## 2. Repository baseline and Git state

| Item | Value |
|---|---|
| Repository root | `/Users/lochgraphy/Documents/Desktop/my-portfolio` |
| Branch | `main` |
| Local HEAD | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| Remote HEAD (`origin/main`) | `470421a911936b9a27f4c2c7b8b39b9ac009c292` |
| Remote | `origin` → `https://github.com/loch68/my-portfolio.git` |
| Staged changes | None |
| Stashes | None |
| Commits / pushes / deploys during audit | None |
| Preview | `http://localhost:4173/` serving the current `dist` |
| Live | `https://lochgraphy.vercel.app/` serving the previous deployment |

**Exact `git status --short --branch` at audit baseline:**

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

**Tracked diff stat:**

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
 src/index.css                       | 645 +++++++++++++++++++++++++++--------
 16 files changed, 765 insertions(+), 406 deletions(-)
```

There are **16 tracked changed paths** (14 modified, 2 deleted), **11 untracked paths** before this report, no staged paths, no stashes, and no renames. The full 1,951-line tracked diff was inspected during the audit.

### Changes predating Stage 5.1

The working tree already contained the Stage 2/3/4 implementation before Stage 5.1:

- **Stage 2:** content/design restructure, project metadata, About capabilities/disclosure, service-card content, Education metadata, contact/footer refinements, responsive CSS, and deletion of the unused `CountUp.tsx`.
- **Stage 3:** mobile hero identity strip and Education timeline treatment.
- **Stage 4:** replacement of the active web CV at `public/assets/cv.pdf`.
- **Pre-existing protected/source changes:** `src/components/SiteBackground.tsx` (mobile black-hole framing), `src/components/refracted-renderer.ts` (iOS wordmark spill fix), the tracked source CV `assets/cv/Pasindu Lochana.pdf`, and the pre-existing deletion of `src/components/LoadingIndicator.tsx`.
- **Stage 5.1:** H-02 diagnostic prune, M-01/M-02 caption corrections, M-03 mobile menu, M-04 hero contrast, M-05 tagged CV, L-01 accessible arrow, and L-02 `<noscript>` fix.

Stage 6A made **no source changes**. The only new file is this report.

### Ignored and generated state

- `dist/` is ignored by `.gitignore`; it contains the current build output and is not part of the Git release.
- `node_modules/`, `.DS_Store`, `.VSCodeCounter/`, `.freebuff/`, `legacy-v1/`, `references/`, and `*.tsbuildinfo` are ignored.
- No `.vercel/project.json`, no `.vercelignore`, and no `.env*` files exist locally.
- `.gitignore` is unchanged.

---

## 3. Complete changed-file inventory

### 3.1 Tracked modifications and deletions

| Path | Git status | Diff | Purpose / ownership |
|---|---|---|---|
| `assets/cv/Pasindu Lochana.pdf` | M | Binary 72,129 → 110,698 | Tracked source CV. Modified relative to HEAD before Stage 4; not referenced by the app or build. **Investigate** before staging. |
| `index.html` | M | +7 / −7 | Metadata punctuation normalization and L-02 `<noscript>` copy fix. |
| `package.json` | M | +1 / −1 | Build script now runs the diagnostic-page prune after the legacy-hero prune. |
| `public/assets/cv.pdf` | M | Binary 72,129 → 58,030 | Active web CV; approved tagged one-page A4 PDF. |
| `src/components/CountUp.tsx` | D | −70 | Removed with the About statistics; no remaining references. |
| `src/components/Hero.tsx` | M | +8 / −2 | Mobile hero identity strip / sub-copy. |
| `src/components/LoadingIndicator.tsx` | D | −50 | Pre-existing unused component deletion; no remaining references. |
| `src/components/Nav.tsx` | M | +1 / −1 | ARIA-label punctuation consistency (`Lochgraphy - back to top`). |
| `src/components/ProjectCard.tsx` | M | +19 / −14 | Project alias/status metarow, short/full descriptions, accessible arrow span. |
| `src/components/Reveal.tsx` | M | +24 / −16 | Observer fallback and `observeOnly` support; keeps content visible if IntersectionObserver fails. |
| `src/components/Sections.tsx` | M | +65 / −43 | About capabilities/disclosure, Education timeline, service CTA, contact/footer copy, `useMediaQuery` integration. |
| `src/components/ServiceCard.tsx` | M | +33 / −10 | Service highlights/platforms and native “What's included” disclosure. |
| `src/components/SiteBackground.tsx` | M | +22 / −1 | Pre-existing mobile black-hole framing; protected file not touched by Stage 6A. |
| `src/components/refracted-renderer.ts` | M | +8 / −1 | Pre-existing iOS wordmark spill fix; protected file not touched by Stage 6A. |
| `src/data/content.ts` | M | +69 / −53 | Project/service/education content, descriptions, captions, aliases. |
| `src/index.css` | M | +508 / −137 | Responsive nav/menu, hero, projects, About, Education, Services, contact, footer, contrast, focus. |

### 3.2 Untracked files at baseline

| Path | Size | Purpose | Release relevance |
|---|---:|---|---|
| `PORTFOLIO-CONTENT-AUDIT.md` | 80,476 B | Content audit report | Exclude |
| `STAGE-2-IMPLEMENTATION-REPORT.md` | 28,555 B | Stage 2 report | Exclude |
| `STAGE-3-IMPLEMENTATION-REPORT.md` | 17,234 B | Stage 3 report | Exclude |
| `STAGE-4-CV-IMPLEMENTATION-REPORT.md` | 18,951 B | Stage 4 CV report | Exclude |
| `STAGE-5-FINAL-AUDIT-REPORT.md` | 45,136 B | Stage 5 audit report | Exclude |
| `STAGE-5.1-IMPLEMENTATION-REPORT.md` | 27,331 B | Stage 5.1 implementation report | Exclude |
| `public/webgl-diag.html` | 12,303 B | Development shader diagnostic page | Exclude |
| `scripts/prune-diagnostic-pages.mjs` | 1,518 B | Post-build `dist` diagnostic guard | **Include** |
| `src/components/useMediaQuery.ts` | 715 B | Required responsive hook used by `Sections.tsx` and `ServiceCard.tsx` | **Include** |
| `src/webgl-diag2-entry.tsx` | 41,230 B | Temporary shader diagnostic entry | Exclude |
| `webgl-diag2.html` | 3,975 B | Temporary shader diagnostic page | Exclude |

### 3.3 New file created by this audit

| Path | Purpose | Release relevance |
|---|---|---|
| `STAGE-6A-RELEASE-AUDIT-REPORT.md` | This report | Exclude from the application release commit; audit deliverable only |

### 3.4 Ignored / generated files

| Path | State | Treatment |
|---|---|---|
| `dist/` | Ignored; 22 files, 1.7 MB | Exclude; Vercel regenerates it from source |
| `node_modules/` | Ignored | Exclude |
| `.DS_Store` (root and subdirectories) | Ignored | Exclude |
| `.VSCodeCounter/`, `.freebuff/`, `legacy-v1/`, `references/` | Ignored | Exclude |
| `*.tsbuildinfo` | Ignored | Exclude |

---

## 4. Release inclusion / exclusion classification

### 4.1 Include — required application release

| Path | Why it belongs in the release |
|---|---|
| `index.html` | Contains the L-02 `<noscript>` fix and the current metadata punctuation used by the verified build. |
| `package.json` | Adds the H-02 diagnostic prune to `npm run build`; without it, `public/webgl-diag.html` would return to `dist`. |
| `public/assets/cv.pdf` | The approved, tagged one-page A4 CV actually served by the site. |
| `src/components/Hero.tsx` | Current mobile hero identity strip and sub-copy; part of the verified layout. |
| `src/components/Nav.tsx` | Small ARIA-label consistency change; included so the committed source matches the audited tree. |
| `src/components/ProjectCard.tsx` | Current alias/status metarow, short/full card copy, and L-01 accessible arrow. |
| `src/components/Reveal.tsx` | Current reveal/observer fallback and `observeOnly` behaviour; required by the verified sections. |
| `src/components/Sections.tsx` | Current About, Education, Services, Contact, and Footer structure/disclosures. |
| `src/components/ServiceCard.tsx` | Current service highlights/platforms and “What's included” disclosure. |
| `src/components/SiteBackground.tsx` | Pre-existing mobile black-hole framing; the current verified build depends on it. Protected file, not modified by Stage 6A. |
| `src/components/refracted-renderer.ts` | Pre-existing iOS wordmark spill fix; the current verified build depends on it. Protected file, not modified by Stage 6A. |
| `src/components/useMediaQuery.ts` | New required source hook; `Sections.tsx` and `ServiceCard.tsx` will not build without it. |
| `src/data/content.ts` | Current project/service/education content, descriptions, aliases, and M-01/M-02 caption corrections. |
| `src/index.css` | Current responsive layout, mobile menu, hero contrast, disclosures, footer, and focus styles. |
| `scripts/prune-diagnostic-pages.mjs` | New H-02 post-build guard; removes only `webgl-diag*` artifacts from `dist` and fails if any remain. |
| `src/components/CountUp.tsx` | Deletion is intentional: the About statistics were removed and the component has no remaining references. |
| `src/components/LoadingIndicator.tsx` | Deletion is pre-existing and intentional: no remaining references; the build passes without it. |

### 4.2 Exclude — reports, diagnostics, generated output, local artifacts

| Path | Reason |
|---|---|
| `PORTFOLIO-CONTENT-AUDIT.md` | Content-audit report, not application code. |
| `STAGE-2-IMPLEMENTATION-REPORT.md` | Implementation report, not application code. |
| `STAGE-3-IMPLEMENTATION-REPORT.md` | Implementation report, not application code. |
| `STAGE-4-CV-IMPLEMENTATION-REPORT.md` | Implementation report, not application code. |
| `STAGE-5-FINAL-AUDIT-REPORT.md` | Audit report, not application code. |
| `STAGE-5.1-IMPLEMENTATION-REPORT.md` | Implementation report, not application code. |
| `STAGE-6A-RELEASE-AUDIT-REPORT.md` | This audit deliverable; not part of the application release commit. |
| `public/webgl-diag.html` | Development shader diagnostic; must not be published or committed. The build guard removes it from `dist` even if it is ever committed. |
| `webgl-diag2.html` | Temporary diagnostic page outside the Vite entry graph; do not commit. |
| `src/webgl-diag2-entry.tsx` | Temporary diagnostic entry; do not commit. |
| `dist/` | Generated, gitignored build output; Vercel rebuilds it. Never force-add it. |
| `node_modules/`, `.DS_Store`, `.VSCodeCounter/`, `.freebuff/`, `legacy-v1/`, `references/`, `*.tsbuildinfo` | Local/ignored artifacts; exclude. |

### 4.3 Investigate — preserve, do not stage by default

| Path | Finding | Recommended handling |
|---|---|---|
| `assets/cv/Pasindu Lochana.pdf` | Tracked source CV; 110,698 bytes, SHA-256 `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346`; modified relative to HEAD before Stage 4; not referenced by the app or build; one-page US Letter, not the served A4 CV. | Preserve. Do not include in the web release unless the owner confirms this source-file update belongs in the commit. The active release CV is `public/assets/cv.pdf`. |

### 4.4 Already tracked and unchanged

`vercel.json`, `package-lock.json`, `vite.config.ts`, `public/robots.txt`, `public/sitemap.xml`, `public/assets/hero/*`, `public/assets/logo.png`, `public/assets/og.jpg`, profile/project images, and the existing source files not listed above require no staging action. `vercel.json` is already the deployment configuration; no change is proposed. The legacy hero media in `public/assets/hero/` remains tracked but is pruned from `dist` by `scripts/prune-legacy-hero-assets.mjs`; it does not ship in the production output.

### 4.5 Unrelated-file risk

A blanket `git add -A` or a Vercel CLI upload from the working tree would pull in reports, diagnostic sources, and the source CV. The build guard protects `dist` from `webgl-diag*`, but it does not prevent repository pollution or an unintended source-CV commit. **Selective staging is mandatory.** `dist/` must never be force-added.

---

## 5. Build and TypeScript results

| Command | Result |
|---|---|
| `npm run build` | Exit 0 |
| `npx tsc -b --pretty false` | Exit 0 |
| `git diff --check` | Exit 0 — no whitespace errors |

**Final build output:**

```text
vite v7.3.7 building client environment for production...
✓ 49 modules transformed.
dist/index.html                                              2.87 kB │ gzip:  0.92 kB
dist/assets/index-SdTncxFv.css                              54.48 kB │ gzip: 26.89 kB
dist/assets/index-i8m0H0Qh.js                              304.05 kB │ gzip: 96.20 kB
✓ built in 509ms
[prune] excluded assets/hero/heroVideo.mp4
[prune] excluded assets/hero/hero-1200.jpg
[prune] excluded assets/hero/hero-2400.jpg
[prune] removed empty dist/assets/hero
[prune] excluded webgl-diag.html
```

**Output verification:**

| Check | Result |
|---|---|
| `dist` file count | 22 files |
| `dist` size | 1.7 MB |
| JS bundle | `assets/index-i8m0H0Qh.js`, 304,048 bytes, SHA-256 `18234b59a4617b782273eb0bd2e594b3d720e8a3463dcfdb0c04e476a491f59e` |
| CSS bundle | `assets/index-SdTncxFv.css`, 54,476 bytes, SHA-256 `9a44db2e6e5ff39bf7e0b51ac26c6aab61c778c596a3b17b2799d9bc7ba3b7b6` |
| HTML | `dist/index.html`, 2,874 bytes |
| Latest asset references | `dist/index.html` references `assets/index-i8m0H0Qh.js` and `assets/index-SdTncxFv.css` |
| Diagnostic HTML in `dist` | None; `find dist -iname '*webgl-diag*'` returns nothing |
| CV | `dist/assets/cv.pdf`, 58,030 bytes; hash matches `public/assets/cv.pdf` |
| Normal assets | Fonts, logo, OG image, profile images, four project images, `robots.txt`, and `sitemap.xml` all present |
| Missing local references | None found; all browser runs recorded 0 HTTP ≥ 400 and 0 failed requests |
| Source changes made to pass checks | None |

The build pipeline is `tsc -b && vite build && node scripts/prune-legacy-hero-assets.mjs && node scripts/prune-diagnostic-pages.mjs`. The diagnostic guard removes only generated `dist` artifacts; it does not delete the diagnostic source files.

---

## 6. CV integrity verification

### 6.1 File identity

| File | Size | SHA-256 | Notes |
|---|---:|---|---|
| `public/assets/cv.pdf` | 58,030 B | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Active web CV |
| `dist/assets/cv.pdf` | 58,030 B | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Byte-identical build copy |
| `assets/cv/Pasindu Lochana.pdf` | 110,698 B | `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346` | Tracked source CV; unchanged during audit |

The source CV hash matches the Stage 5.1 baseline, confirming it was not overwritten during this audit. Its mtime remains `2026-06-05 18:07:59`; it is a one-page US Letter PDF (`612 × 792` pt), not the served A4 CV.

### 6.2 Active PDF structure

| Property | Result |
|---|---|
| Pages | 1 |
| Page size | 594.96 × 841.92 pt — A4 |
| Rotation | 0 |
| Selectable text | Yes — 2,804 extracted characters; profile, experience, projects, education, skills, languages, and reference intact |
| Link annotations | 5 |
| Links | `mailto:lochgraphy@gmail.com`; `tel:+94778660753`; `https://lochgraphy.vercel.app/`; `https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/`; `https://github.com/loch68` |
| Metadata | Title: `Pasindu Lochana Rathnayaka - Curriculum Vitae`; Author: `Pasindu Lochana Rathnayaka`; Subject: `Curriculum Vitae`; Creator: `LOCHGRAPHY`; Producer: `Skia/PDF m156`; keywords present |
| Tagging markers | `/StructTreeRoot`, `/MarkInfo`, `/Marked true`, `/Lang`, `/StructParents`, `/H1` ×1, `/H2` ×6, `/H3` ×10, `/Link` ×10, `/Art` present |
| Permissions | Printing and copying allowed; not locked |

External-link reachability:

| Link | Result |
|---|---|
| `https://lochgraphy.vercel.app/` | HTTP 200 |
| `https://github.com/loch68` | HTTP 200 |
| `https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/` | HTTP 999 to automated requests — LinkedIn bot protection; not evidence of a dead profile |
| `mailto:` / `tel:` | Valid URI annotations; no HTTP check applicable |

### 6.3 Served and download verification

| Check | Result |
|---|---|
| Local preview `GET /assets/cv.pdf` | 200, `application/pdf`, 58,030 bytes |
| Download suggested filename | `cv.pdf` |
| Downloaded SHA-256 | `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` |
| Download matches public file | Yes |
| `download` attribute on contact link | Present |
| CV included in release | Yes — `public/assets/cv.pdf` is in the proposed manifest |

### 6.4 Live CV

The live site still serves the previous CV:

- 72,129 bytes, SHA-256 `79a7727634b9c8b4f6b07bbccc46c210dedcd179d23e2facfa91ffc0e62cfcf1`.
- One page, A4, 2,023 extracted characters.
- Old content includes the previous street address and old phone formatting.
- It is not the approved Stage 5.1 CV.

No CV was regenerated, overwritten, or modified during this audit.

**Limitation:** no formal PDF/UA validator is installed. The tagging evidence is structural and visual; it supports the Stage 5.1 claim but does not constitute a formal PDF/UA conformance certificate.

---

## 7. Browser and responsive test results

### 7.1 Method

- Playwright **Chromium 1.64.1** and **WebKit 1.65.0**, headless.
- Preview: `http://localhost:4173/` serving the current `dist`.
- Viewports: **360 × 740, 390 × 844, 390 × 390, 844 × 390, 1440 × 900, 1920 × 1080**.
- Recorded console errors, page errors, failed requests, and HTTP responses ≥ 400.
- Scrolled through each page to trigger lazy images/reveals, then checked sections, cards, disclosures, links, menu, CV, and footer.
- Headless software WebGL and screenshot-only compositing artifacts were not treated as representative performance or site defects.

### 7.2 Runtime error matrix

| Viewport | Chromium | WebKit | Horizontal overflow |
|---|---|---|---|
| 360 × 740 | 0 console / 0 page / 0 failed / 0 HTTP ≥ 400 | 0 / 0 / 0 / 0 | No |
| 390 × 844 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | No |
| 390 × 390 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | No |
| 844 × 390 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | No |
| 1440 × 900 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | No |
| 1920 × 1080 | 0 / 0 / 0 / 0 | 0 / 0 / 0 / 0 | No |

**12/12 runs passed** the error and overflow checks. Chromium at 360 × 740 emitted four GPU-driver **warnings** (`GPU stall due to ReadPixels`) from headless software WebGL; these are performance warnings, not console errors, and are not representative of physical-device behaviour.

### 7.3 Content and interaction checks

| Check | Result |
|---|---|
| Hero and LOCH wordmark | Present and visible at every viewport; `aria-label="LOCH"`; wordmark canvas rendered |
| Black-hole background | `.site-bg` and `.site-bg__canvas` present; WebGL context created in both engines; no rendering errors |
| Navigation | Five links present; desktop nav visible at 1440/1920; mobile toggle visible ≤ 900 px |
| Mobile menu open | `aria-expanded="true"`, `.nav.is-open`, body scroll locked, `main` inert, first link focused |
| Mobile menu links | All five fully visible at 360 × 740, 390 × 844, 390 × 390, 844 × 390 in both engines; `scrollHeight` equals `clientHeight` |
| Focus trap | `Shift+Tab` from first link wraps to toggle; `Tab` returns to first link |
| Escape | Closes menu, restores `aria-expanded="false"`, unlocks body, removes `inert`, returns focus to toggle |
| Menu link navigation | At 390 × 844: hash `#about`, menu closed, focus moved to `#about`; `aboutTop` ≈ 80 px |
| Work cards | 4 cards visible at every viewport; images loaded; short copy below 901 px, full copy at ≥ 901 px |
| Project destinations | Ceylon Pathways action → `https://ceylon-pathways.vercel.app/`, HTTP 200, title “Ceylon Pathways | Private Van Tours in Nuwara Eliya, Sri Lanka” |
| About | Portrait, statement, three capability labels visible; “More about my work” closed at 360/390 px and open at ≥ 721 px (including 844, 1440, 1920); click opens/closes on mobile |
| Education | 3 entries visible with institution, qualification, and type label |
| Services | 5 cards visible; “What's included” closed below 861 px (360/390/844) and open at ≥ 861 px (1440/1920); click opens on mobile |
| Contact | Email, phone, three social links with `target="_blank"` and `rel="noopener noreferrer"`; CV link present |
| CV download | Suggested `cv.pdf`, 58,030 bytes, hash matches |
| Footer | Identity, six links, copyright; 3-column link grid at ≤ 720 px (360/390), wrapped row above; all links ≥ 44 px high; Contact footer link focuses `#contact` |
| Active nav state | At page bottom, Contact link has `aria-current="true"` |
| Disclosures | About and service disclosures open/close by click/touch; native `<details>` elements remain keyboard-operable |
| Reduced motion | Stage 5.1 evidence remains applicable; no new motion-dependent content was introduced |

### 7.4 Responsive visual finding — M-06 (new)

**Finding:** At **390 × 390**, the fixed navigation wordmark and the hero eyebrow overlap at the initial scroll position.

Measured layout at 390 × 390 (Chromium and WebKit):

| Element | Rect |
|---|---|
| `.nav` | top 0, bottom 76 |
| `.nav__brand` | top 25, bottom 51 |
| `.hero__eyebrow` | top 32, bottom 70 |
| `.hero` / `.hero__content` | top 0, height 466.8 |
| `.hero__mark` | top 87.6, bottom 149.7 |

The eyebrow occupies `y=32–70`, inside the nav's `y=0–76` band. “LOCHGRAPHY” and “RATHNAYAKA” visibly collide in both Chromium and WebKit screenshots. At 390 × 390 the hero grows to its content height (466.8 px) because `min-height: 100svh` is only a floor; its content starts at the top with normal block padding, and the fixed nav overlays the first 76 px. The mobile identity strip increases the content height, so the hero no longer fits the viewport and the eyebrow lands under the nav.

At **844 × 390**, the eyebrow starts at `y=50.6`, just below the wordmark glyphs (wordmark bottom `y=49.9`; brand line box bottom `y=51.0`); it sits inside the nav band, but there is no glyph collision. At 360 × 740, 390 × 844, 1440 × 900, and 1920 × 1080 the eyebrow is clear of the nav.

**Severity:** Medium. This is a visual collision at a required audit viewport, not a functional or runtime failure. It does not affect 360 × 740, 390 × 844, or desktop. It is new Stage 6A evidence, not a reopened Stage 5.1 fix. Recommended resolution: add a nav-aware top offset or short-height hero layout, then re-test 390 × 390 and 844 × 390; if not fixed, explicitly accept it as a known short-viewport limitation.

### 7.5 Screenshot and WebGL limitations

- Headless Chromium can leave a transparent bottom strip in some screenshots when a fixed WebGL background is captured during/after scrolling. WebKit paints the same regions correctly; hiding `.site-bg` proves the body background paints normally. This is a capture/compositor artifact, not a site defect, and is not reported as one.
- Headless Chromium uses software WebGL; GPU stall warnings and frame timings are not representative of physical devices. No performance conclusions are drawn from them.
- No physical screen-reader, low-vision, or notched-device test was performed. Keyboard, accessibility-tree, DOM geometry, and visual screenshot evidence were used.

**Evidence artifacts (outside the repository):** `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage6a-browser/results.json`, section/top/menu screenshots under the same directory tree, and `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage6a-build.log`.

---

## 8. Vercel configuration review

### 8.1 Repository configuration

| Item | Value | Assessment |
|---|---|---|
| `vercel.json` | Present | Valid JSON |
| Framework preset | `vite` | Correct for the Vite/React app |
| Build command | `npm run build` | Includes `tsc -b`, Vite build, legacy-hero prune, diagnostic prune |
| Output directory | `dist` | Matches Vite output and the verified build |
| Install command | Not set | Vercel default npm install; `package-lock.json` present |
| Rewrites / redirects / routes | None | Single-page site with hash anchors; unknown paths return 404 |
| Security headers | CSP, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, `Permissions-Policy` | Present and observed live |
| HSTS | Not in `vercel.json` | Vercel adds `Strict-Transport-Security` live |
| Base URL | `vite.config.ts` base `/`; `src/assets.ts` uses `import.meta.env.BASE_URL` | Correct for the Vercel root domain |
| Environment variables | No `.env*`; only `import.meta.env.BASE_URL` referenced | No required secret variables identified |
| Git deployment | Remote GitHub `loch68/my-portfolio`; branch `main`; local HEAD = remote HEAD | Git-based deployment is the correct path |
| `.vercel/project.json` | Absent | Dashboard project linkage cannot be verified from the repository |
| `.vercelignore` | Absent | No repo-side exclusion file; selective Git staging is still required |

### 8.2 Live header verification

The live site returned the configured headers, plus Vercel HSTS:

- `content-security-policy: default-src 'self'; base-uri 'self'; object-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self'; form-action 'self'; frame-ancestors 'self'`
- `x-content-type-options: nosniff`
- `referrer-policy: strict-origin-when-cross-origin`
- `x-frame-options: SAMEORIGIN`
- `permissions-policy: camera=(), microphone=(), geolocation=()`
- `strict-transport-security: max-age=63072000; includeSubDomains; preload`

Live JS/CSS/PDF content types were correct (`application/javascript`, `text/css`, `application/pdf`). HTML and assets use `cache-control: public, max-age=0, must-revalidate`; this is conservative but not a deployment blocker.

### 8.3 Configuration conclusion

No repository-side Vercel configuration issue was found that would prevent deployment. The build command, output directory, framework preset, base path, headers, and asset URLs are coherent. The following are dashboard-level and could not be fully verified from the repository:

- Vercel project linkage and production branch.
- Install command and Node.js version actually used by Vercel.
- Whether the project is configured to deploy from `main` on push.

`package.json` has no `engines` pin. Local verification used Node 24.9.0; Vite 7.3.7 requires Node 20.19+ or 22.12+. Vercel's default Node version should satisfy this, but the first deployment log should be checked. This is a low-risk verification item, not a confirmed defect.

---

## 9. Live versus local comparison

### 9.1 Exact asset comparison

| Item | Live production | Current local build | Result |
|---|---|---|---|
| HTML | 2,889 bytes; title `Pasindu Lochana Rathnayaka — LOCHGRAPHY`; refs old bundles | 2,874 bytes; title `Pasindu Lochana Rathnayaka - LOCHGRAPHY`; refs new bundles | Stale |
| JS | `index-DWudGXXP.js`; 302,570 bytes; SHA-256 `5b489c2e9c3b20c52abc5b363ad376792b5e0db9584fee9625bc8b841448442b` | `index-i8m0H0Qh.js`; 304,048 bytes; SHA-256 `18234b59a4617b782273eb0bd2e594b3d720e8a3463dcfdb0c04e476a491f59e` | Different |
| CSS | `index-CM7W5S49.css`; 49,394 bytes; SHA-256 `14e0ee270b0a0228d05ed871599aa7becfa9dba166eac3a54ecd41acfd37b8f0` | `index-SdTncxFv.css`; 54,476 bytes; SHA-256 `9a44db2e6e5ff39bf7e0b51ac26c6aab61c778c596a3b17b2799d9bc7ba3b7b6` | Different |
| CV | 72,129 bytes; SHA-256 `79a7727634b9c8b4f6b07bbccc46c210dedcd179d23e2facfa91ffc0e62cfcf1` | 58,030 bytes; SHA-256 `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` | Different; live is old |
| `robots.txt` | 75 bytes; SHA-256 `c7738fb7743652f5d1f61ea76998518964e5c9e0d857936ef7cd1f4d95e7eb4c` | Same | Identical |
| `sitemap.xml` | 173 bytes; SHA-256 `33cf56f3d2bab7682c26d0f9d42bf6f484dee36606ecd9f74b001ffe0cba17a1` | Same | Identical |
| `/webgl-diag.html` | HTTP 404 | No file in `dist`; local preview returns the SPA fallback index, not the diagnostic | Production clean |
| `/webgl-diag2.html` | HTTP 404 | No file in `dist`; local preview returns the SPA fallback index | Production clean |

### 9.2 Metadata and content differences

- Live title/OG title use an em dash; local uses a hyphen.
- Live description uses “Multidisciplinary digital creator — …”; local uses “Multidisciplinary digital creator: …”.
- Live `<noscript>` still begins with the stray `_pasindu`; local begins with `Pasindu Lochana Rathnayaka - LOCHGRAPHY.`
- Live HTML references `index-DWudGXXP.js` / `index-CM7W5S49.css`; local references `index-i8m0H0Qh.js` / `index-SdTncxFv.css`.
- Live JS lacks the new project descriptions, `descriptionShort`, About disclosure copy, service disclosure copy, `useMediaQuery`, and mobile shader-framing uniforms.
- Live CSS lacks the new mobile footer grid, hero identity strip, short-height nav focus rule, and related responsive styles.
- Live project cards still show the older “Campus Portfolio (PS Portfolio)” presentation; local uses the separate alias treatment.
- Live CV is the previous one-page A4 with 2,023 extracted characters and old address/phone content; local is the approved tagged CV with 2,804 characters.

### 9.3 Approved changes not yet live

At minimum, the following are present locally but not in production:

1. The approved Stage 5.1 tagged CV.
2. M-01/M-02 caption corrections.
3. M-03 mobile-menu scrolling/short-height/focus fixes.
4. M-04 hero second-line contrast fill/stroke.
5. L-01 accessible project arrow.
6. L-02 `<noscript>` fix.
7. Stage 2/3 responsive content and layout changes.
8. Mobile black-hole framing and iOS wordmark spill fixes.

### 9.4 Live smoke check

The live site was loaded at 390 × 844 and 1440 × 900:

- 0 console errors, 0 page errors, 0 failed requests, 0 HTTP ≥ 400.
- No horizontal overflow.
- All five nav links and four project titles present.
- The site is the previous version; no new/unrelated runtime regression was observed in this smoke check.
- The live CV remains the old version, and the live HTML remains the old build. This is H-01, not a new regression.

Remote `origin/main` equals local HEAD (`470421a…`), so there are no unpushed commits; the entire working tree is uncommitted. Vercel cannot include it until an approved commit/push occurs.

---

## 10. Release blockers and recommendations

### 10.1 Severity summary

| Severity | Finding | Status |
|---|---|---|
| Critical | None found | — |
| High | **H-01** — production is stale relative to the verified working tree | Open until approved commit/push/deploy |
| High | **H-02** — diagnostic source files could enter a blanket release | Mitigated by build guard and selective staging; process risk remains |
| Medium | **M-06** — hero/nav collision at 390 × 390 | New Stage 6A finding; fix or explicitly accept |
| Medium/Low | Formal PDF/UA conformance not validated | Structural tagging passes; formal validation deferred |
| Low | Vercel dashboard linkage/Node version not fully verifiable | Verify first deployment log |
| Low | LinkedIn returns HTTP 999 to automated requests | Bot block; not a dead link |
| Low | Optional SEO/performance items (O-01–O-08) | Deferred; no current failure |
| Not a defect | Headless Chromium screenshot/WebGL artifacts | Capture-only; not representative |

### 10.2 H-01 — stale production

This is expected at the start of a release: the working tree is uncommitted and the live site serves the previous deployment. Resolution requires the approved release activity: selective staging, commit, push, Vercel Git build, and live verification. It is not a source defect and should not be “fixed” by editing files.

### 10.3 H-02 — diagnostic exclusion

The current build guard is effective: a fresh `dist` contains no `webgl-diag*`, and production already returns 404 for both diagnostic paths. The residual risk is procedural: `public/webgl-diag.html`, `webgl-diag2.html`, and `src/webgl-diag2-entry.tsx` remain untracked. Do not use `git add -A`; stage only the manifest. If diagnostic sources are ever committed, the build guard still prevents their output from being published, but repository hygiene would suffer.

### 10.4 M-06 — hero/nav collision

Fix options (not applied in this read-only audit):

- Add a nav-aware top offset/safe-area padding to the hero content at short heights, or
- Add a short-height hero layout that starts content below the fixed nav, or
- Reduce the mobile hero content height at the smallest square viewports.

After a fix, re-run 390 × 390 and 844 × 390 in both engines and re-check the initial viewport screenshot. If the issue is accepted instead, record it as a known short-viewport limitation in the release notes.

### 10.5 Manual actions before release

1. Decide M-06: fix before release, or explicitly accept it as a known limitation.
2. Decide the source CV `assets/cv/Pasindu Lochana.pdf`: leave it unstaged unless the owner confirms it belongs in the release.
3. Stage exactly the proposed manifest; do not use `git add -A`.
4. Review `git diff --cached --name-status` and `git diff --cached --check`.
5. Commit and push to `main`; let Vercel build from the commit, not from a working-tree CLI upload.
6. Verify the live deployment: new JS/CSS hashes, new CV hash, new metadata, `/webgl-diag.html` 404, and a six-viewport smoke test.
7. If formal PDF/UA conformance is required, run a dedicated validator or manual PDF/UA review before claiming it.

### 10.6 Do not reopen completed Stage 5.1 fixes

The Stage 5.1 fixes (H-02 build guard, M-01/M-02 captions, M-03 menu, M-04 contrast, M-05 tagged CV, L-01 arrow, L-02 noscript) were re-verified in this audit and passed. M-06 is new evidence about the short square viewport; it is not a failure of a completed Stage 5.1 fix.

---

## 11. Proposed release manifest

### 11.1 Files to stage

| Path | Change | Reason |
|---|---|---|
| `index.html` | Modified | Current metadata and L-02 `<noscript>` fix used by the verified build. |
| `package.json` | Modified | Adds the H-02 diagnostic prune to the build. |
| `public/assets/cv.pdf` | Modified | Approved tagged one-page A4 CV; served and downloaded by the site. |
| `src/components/Hero.tsx` | Modified | Mobile identity strip and current hero copy. |
| `src/components/Nav.tsx` | Modified | ARIA-label consistency; keeps committed source aligned with the audited tree. |
| `src/components/ProjectCard.tsx` | Modified | Alias/status metarow, short/full copy, accessible arrow. |
| `src/components/Reveal.tsx` | Modified | Observer fallback and `observeOnly` behaviour. |
| `src/components/Sections.tsx` | Modified | Current About/Education/Services/Contact/Footer structure and disclosures. |
| `src/components/ServiceCard.tsx` | Modified | Current service content and disclosure. |
| `src/components/SiteBackground.tsx` | Modified | Pre-existing mobile black-hole framing; current verified build depends on it. Protected file not modified by Stage 6A. |
| `src/components/refracted-renderer.ts` | Modified | Pre-existing iOS wordmark spill fix; current verified build depends on it. Protected file not modified by Stage 6A. |
| `src/components/useMediaQuery.ts` | New | Required by `Sections.tsx` and `ServiceCard.tsx`; omitting it breaks the build. |
| `src/data/content.ts` | Modified | Current project/service/education content and M-01/M-02 caption corrections. |
| `src/index.css` | Modified | Current responsive layout, menu, hero contrast, disclosures, footer, focus. |
| `scripts/prune-diagnostic-pages.mjs` | New | H-02 post-build guard. |
| `src/components/CountUp.tsx` | Deleted | About statistics removed; no remaining references. |
| `src/components/LoadingIndicator.tsx` | Deleted | Pre-existing unused component; no remaining references. |

### 11.2 Files to exclude

| Path | Reason |
|---|---|
| `assets/cv/Pasindu Lochana.pdf` | **Investigate**; tracked source CV, not served; preserve and leave unstaged unless owner confirms. |
| `PORTFOLIO-CONTENT-AUDIT.md` | Audit report. |
| `STAGE-2-IMPLEMENTATION-REPORT.md` | Implementation report. |
| `STAGE-3-IMPLEMENTATION-REPORT.md` | Implementation report. |
| `STAGE-4-CV-IMPLEMENTATION-REPORT.md` | Implementation report. |
| `STAGE-5-FINAL-AUDIT-REPORT.md` | Audit report. |
| `STAGE-5.1-IMPLEMENTATION-REPORT.md` | Implementation report. |
| `STAGE-6A-RELEASE-AUDIT-REPORT.md` | This audit deliverable. |
| `public/webgl-diag.html` | Diagnostic source; do not commit. |
| `webgl-diag2.html` | Diagnostic source; do not commit. |
| `src/webgl-diag2-entry.tsx` | Diagnostic source; do not commit. |
| `dist/` | Generated/gitignored; Vercel rebuilds it. |
| Ignored local artifacts | `node_modules/`, `.DS_Store`, `.VSCodeCounter/`, `.freebuff/`, `legacy-v1/`, `references/`, `*.tsbuildinfo`. |

### 11.3 Already tracked, unchanged

`vercel.json`, `package-lock.json`, `vite.config.ts`, `public/robots.txt`, `public/sitemap.xml`, `public/assets/hero/*`, `public/assets/logo.png`, `public/assets/og.jpg`, profile/project images, and all other unchanged tracked files require no staging action. Do not modify `vercel.json` for this release; the existing configuration matches the verified build and live headers.

### 11.4 Proposed staging sequence (do not execute without approval)

```bash
# Stage only the release manifest. Do not use git add -A.
git add -- \
  index.html package.json public/assets/cv.pdf \
  src/components/Hero.tsx src/components/Nav.tsx \
  src/components/ProjectCard.tsx src/components/Reveal.tsx \
  src/components/Sections.tsx src/components/ServiceCard.tsx \
  src/components/SiteBackground.tsx src/components/refracted-renderer.ts \
  src/components/useMediaQuery.ts src/data/content.ts src/index.css \
  scripts/prune-diagnostic-pages.mjs

# Record the two intentional deletions.
git add -u -- src/components/CountUp.tsx src/components/LoadingIndicator.tsx

# Review before committing.
git diff --cached --name-status
git diff --cached --check
```

### 11.5 Post-deploy verification

1. Live HTML references the new `index-i8m0H0Qh.js` and `index-SdTncxFv.css` (or the new hashes after any M-06 fix).
2. Live JS/CSS hashes and sizes match the local build.
3. Live CV is 58,030 bytes with SHA-256 `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3` (or the new approved hash).
4. Live title/description use the current hyphen/colon copy; `<noscript>` no longer starts with `_pasindu`.
5. `/webgl-diag.html` and `/webgl-diag2.html` return 404.
6. Live headers still include the configured CSP and security headers.
7. Smoke-test 360 × 740, 390 × 844, 390 × 390, 844 × 390, 1440 × 900, and 1920 × 1080 in Chromium and WebKit; verify menu, disclosures, CV download, project destination, and no console/HTTP errors.
8. Verify the deployed commit is the intended `main` commit and not a working-tree CLI upload.

---

## 12. Explicit final recommendation

# READY WITH CONDITIONS

The application source, production build, TypeScript state, CV, browser behaviour, and repository-side Vercel configuration pass their technical release checks. No Critical or High source defect was found. The live deployment is stale only because the approved changes remain uncommitted; that is resolved by the release itself.

Release approval is conditional on:

1. **M-06 decision:** fix the 390 × 390 hero/nav collision before release, or explicitly accept it as a known short-viewport limitation and document it. If 390 × 390 is considered a must-pass viewport, the tree is **not ready** until it is fixed.
2. **Selective staging:** stage only the manifest in section 11; do not use `git add -A`. Exclude reports, diagnostic sources, `dist/`, and the source CV unless separately approved.
3. **Git-based deployment:** commit and push to `main`; let Vercel build from the commit. Do not deploy from an uncommitted working tree.
4. **Post-deploy verification:** confirm the new JS/CSS/CV hashes, current metadata, `/webgl-diag.html` 404, and the six-viewport smoke test.
5. **PDF/UA claim:** treat formal PDF/UA conformance as a deferred manual/validator item; the structural tagging evidence passes, but no formal certificate was produced.

**Stop point:** this audit is complete. Nothing was staged, committed, pushed, or deployed. No application file, `.gitignore`, CV, or protected shader/background file was modified. The only new file is this report. Awaiting explicit release approval before any release activity.
