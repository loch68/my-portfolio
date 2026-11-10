# Stage 5 — Final Portfolio-Wide Audit Report

**Project:** LOCHGRAPHY portfolio (`my-portfolio`)  
**Audit date:** 9 November 2026  
**Mode:** Read-only audit — no application edits, staging, commits, pushes, deploys, resets, reverts, restores, cleans, `.gitignore` changes, CV changes, or shader/background edits were made.  
**Approval gate:** This report stops for approval. No fixes have been applied.

---

## Executive summary

The current working tree is structurally sound. The production build renders without console errors, failed requests, horizontal overflow, or layout collapse at every required viewport in both Chromium and WebKit. Keyboard interaction, the mobile menu focus trap, native disclosures, reduced-motion handling, and the CV download all work.

No **Critical** issues were found. The audit found:

- **2 High** — the live deployment is stale relative to the verified working tree, and an untracked WebGL diagnostic page is copied into `dist` and would be published by a working-tree deploy.
- **5 Medium** — two project-caption URL/domain inaccuracies, a clipped mobile-landscape menu item, an outline-only hero line with no guaranteed contrast over bright shader regions, and an untagged CV PDF.
- **2 Low** — a CSS-generated arrow included in a heading's accessible name, and a stray `_pasindu` prefix in the `<noscript>` copy.
- **8 Optional improvements** — no current failure; recommended enhancements for SEO, image delivery, font loading, shader startup cost, sitemap metadata, iOS icon size, legacy asset cleanup, and Twitter attribution.

**Release recommendation:** resolve the two High items before the next production deploy. Fix the Medium content/accessibility items in the same pass if possible. The Low and Optional items can follow without blocking release.

---

## 1. Repository baseline

| Item | Value |
|---|---|
| Working directory | `/Users/lochgraphy/Documents/Desktop/my-portfolio` |
| Branch | `main...origin/main` |
| HEAD | `470421a911936b9a27f4c2c7b8b39b9ac009c292` — “Fix solid LOCH wordmark rendering on iOS Safari” |
| Remote | `origin` → `https://github.com/loch68/my-portfolio.git` |
| Staged changes | None |
| Stashes | None |
| Commits / pushes / deploys during audit | None |
| Build command | `npm run build` → `tsc -b && vite build && node scripts/prune-legacy-hero-assets.mjs` |
| Build output | `dist/` (gitignored) |
| Preview | `http://localhost:4173/` serving the existing current `dist` |
| Live | `https://lochgraphy.vercel.app/` serving the last deployed commit |
| Current local build | JS `index-CYbRfRqs.js` 303.93 kB (96.18 kB gzip); CSS `index-CpuWIMhd.css` 54.01 kB (26.78 kB gzip); `dist` 1.6 MB / 23 files |
| Live build | JS `index-DWudGXXP.js`; CSS `index-CM7W5S49.css` |

**Working-tree inventory at audit start:**

- Modified tracked files: `assets/cv/Pasindu Lochana.pdf`, `index.html`, `public/assets/cv.pdf`, `src/components/Hero.tsx`, `src/components/Nav.tsx`, `src/components/ProjectCard.tsx`, `src/components/Reveal.tsx`, `src/components/Sections.tsx`, `src/components/ServiceCard.tsx`, `src/components/SiteBackground.tsx`, `src/components/refracted-renderer.ts`, `src/data/content.ts`, `src/index.css`.
- Deleted tracked files: `src/components/CountUp.tsx`, `src/components/LoadingIndicator.tsx`.
- Untracked files: `PORTFOLIO-CONTENT-AUDIT.md`, `STAGE-2-IMPLEMENTATION-REPORT.md`, `STAGE-3-IMPLEMENTATION-REPORT.md`, `STAGE-4-CV-IMPLEMENTATION-REPORT.md`, `public/webgl-diag.html`, `src/components/useMediaQuery.ts`, `src/webgl-diag2-entry.tsx`, `webgl-diag2.html`.

**Baseline notes:**

- The working tree contains the Stage 2/3/4 implementation changes and the Stage 4 CV. They are **not committed**, so the live Vercel deployment does not include them.
- `dist/` is gitignored; Vercel builds from the repository source. A successful local `dist` does not by itself update production.
- `src/components/useMediaQuery.ts` is a new untracked source file used by `Sections.tsx` and `ServiceCard.tsx`; it is part of the current working tree.
- `CountUp.tsx` and `LoadingIndicator.tsx` are deleted intentionally; the current build has no references to them.
- No new dependencies were added in Stage 5. `package.json` is unchanged.
- No `.env*` files exist. The only environment-variable reference in application source is Vite’s built-in `import.meta.env.BASE_URL` in `src/assets.ts:2`. `.gitignore` covers `.env` and `.env.*`. No secrets were identified.

---

## 2. Audit coverage

**Tools and methods**

- Playwright **Chromium** and **WebKit**, headless for functional checks; **headed Chromium** and **WebKit** for visual/performance confirmation.
- HTTP checks with `curl` for local preview, live production, asset MIME types, byte sizes, redirects, headers, and external links.
- Raw PDF object inspection for page count, page size, text extraction, URI annotations, creation metadata, and tagged-PDF markers.
- Source/config review of `src/`, `public/`, `dist/`, `index.html`, `vercel.json`, `vite.config.ts`, `package.json`, `robots.txt`, `sitemap.xml`, and the build/prune scripts.
- Accessibility tree inspection via Chromium CDP (`Accessibility.getFullAXTree`), keyboard focus-order testing, target-size measurement, and computed-style contrast checks.

**Viewports tested**

| Class | Viewports |
|---|---|
| Small mobile | 360 × 740, 390 × 844, 402 × 714, 430 × 932 |
| Tablet | 768 × 1024 |
| Desktop | 1440 × 900, 1920 × 1080 |
| Mobile landscape | 844 × 390 |

**Checks performed**

- Horizontal overflow, clipping, section heights, image aspect ratios, sticky/fixed navigation, mobile menu geometry.
- Console errors, page errors, failed requests, HTTP status ≥ 400.
- Skip link, desktop anchors, active-section state, logo-to-top, mobile menu open/Escape/focus trap/focus restoration, background `inert`, section focus after menu navigation.
- Service and About disclosures on mobile and desktop; reduced-motion behavior; CV download metadata and payload.
- Title, description, canonical, OG/Twitter metadata, favicon, robots, sitemap, heading hierarchy, alt text, link health.
- Accessible names, landmarks, heading levels, duplicate IDs, focus visibility, target sizes, contrast, reduced motion, PDF accessibility.
- FCP, LCP, CLS, frame rate, long tasks, resource transfer sizes, build output, security headers, and deployment parity.

**Limitations / exclusions**

- **Headless Chromium WebGL is software-rendered** in this environment and produces non-representative long tasks and frame rates. Those numbers were discarded for performance conclusions; headed Chromium and WebKit were used instead.
- The **bottom-edge white band** visible in some headless Chromium screenshots is a capture/compositor artifact. It does not appear in WebKit or headed Chromium and is **not** reported as a site defect.
- **LinkedIn returns HTTP 999** to automated requests. This is a bot block, not evidence that the profile is dead; the link was not classified as broken.
- `nethwinlk.com` has no DNS record; this is confirmed independently of HTTP.
- PDF tagged status was checked by raw object inspection (`/StructTreeRoot`, `/MarkInfo`, `/Lang`); a full PDF/UA validator was not available.
- No physical screen-reader or low-vision user test was performed; the accessibility tree and keyboard behavior were used as evidence.
- No long-duration memory soak test was performed.
- No fixes, deployment, or CV modification was performed.

---

## 3. Visual / responsive

**Result:** No horizontal overflow, no console/page errors, and no failed requests at any required viewport in Chromium or WebKit. The page layout remains stable from 360 px through 1920 px and in mobile landscape. The one visual exception is the mobile-landscape menu overlay clipping described in **M-03**. Section screenshots at 390, 768, 1440, 1920, and landscape were inspected in WebKit.

**Verified good**

- Hero wordmark, statement, sub-copy, and scroll cue fit at 360 × 740, 390 × 844, 402 × 714, and 430 × 932 without collision or overflow.
- Tablet 768 × 1024 and desktop 1440 × 900 / 1920 × 1080 grids, project cards, service cards, education rail, contact, and footer align correctly.
- Project images preserve their 1600 × 843–879 aspect ratios; no stretching or layout shift.
- Section headings, hairline rules, and mono labels remain aligned across breakpoints.
- No element extends past the viewport width at any tested size. No unintended off-screen content was found; `.sr-only` text, the skip link, and the closed mobile menu are intentionally hidden until needed.
- WebKit and headed Chromium screenshots agree on layout; the headless Chromium bottom white band is a capture artifact and was discarded.

### M-03 — Mobile-landscape menu clips the Contact link

- **Type:** Confirmed defect
- **Severity:** Medium
- **Location:** `src/index.css:406–437` — `.nav__links` is `position: fixed; inset: 0; flex-direction: column; justify-content: center; padding: 6rem 1.5rem 2rem;` and `body.nav-open { overflow: hidden; }`.
- **Evidence:** WebKit at 844 × 390: menu `scrollHeight` 401 px, `clientHeight` 390 px, `overflow: visible`; the fifth link (“05 Contact”) sits at `y = 348.4`, `height = 46.8`, so its bottom is **395.2 px** in a 390 px viewport. The screenshot shows the link clipped at the bottom edge. The body cannot scroll while the menu is open.
- **User impact:** In landscape on short phones, the last navigation item is partially off-screen and the menu cannot be scrolled. Touch users may not be able to tap the full target; the menu looks broken.
- **Recommended resolution:** Allow the menu to scroll (`overflow-y: auto`) and use a short-height layout (`@media (max-height: 500px)`) that reduces the vertical gap and padding, or use `justify-content: flex-start` with safe-area padding. Keep `body.nav-open` locked only when the menu itself can scroll. Verify at 844 × 390 and 740 × 360.

### M-04 — Hero second line has no guaranteed contrast over bright shader regions

- **Type:** Confirmed risk (accessibility)
- **Severity:** Medium
- **Location:** `src/index.css:509–514` — `.hero__statement .dim { color: var(--color-surface); -webkit-text-stroke: 0.5px var(--color-text); color: transparent; }`; markup at `src/components/Hero.tsx:76–80`.
- **Evidence:** “Creating visual stories.” is rendered as a transparent fill with only a 0.5 px outline. The background is the animated WebGL shader, which has bright highlight regions that move behind the hero. When the bright region passes behind the outline, the effective contrast of the thin stroke falls below the 3:1 large-text threshold; the fill provides no fallback. The hero’s left-side readability wash is a gradient, not a guaranteed solid backing for this line.
- **User impact:** Low-vision users can lose the second half of the H1 when the shader is bright behind it. Because it is the main headline, the failure affects the page’s primary message.
- **Recommended resolution:** Give the line a solid or semi-opaque fill (for example `color: var(--color-text)` or a translucent light fill) and keep the stroke as a secondary treatment, or add a localized dark scrim behind the hero copy that guarantees contrast across all shader frames. Verify by sampling the rendered text/background contrast at several animation states and with reduced motion enabled.

---

## 4. Interaction

**Result:** All required interactions passed in Chromium and WebKit. The only interaction-adjacent defect is the landscape menu clipping described in M-03.

**Verified good**

- **Skip link:** visible on focus, jumps to `#main`, and `main` receives focus.
- **Desktop navigation:** all five anchor links scroll to the correct section; `aria-current="true"` is applied to the active section and the active styling is visible. The earlier suspicion that `aria-current` was not applied was disproven at runtime.
- **Logo:** returns to the top.
- **Mobile menu:** opens with `aria-expanded="true"`; focus moves to the first link; Tab/Shift+Tab loop inside the menu; Escape closes it and restores focus to the toggle; `main`, footer, skip link, and brand are `inert` while open and restored on close; selecting a link closes the menu and moves focus to the target section.
- **Disclosures:** mobile service cards start closed and open with Enter/Space; desktop service lists are open by default; the About disclosure opens and closes correctly on mobile.
- **Reduced motion:** with `prefers-reduced-motion: reduce`, the background renders a static frame, no animation frames are scheduled (0 RAF over 2 s), and CSS transitions/animations are effectively disabled.
- **CV:** the “Download CV (PDF)” link points to `/assets/cv.pdf`, has the `download` attribute, returns HTTP 200 with `application/pdf`, and the downloaded bytes match the local file.

**No additional interaction defects found.** No broken focus order, no keyboard trap outside the intentional menu trap, no missing `aria-expanded` state, and no console errors during interaction.

---

## 5. Content / project

**Project inventory:** four projects — Ceylon Pathways (live, external link), Telca Solutions CCTV (under construction, no link), Nethwin Bookshop (no link), Campus Portfolio (academic, no link).

**Verified good**

- Project titles, categories, status labels, descriptions, short descriptions, and tags are present and consistent with the card layout.
- The live Ceylon Pathways link (`https://ceylon-pathways.vercel.app`) returns HTTP 200.
- Telca and Campus Portfolio correctly omit external links rather than presenting dead actions.
- Project images have descriptive alt text and explicit `width`/`height`.
- External links use `target="_blank"` with `rel="noopener noreferrer"` and accessible “opens in a new tab” text.
- Displayed contact details (primary email, primary phone, Instagram, LinkedIn, GitHub) are present and consistent with the Stage 4 baseline.
- The data file also defines `CONTACT.emailAlt` and `CONTACT.phones[1]`, but the Contact section renders only the primary email and phone. This appears intentional; confirm whether both should be public.
- Education entries match the Stage 4 CV: Gamini Central College, NIBM, and SLIIT City University (University of Bedfordshire partnership).

### M-01 — Ceylon Pathways caption points to a 404 host

- **Type:** Confirmed defect
- **Severity:** Medium
- **Location:** `src/data/content.ts:61` — `caption: 'ceylonpathways.vercel.app — live site'`; the actual link is `src/data/content.ts:64` — `https://ceylon-pathways.vercel.app`.
- **Evidence:** `ceylonpathways.vercel.app` resolves but returns **HTTP 404**. `ceylon-pathways.vercel.app` (with the hyphen) returns **HTTP 200** with the live site. The caption and the link therefore disagree.
- **User impact:** A visitor who reads or manually enters the caption reaches a 404. It also weakens confidence in the project’s “Live” status.
- **Recommended resolution:** Change the caption to `ceylon-pathways.vercel.app — live site`, or make the caption a link to the working URL. Re-check the live URL after any domain change.

### M-02 — Nethwin caption claims a domain with no DNS record

- **Type:** Confirmed defect
- **Severity:** Medium
- **Location:** `src/data/content.ts:102` — `caption: 'nethwinlk.com — print & bookshop project'`.
- **Evidence:** `dig +short nethwinlk.com` and `dig +short www.nethwinlk.com` return no records; `curl https://nethwinlk.com` fails with “Could not resolve host.” The caption presents the domain as if it were a live destination.
- **User impact:** The caption implies a working website that does not resolve. Visitors may try the domain and conclude the project is dead; it also creates a factual inconsistency in the portfolio.
- **Recommended resolution:** Replace the caption with a non-URL descriptor such as “print & bookshop project — NethwinLK Printers,” or restore/confirm the domain before claiming it. If a live URL exists under another host, use that exact URL.

### L-02 — `<noscript>` copy begins with a stray `_pasindu`

- **Type:** Confirmed defect
- **Severity:** Low
- **Location:** `index.html:48` — `_pasindu lochana rathnayaka - lochgraphy. Websites, creative production, ...`
- **Evidence:** The rendered `<noscript>` text starts with an underscore and lower-case name. This is visible when JavaScript is disabled.
- **User impact:** Users without JavaScript see a typo in the fallback copy; it reads as unfinished and slightly undermines the professional first impression.
- **Recommended resolution:** Change the first line to `Pasindu Lochana Rathnayaka — LOCHGRAPHY.` (or the hyphen style used elsewhere in the file) and keep the remaining fallback copy.

**External link check**

| Destination | Result | Classification |
|---|---|---|
| `https://ceylon-pathways.vercel.app` | 200 | Good |
| `https://instagram.com/lochgraphy` | 200 | Good |
| `https://github.com/loch68` | 200 | Good |
| `https://www.linkedin.com/in/pasindu-lochana-rathnayaka-86252a252/` | 999 | Bot-blocked; not confirmed dead |
| `https://nethwinlk.com` | DNS failure | Confirmed dead domain |

---

## 6. CV

**Current web CV (`public/assets/cv.pdf`)**

| Property | Value |
|---|---|
| Size | 40,469 bytes |
| SHA-256 | `ed7795b1788c9d0fa1e0b70bd9ea9654b7f27884379e2bc9424e922e42694395` |
| Pages | 1 |
| Page size | A4 — 594.96 × 841.92 pt |
| Creation / modification | 2026-11-08 20:51:19 +05:30 |
| Producer | Skia/PDF m156 |
| Creator | LOCHGRAPHY |
| Title | Pasindu Lochana Rathnayaka - Curriculum Vitae |
| Text extraction | Pass — profile, experience, projects, education, skills, languages, reference |
| URI annotations | 5 unique: `mailto:lochgraphy@gmail.com`, `tel:+94778660753`, `https://lochgraphy.vercel.app/`, LinkedIn, GitHub |
| Tagged PDF | **No** — no `/StructTreeRoot`, `/MarkInfo`, or `/Lang` |

**Source CV (`assets/cv/Pasindu Lochana.pdf`)**

- 110,698 bytes; SHA-256 `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346`.
- This is the working-tree source/export; the web-optimized `public/assets/cv.pdf` is the file served by the current local build. The Stage 4 verification baseline applies to the web CV.
- The HEAD version was 72,129 bytes; the working tree intentionally replaces it with the Stage 4 CV.

**Download verification**

- Local preview: `GET /assets/cv.pdf` → 200, `application/pdf`, 40,469 bytes; downloaded SHA-256 matches `public/assets/cv.pdf`.
- `dist/assets/cv.pdf` matches `public/assets/cv.pdf` byte-for-byte.
- The “Download CV (PDF)” link is same-origin and carries the `download` attribute.

**Live CV**

- `https://lochgraphy.vercel.app/assets/cv.pdf` → 200, 72,129 bytes, SHA-256 `79a7727634b9c8b4f6b07bbccc46c210dedcd179d23e2facfa91ffc0e62cfcf1`, creation date 2025-11-23, producer macOS Quartz PDFContext.
- This is the previous CV, not the Stage 4 CV. See **H-01**.

### M-05 — CV PDF is untagged

- **Type:** Confirmed defect
- **Severity:** Medium
- **Location:** `public/assets/cv.pdf` (and the generated `dist/assets/cv.pdf`).
- **Evidence:** Raw object inspection finds no `/StructTreeRoot`, no `/MarkInfo`, and no `/Lang`. The PDF has extractable text and five URI annotations, but no structure tree, heading semantics, list semantics, reading order, or document language.
- **User impact:** Screen-reader users cannot navigate the CV by headings or rely on a defined reading order. The PDF falls short of WCAG 2.1 / PDF/UA expectations for a document that is offered as a download.
- **Recommended resolution:** Export a tagged PDF from the source document with headings, lists, reading order, document language, and link annotations preserved; keep the one-page A4 layout and verify text extraction, URI annotations, and the served hash. If the authoring tool cannot produce a tagged PDF, add an accessible HTML CV page as a fallback and link it beside the PDF.

**Verified good:** the CV is one page, A4, text-extractable, contains the expected contact links, and matches the Stage 4 content baseline. No CV changes were made during Stage 5.

---

## 7. SEO

**Verified good**

- `<title>` is present and unique: “Pasindu Lochana Rathnayaka - LOCHGRAPHY.”
- Meta description is present, specific, and within a reasonable search-snippet length.
- `<meta name="author">`, `robots` (`index, follow, max-image-preview:large`), `theme-color`, and `color-scheme` are present.
- Canonical URL is absolute and matches the live origin: `https://lochgraphy.vercel.app/`.
- Open Graph tags include type, site name, locale, URL, title, description, image, image type, width, height, and alt.
- Twitter tags include `summary_large_image`, title, description, image, and image alt.
- Favicon and Apple touch icon are present; `og.jpg` is a real 1200 × 630 JPEG (111,323 bytes).
- `public/robots.txt` allows crawling and declares the sitemap.
- `public/sitemap.xml` is valid XML with the canonical homepage URL.
- Heading hierarchy is H1 → H2 → H3 with no skipped levels.
- Content images have descriptive alt text; the logo is correctly decorative (`alt=""`).
- `<html lang="en">` is present.
- No `hreflang` is needed for a single-language site.

**Live-state caveat:** the live deployment still serves the older metadata (em dash instead of the local hyphen and older copy). This is part of **H-01**, not a separate metadata defect.

### H-01 — Production deployment is stale relative to the verified working tree

- **Type:** Confirmed production-readiness defect
- **Severity:** High
- **Location:** Deployment state; compare `https://lochgraphy.vercel.app/` with the current `dist/` and working tree.
- **Evidence:**
  - Live HTML references `index-DWudGXXP.js` and `index-CM7W5S49.css`; the current local build uses `index-CYbRfRqs.js` and `index-CpuWIMhd.css`.
  - Live HTML is 2,889 bytes and still uses the older em-dash title/description; local `dist/index.html` is 2,874 bytes with the current copy.
  - Live CV is 72,129 bytes, SHA-256 `79a7…`, created 2025-11-23; the working-tree web CV is 40,469 bytes, SHA-256 `ed77…`, created 2026-11-08.
  - The working-tree changes (Stage 2/3/4) are uncommitted, so Vercel’s Git-based build cannot include them.
- **User impact:** Visitors, recruiters, and clients see the previous content and the previous CV. The Stage 4 CV and the current fixes are not actually live, even though they exist locally.
- **Recommended resolution:** After approval, stage the intended files **selectively** (do not use `git add -A`), commit, push, and let Vercel build. Verify the live HTML references the new asset hashes, the live CV hash equals `ed7795…`, and the live metadata matches the working tree. Do not deploy the diagnostic files described in **H-02**.

### H-02 — WebGL diagnostic page is copied into `dist` and would be published by a working-tree deploy

- **Type:** Confirmed production-readiness risk (conditional on deploy method)
- **Severity:** High
- **Location:** `public/webgl-diag.html` (untracked), copied to `dist/webgl-diag.html`; related leftovers `webgl-diag2.html` and `src/webgl-diag2-entry.tsx` (untracked, root-level).
- **Evidence:**
  - `public/webgl-diag.html` is 16 KB; `dist/webgl-diag.html` is 12,303 bytes and is served locally at `http://localhost:4173/webgl-diag.html` with HTTP 200 and `text/html`.
  - The page title is “WebGL compositing diagnostic — premultipliedAlpha A/B”; it has no `noindex` meta tag.
  - `public/robots.txt` allows all crawling (`User-agent: * / Allow: /`), so the page would be crawlable if published.
  - The live URL currently returns 404 because the last deployment predates the file. A Git-based deploy would not include it unless it is committed; a working-tree/Vercel CLI deploy would include it.
  - `webgl-diag2.html` is not inside `public/`, so it is not copied to `dist`; the local preview’s 200 response for `/webgl-diag2.html` is Vite’s SPA fallback (the 2,874-byte `index.html`), not the diagnostic file. It is still an untracked root-level leftover that could be accidentally committed.
- **User impact:** If published, an internal shader-investigation page becomes publicly accessible and indexable, diluting the portfolio’s professional surface and search results. It is not a secret-bearing page, but it is not intended for visitors.
- **Recommended resolution:** Remove `public/webgl-diag.html` from `public/` (or move it outside the build input), and delete or archive `webgl-diag2.html` and `src/webgl-diag2-entry.tsx` after approval. If a diagnostic page must remain reachable, serve it outside production or add `noindex` and a `robots.txt` disallow as defense in depth. Rebuild and confirm `dist/` contains no `webgl-diag*.html`; stage files selectively.

### Optional SEO improvements

#### O-01 — Add Person/ProfilePage structured data

- **Type:** Optional improvement
- **Location:** `index.html` `<head>`.
- **Evidence:** No `<script type="application/ld+json">` block is present.
- **User impact:** Search engines have less explicit entity data (name, role, sameAs profiles) and are less likely to associate the site with the person across platforms. This is not a current failure.
- **Recommended resolution:** Add a `Person` or `ProfilePage` JSON-LD block with `name`, `jobTitle`, `url`, `sameAs` (LinkedIn, GitHub, Instagram), and `knowsAbout`; validate with the Rich Results Test.

#### O-03 — Add `lastmod` to the sitemap

- **Type:** Optional improvement
- **Location:** `public/sitemap.xml`.
- **Evidence:** The sitemap contains one `<url>` with `<loc>` only; no `<lastmod>`.
- **User impact:** Minor; crawlers have no freshness hint for the single page.
- **Recommended resolution:** Add a `<lastmod>` value when the homepage content changes. Keep the single-URL sitemap if the site remains one page.

#### O-04 — Provide a 180 × 180 Apple touch icon

- **Type:** Optional improvement
- **Location:** `index.html:44` references `public/assets/logo.png`, which is 128 × 128.
- **Evidence:** `sips` reports the logo as 128 × 128; the `apple-touch-icon` is declared at `sizes="128x128"`. Apple’s current guidance is 180 × 180.
- **User impact:** iOS home-screen icons may be scaled and slightly soft. No effect on normal browsing.
- **Recommended resolution:** Export a 180 × 180 PNG and add a separate `apple-touch-icon` link; keep the 128 × 128 favicon for browser tabs.

#### O-08 — Add Twitter site/creator attribution if accounts exist

- **Type:** Optional improvement
- **Location:** `index.html` Twitter meta block.
- **Evidence:** `twitter:card`, title, description, image, and image alt are present; `twitter:site` and `twitter:creator` are absent.
- **User impact:** Minor attribution/display difference when the page is shared on X/Twitter. No current failure.
- **Recommended resolution:** Add `twitter:site` and `twitter:creator` only if the project has active X/Twitter handles; otherwise leave them out.

---

## 8. Accessibility

**Verified good**

- **Keyboard access:** skip link, desktop nav, mobile menu, disclosures, contact links, social links, CV link, and back-to-top are all reachable and operable.
- **Focus visibility:** `:focus-visible` uses `outline: 2px solid #97D7FF` with `outline-offset: 3px`; the focus color has an 8.76:1 contrast ratio against the page background.
- **Focus management:** mobile menu moves focus to the first link, traps Tab/Shift+Tab, closes on Escape, restores focus to the toggle, and makes the rest of the page `inert`; section navigation moves focus to the target section.
- **Accessible names:** no empty link, button, or image names were found in the accessibility tree. The wordmark exposes `role="img"` with `aria-label="LOCH"` and fallback text. Decorative icons and the background canvas are `aria-hidden="true"`.
- **Landmarks:** `header`, labeled `nav`, `main`, labeled sections, and `footer` are present. Section headings are wired with `aria-labelledby`.
- **Heading order:** H1 → H2 → H3 with no skipped levels. The H1 accessible name is “Building digital experiences. Creating visual stories.”
- **Duplicate IDs:** none.
- **Target sizes:** all interactive targets measured at least 24 × 24 CSS px; the nav toggle is 44 × 44, and contact rows use a 44 px minimum height.
- **Contrast:** body text 10.96:1; muted text 6.99:1 on the base background and 5.97:1 on the surface; muted text on the dark hero wash 9.12:1. The accent `#1670BB` is 2.64:1 but is used for decorative icons and borders, not for text.
- **Reduced motion:** static background frame, 0 RAF over 2 s, CSS animations/transitions reduced to 0.01 ms, and `scroll-behavior: auto`.
- **Disclosures:** native `<details>`/`<summary>` with visible labels (“What’s included,” “More about my work”); keyboard and pointer operation both work.
- **ARIA state:** `aria-expanded` on the menu toggle and `aria-current="true"` on the active nav link both update correctly at runtime.

**Confirmed accessibility issues:** M-04 (hero contrast), M-05 (untagged CV), M-03 (landscape menu clipping), and L-01 (CSS arrow in heading name).

### L-01 — CSS-generated `↗` is included in the project heading’s accessible name

- **Type:** Confirmed defect
- **Severity:** Low
- **Location:** `src/index.css:823–829` — `.project--external .project__title::after { content: '↗'; }`; the heading is rendered by `src/components/ProjectCard.tsx:27`.
- **Evidence:** The Chromium accessibility tree reports the heading name as **“Ceylon Pathways ↗”**. The arrow is generated content on the H3, so assistive technology includes it in the heading text.
- **User impact:** Screen-reader users hear an unnecessary arrow character in the project heading. It is minor noise, but it makes the heading name less clean for navigation.
- **Recommended resolution:** Replace the pseudo-element arrow with a real `<span aria-hidden="true">↗</span>` inside the heading, or use CSS `content: '↗' / '';` (generated-content alt text) with a fallback. Verify the accessibility tree reports “Ceylon Pathways” only. The same pattern should be checked on any other CSS-generated decorative glyphs.

---

## 9. Performance

**Build and payload**

| Asset | Size |
|---|---|
| `dist` total | 1.6 MB / 23 files |
| JS `index-CYbRfRqs.js` | 303.93 kB (96.18 kB gzip) |
| CSS `index-CpuWIMhd.css` | 54.01 kB (26.78 kB gzip) |
| Fonts (4 woff2 loaded) | ~74 kB transfer |
| Profile image | 800/1200 WebP, 79.2/148.9 kB |
| Project images | 4 × 1600 px JPEG, 527.3 kB total transfer on mobile |
| `og.jpg` | 111.3 kB |
| `logo.png` | 10.6 kB |
| `cv.pdf` | 40.5 kB |

**Measured performance**

| Scenario | Result |
|---|---|
| Headed Chromium desktop, 1440 × 900 | ~112 fps; 3 initial long tasks (61, 72, 80 ms); LCP 224 ms (H1); CLS 0.0025 |
| WebKit desktop, 1440 × 900 | ~61 fps (display-refresh bound); 0 long tasks; LCP 341 ms (H1); CLS 0 |
| Chromium mobile, 390 × 844, DPR 3 | FCP 204 ms; LCP 204 ms; CLS 0 |
| Throttled mobile, slow 4G + 4× CPU | FCP/LCP 1,224 ms; CLS 0.003; 7 long tasks, max 376 ms; 10 resources |
| Reduced motion | 0 RAF over 2 s; static frame |
| Resource transfer | Desktop 811.7 kB; mobile 881.4 kB; throttled initial 593.6 kB |

**Interpretation**

- The site is fast on local desktop and WebKit. The throttled mobile LCP of 1.22 s is comfortably within the “good” Core Web Vitals threshold (≤ 2.5 s), and CLS is effectively zero.
- The main performance cost is the WebGL background: the throttled run shows several long tasks during startup and shader setup, including one 376 ms task. LCP still lands at 1.22 s, so this is not a current failure, but it is the largest main-thread cost on low-end devices.
- Project images are the largest network payload after the JS bundle. They are lazy-loaded, so they do not affect the initial LCP, but mobile users still download desktop-sized 1600 px JPEGs as they scroll.
- Headless Chromium’s software-WebGL numbers (≈26 fps, 56 long tasks) are not representative and were excluded from the conclusions.
- No layout-shift or rendering-stability problem was found.

### O-02 — Serve responsive project images

- **Type:** Optional improvement
- **Location:** `src/components/ProjectCard.tsx:8–15`; `public/assets/projects/*.jpg`.
- **Evidence:** Four 1600 px JPEGs (536 kB on disk; 527.3 kB transferred on mobile) with no `srcset` or `sizes`. `loading="lazy"` and `decoding="async"` are present, but every viewport receives the same 1600 px file.
- **User impact:** Mobile users download more image data than they need, increasing data use and decode cost on constrained devices. This is an optimization, not a current rendering failure.
- **Recommended resolution:** Generate 640/960/1600 AVIF or WebP variants, add `srcset`/`sizes` to `ProjectCard`, and keep a JPEG fallback. Verify the selected source at 360, 390, 768, 1440, and 1920 px.

### O-06 — Preload the most critical font files

- **Type:** Optional improvement
- **Location:** `src/main.tsx:3–6`; font assets under `dist/assets/`.
- **Evidence:** Four woff2 files (~74 kB total) are loaded via CSS imports; there is no `<link rel="preload" as="font">` in `index.html`. FCP is 204 ms locally and 1,224 ms under throttling.
- **User impact:** The first paint may wait briefly for font discovery. The current FCP is already good, so the benefit is marginal.
- **Recommended resolution:** Preload the one or two faces used above the fold (for example Space Grotesk 400/500 or Inter 400) with `crossorigin`, measure FCP/LCP before and after, and keep the CSS imports for the rest.

### O-07 — Reduce shader startup long tasks on low-end devices

- **Type:** Optional improvement
- **Location:** `src/components/SiteBackground.tsx`, `src/components/refracted-renderer.ts`, and the shader setup path.
- **Evidence:** Under slow 4G + 4× CPU throttling, the page produced 7 long tasks, with a maximum of 376 ms during startup/shader setup. Headed Chromium and WebKit do not show this cost at desktop performance.
- **User impact:** Brief main-thread stalls on low-end phones during load; LCP remains 1.22 s, so the current impact is limited.
- **Recommended resolution:** Defer non-critical shader compilation/initialization until after first paint or `requestIdleCallback`, reduce the initial shader program count or compile cost, and consider gating the animated background on device capability (`deviceMemory`, `hardwareConcurrency`) while keeping the static gradient fallback. Measure on a throttled mobile profile before and after. This is explicitly an optional optimization; no shader changes were made during the audit.

### O-05 — Remove or archive legacy hero assets

- **Type:** Optional improvement
- **Location:** `public/assets/hero/` — `heroVideo.mp4` 4.7 MB, `hero-2400.jpg` 380 kB, `hero-1200.jpg` 92 kB; pruned from `dist` by `scripts/prune-legacy-hero-assets.mjs`.
- **Evidence:** The files remain in `public/` (≈5.2 MB) but are removed from `dist` after build. The current Hero uses the procedural WebGL background and refracted wordmark.
- **User impact:** No runtime impact; repository clone/fetch size is larger than necessary.
- **Recommended resolution:** If the legacy hero media is no longer needed as source, archive or delete it after approval. Keep the prune script as a build guard until the source files are removed.

---

## 10. Production readiness

**Verified good**

- The existing production build in `dist` is complete: 23 files, 1.6 MB, with HTML, JS, CSS, fonts, images, CV, robots, and sitemap.
- Local preview serves the site and all assets with correct MIME types and HTTP 200.
- `vercel.json` uses `npm run build`, outputs `dist`, and sets a strict CSP plus `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and `Permissions-Policy`. Live responses also include HSTS.
- The live site returns 200 for `/`, `/assets/cv.pdf`, `/assets/og.jpg`, `/assets/logo.png`, `/robots.txt`, and `/sitemap.xml`.
- There are no rewrite/fallback rules in `vercel.json`; live unknown paths return 404. The local Vite preview’s SPA fallback returns `index.html` for unknown paths, so local 200 responses for nonexistent HTML files should not be read as production behavior.
- No secrets are present in the reviewed source, config, or public files. The only environment reference is `import.meta.env.BASE_URL`. No `.env*` files exist; `.gitignore` covers them.
- No hosting settings were changed during the audit.

**Release blockers / risks:** H-01 (stale production) and H-02 (diagnostic page). The Medium content and accessibility items should be fixed before or immediately after the next deploy.

**Deployment checklist after approval**

1. Resolve H-02: remove/move `public/webgl-diag.html`; delete or archive `webgl-diag2.html` and `src/webgl-diag2-entry.tsx`; rebuild; confirm `dist/` has no diagnostic HTML.
2. Fix M-01 and M-02 in `src/data/content.ts`.
3. Fix M-03, M-04, M-05, L-01, and L-02 as approved.
4. Stage files selectively — never `git add -A` while the diagnostic files are present.
5. Commit and push; let Vercel build from the commit.
6. Verify live HTML references the new JS/CSS hashes, the live CV hash is `ed7795…`, the live metadata matches, and `/webgl-diag.html` returns 404.
7. Re-run the viewport and interaction smoke checks against the live URL.

---

## 11. Critical / High / Medium / Low classification

### Critical

**None.**

### High

| ID | Type | Summary | Location |
|---|---|---|---|
| H-01 | Confirmed production-readiness defect | Live deployment is stale; current working-tree content and Stage 4 CV are not live. | Deployment state; compare live vs `dist/` |
| H-02 | Confirmed production-readiness risk | `public/webgl-diag.html` is copied to `dist` and would be published by a working-tree deploy; no `noindex`; robots allows all. | `public/webgl-diag.html`; `dist/webgl-diag.html`; `public/robots.txt` |

### Medium

| ID | Type | Summary | Location |
|---|---|---|---|
| M-01 | Confirmed content defect | Ceylon Pathways caption uses `ceylonpathways.vercel.app` (404) instead of `ceylon-pathways.vercel.app` (200). | `src/data/content.ts:61` |
| M-02 | Confirmed content defect | Nethwin caption claims `nethwinlk.com`, which has no DNS record. | `src/data/content.ts:102` |
| M-03 | Confirmed responsive defect | Mobile-landscape menu clips the Contact link; body cannot scroll. | `src/index.css:406–437` |
| M-04 | Confirmed accessibility risk | Hero second line is outline-only; no guaranteed contrast over bright shader regions. | `src/index.css:509–514`; `src/components/Hero.tsx:76–80` |
| M-05 | Confirmed accessibility defect | CV PDF is untagged (no structure tree, language, or reading order). | `public/assets/cv.pdf` |

### Low

| ID | Type | Summary | Location |
|---|---|---|---|
| L-01 | Confirmed accessibility defect | CSS-generated `↗` appears in the project heading accessible name (“Ceylon Pathways ↗”). | `src/index.css:823–829`; `src/components/ProjectCard.tsx:27` |
| L-02 | Confirmed content defect | `<noscript>` copy begins with stray `_pasindu`. | `index.html:48` |

### Optional improvements (no current failure)

| ID | Summary | Location |
|---|---|---|
| O-01 | Add Person/ProfilePage JSON-LD structured data. | `index.html` `<head>` |
| O-02 | Add responsive AVIF/WebP variants and `srcset`/`sizes` for project images. | `src/components/ProjectCard.tsx:8–15`; `public/assets/projects/*.jpg` |
| O-03 | Add `lastmod` to the sitemap. | `public/sitemap.xml` |
| O-04 | Provide a 180 × 180 Apple touch icon. | `index.html:44`; `public/assets/logo.png` |
| O-05 | Remove or archive the 5.2 MB legacy hero source assets (already pruned from `dist`). | `public/assets/hero/` |
| O-06 | Preload the most critical font files. | `src/main.tsx:3–6`; `index.html` |
| O-07 | Reduce shader startup long tasks on low-end devices. | `src/components/SiteBackground.tsx`; `src/components/refracted-renderer.ts` |
| O-08 | Add `twitter:site` / `twitter:creator` if accounts exist. | `index.html` Twitter meta block |

### Not issues (verified or disproven)

- `aria-current` is applied correctly at runtime and the active nav styling works.
- The headless Chromium bottom-edge white band is a capture artifact, not a site defect.
- LinkedIn HTTP 999 is a bot block, not a confirmed dead link.
- The accent `#1670BB` at 2.64:1 is used for decorative icons/borders, not text; it is not a text-contrast failure.
- No empty accessible names, duplicate IDs, skipped heading levels, or sub-24 px targets were found.
- No horizontal overflow, console errors, page errors, failed requests, or HTTP ≥ 400 were found in the local audit.
- `og.jpg` is genuinely 1200 × 630, matching its metadata.

---

## 12. Prioritized fixes

**P0 — before the next production deploy**

1. **H-02** — Remove/move `public/webgl-diag.html`; delete or archive `webgl-diag2.html` and `src/webgl-diag2-entry.tsx`; rebuild and confirm `dist/` contains no `webgl-diag*.html`. Stage files selectively.
2. **H-01** — After approval, commit the intended working-tree changes and deploy. Verify the live JS/CSS hashes, metadata, and CV hash (`ed7795…`). Do not deploy the diagnostic files.

**P1 — content correctness**

3. **M-01** — Change the Ceylon Pathways caption to `ceylon-pathways.vercel.app — live site` (or link it to the working URL).
4. **M-02** — Replace the Nethwin caption’s `nethwinlk.com` claim with a non-URL descriptor or a confirmed live URL.

**P2 — responsive and accessibility**

5. **M-03** — Make the mobile-landscape menu scrollable and add a short-height layout; verify 844 × 390 and 740 × 360.
6. **M-04** — Give the hero’s second line a guaranteed-contrast fill or localized scrim; verify across shader states and reduced motion.
7. **M-05** — Export a tagged, one-page A4 CV with headings, reading order, language, and links; verify text extraction and the served hash. Add an accessible HTML CV fallback if tagging is not possible.
8. **L-01** — Move the external-link arrow out of the heading’s accessible name (real `aria-hidden` span or generated-content alt text).
9. **L-02** — Fix the `<noscript>` opening line.

**P3 — optional improvements**

10. **O-02** — Responsive project images (`srcset`/`sizes`, AVIF/WebP).
11. **O-01** — Person/ProfilePage JSON-LD.
12. **O-06** — Preload critical font files; measure FCP/LCP.
13. **O-07** — Defer/reduce shader startup work on low-end devices; measure throttled mobile.
14. **O-03** — Sitemap `lastmod`.
15. **O-04** — 180 × 180 Apple touch icon.
16. **O-05** — Archive/delete legacy hero source assets.
17. **O-08** — Twitter site/creator attribution if applicable.

**Verification after fixes**

- Re-run Chromium and WebKit at all eight viewports; confirm no overflow, no console errors, and no failed requests.
- Re-run the interaction suite: skip link, desktop nav, mobile menu open/Escape/focus trap/restore, disclosures, reduced motion, CV download.
- Re-check the accessibility tree for heading names, empty names, landmarks, and target sizes.
- Re-check the live deployment hashes and CV hash after deploy.
- Re-run throttled mobile performance if O-02/O-06/O-07 are implemented.

---

## 13. Final Git status

**Final status at the end of the read-only audit (including this report):**

```
## main...origin/main
 M "assets/cv/Pasindu Lochana.pdf"
 M index.html
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
?? public/webgl-diag.html
?? src/components/useMediaQuery.ts
?? src/webgl-diag2-entry.tsx
?? webgl-diag2.html
```

- **Staged:** none.
- **Stashes:** none.
- **HEAD:** `470421a911936b9a27f4c2c7b8b39b9ac009c292`.
- **Commits / pushes / deploys / resets / reverts / restores / cleans during Stage 5:** none.
- **`.gitignore` changes:** none.
- **CV changes during Stage 5:** none.
- **`SiteBackground.tsx`, `refracted-renderer.ts`, or shader file changes during Stage 5:** none. The working-tree modifications to those files predate Stage 5 and were preserved.
- **Application edits during Stage 5:** none.
- **New file from this audit:** `STAGE-5-FINAL-AUDIT-REPORT.md` (this report), untracked.

**Working-tree preservation:** all pre-existing modifications, deletions, and untracked files remain exactly as found. Nothing was staged, committed, pushed, deployed, reset, reverted, restored, or cleaned.

---

**Stop point:** This is the end of the read-only Stage 5 audit. No fixes have been applied. Awaiting approval before making any changes, staging files, committing, pushing, or deploying.
