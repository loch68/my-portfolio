# Stage 6B — M-06 Short-Viewport Collision Fix

**Status:** Complete — awaiting approval
**Date:** 10 November 2026
**Repository:** `/Users/lochgraphy/Documents/Desktop/my-portfolio`
**Branch:** `main`
**HEAD:** `470421a911936b9a27f4c2c7b8b39b9ac009c292`
**Remote:** `origin/main` at the same commit
**Scope:** Resolve the M-06 collision between the fixed navigation wordmark and the hero eyebrow, verify the required browser/viewport matrix, and report. No release activity was performed.

## 1. Original reproduction evidence

The Stage 6B baseline was captured before any source edit.

- Repository root: `/Users/lochgraphy/Documents/Desktop/my-portfolio`
- Branch: `main`; HEAD: `470421a911936b9a27f4c2c7b8b39b9ac009c292`; `origin/main` equal.
- Working tree: 16 tracked changes (14 modified, 2 deleted) and 12 untracked paths; nothing staged; no stashes. Baseline diff stat: 16 files, 765 insertions, 406 deletions.
- Preview server: `http://localhost:4173/` returned HTTP 200.

### 390 × 390 reproduction

| Element | Chromium rect (px) | WebKit rect (px) |
|---|---:|---:|
| `.nav` | top 0, bottom 76 | top 0, bottom 76 |
| `.nav__brand` | top 25, bottom 51 | top 25, bottom 51 |
| `.nav__wordmark` | top 26.1, bottom 49.9 | top 26.1, bottom 49.9 |
| `.hero__eyebrow` | top 32, bottom 70 | top 32, bottom 70 |
| `.hero` | top 0, bottom 466.8 | top 0, bottom 466.2 |
| `.hero__content` | top 0, bottom 466.8 | top 0, bottom 466.2 |
| `.hero__mark` | top 87.6, bottom 149.7 | top 87.6, bottom 149.1 |
| `.hero__statement` | top 167.3, bottom 224.0 | top 166.7, bottom 223.4 |
| `.hero__sub` | top 238.3, bottom 286.9 | top 237.8, bottom 286.2 |
| `.hero .editorial-link` | top 321.9, bottom 347.2 | top 321.3, bottom 346.6 |

The wordmark/eyebrow intersection was **116.4 × 17.9 px = 2,083.6 px²** in both Chromium and WebKit. The eyebrow occupied `y=32–70`, entirely inside the fixed navigation band (`y=0–76`) and overlapping the wordmark glyph band (`y=26.1–49.9`).

Computed styles at 390 × 390 before the fix:

- `.nav`: `position: fixed`, height `76px`, padding `16px`.
- `.hero`: `min-height: 390px`, `padding-top: 0`, `align-items: center`.
- `.hero__content`: `padding-top: 32px`, `padding-bottom: 32px`.
- `.hero__eyebrow`: `font-size: 11.52px`, `line-height: 19.008px`.

### Additional baseline finding: 740 × 360

Stage 6A did not include 740 × 360. Stage 6B measured the same collision there:

- Eyebrow: `y=44.4–63.4`; wordmark: `y=26.1–49.9`.
- Intersection: **116.4 × 5.5 px = 640.2 px²** in both Chromium and WebKit.
- Hero height: `492.2px` (Chromium), `491.2px` (WebKit).

At 844 × 390 there was no wordmark glyph collision (eyebrow `y=50.6–69.6`), but the eyebrow was still inside the navigation band and the brand line box overlapped it by `0.4px`. The fix clears that proximity as well.

Visual evidence was captured at:

- `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage6b-before/`
- `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage6b-after/`

## 2. Root cause

`.hero` is a flex container with `min-height: 100svh`, `align-items: center`, and no navigation-aware top offset. `min-height` is only a floor: when `.hero__content` is taller than the viewport, the hero grows to the content height and the content begins at the top of the section rather than being centered below the fixed nav.

At 390 × 390 the hero content is `466.8px` tall because the mobile identity strip and hero stack exceed the viewport. The fixed `.nav` is `76px` tall and overlays the first 76 px of the document. The eyebrow begins at the content's own `32px` top padding, placing it at `y=32–70` — inside the nav band and across the wordmark glyphs. The same mechanism produced the 740 × 360 overlap.

At 844 × 390 the content's larger `50.6px` top padding placed the eyebrow at `y=50.6`, just below the wordmark but still inside the nav band. No typography, markup, or shader defect was involved.

## 3. Exact implementation

Added one short-viewport rule immediately after the base `.hero` rule in `src/index.css`:

```css
/* On short viewports the hero content is taller than the section, so flex
   centering starts it at the top where the fixed navigation covers the
   eyebrow. Offset the hero by the navigation height so the content always
   clears the nav; the content's own padding keeps a readable gap below it. */
@media (max-width: 900px) and (max-height: 540px) {
  .hero {
    padding-top: calc(4.75rem + env(safe-area-inset-top, 0px));
  }
}
```

Rationale:

- `4.75rem` equals the `76px` navigation height at the default root size. The hero's own content padding (`32px` at 390 width) then places the eyebrow at `y=108`, giving a `32px` gap below the nav.
- `env(safe-area-inset-top, 0px)` preserves safe-area behaviour on notched devices.
- The query applies only to mobile-width, short-height viewports. Desktop, tablet portrait, and standard phone heights are unchanged.
- A height sweep across widths 320–844 showed wordmark/eyebrow collisions up to roughly `520px`; `540px` adds a 20 px safety margin for font and rendering variance while remaining narrowly scoped.
- No markup, typography, navigation, background, shader, content, or CV changes were made.

## 4. Files changed

- `src/index.css` — added 10 lines: one short-viewport `.hero` padding rule and its explanatory comment. This is the only source change.
- `STAGE-6B-IMPLEMENTATION-REPORT.md` — this new report.

No Stage 6B changes were made to `.gitignore`, either CV, `SiteBackground.tsx`, `refracted-renderer.ts`, shader files, or any other protected path. All pre-existing working-tree changes were preserved. Nothing was staged, committed, pushed, deployed, reset, reverted, restored, cleaned, moved, renamed, or deleted.

## 5. Before/after element geometry

### 390 × 390 detail

| Element | Before Chromium | After Chromium | Before WebKit | After WebKit |
|---|---:|---:|---:|---:|
| `.nav` | 0–76 | 0–76 | 0–76 | 0–76 |
| `.nav__brand` | 25–51 | 25–51 | 25–51 | 25–51 |
| `.nav__wordmark` | 26.1–49.9 | 26.1–49.9 | 26.1–49.9 | 26.1–49.9 |
| `.hero__eyebrow` | 32–70 | 108–146 | 32–70 | 108–146 |
| `.hero` | 0–466.8 | 0–542.8 | 0–466.2 | 0–542.2 |
| `.hero__content` | 0–466.8 | 76–542.8 | 0–466.2 | 76–542.2 |
| `.hero__mark` | 87.6–149.7 | 163.6–225.7 | 87.6–149.1 | 163.6–225.1 |
| `.hero__statement` | 167.3–224.0 | 243.3–300.0 | 166.7–223.4 | 242.7–299.4 |
| `.hero__sub` | 238.3–286.9 | 314.3–362.9 | 237.8–286.2 | 313.8–362.2 |
| `.hero .editorial-link` | 321.9–347.2 | 397.9–423.2 | 321.3–346.6 | 397.3–422.6 |
| Wordmark/eyebrow overlap | 116.4 × 17.9 (2,083.6 px²) | none | 116.4 × 17.9 (2,083.6 px²) | none |

Computed style changes at 390 × 390: `.hero` `padding-top` `0 → 76px`; `.hero__content` `padding-top` remains `32px`; eyebrow top `32 → 108`; hero height `466.8 → 542.8` (Chromium) and `466.2 → 542.2` (WebKit).

### All required viewports (Chromium values; WebKit differs by at most 1.2 px)

| Viewport | Eyebrow before | Eyebrow after | Overlap before | Overlap after | Gap after | Hero height before → after |
|---|---:|---:|---|---:|---:|---:|
| 360 × 740 | 157.3–195.3 | 157.3–195.3 | none | none | 107.4 | 740 → 740 |
| 390 × 844 | 220.6–258.6 | 220.6–258.6 | none | none | 170.7 | 844 → 844 |
| 390 × 390 | 32–70 | 108–146 | 17.9 px (2,083.6 px²) | none | 58.1 | 466.8 → 542.8 |
| 844 × 390 | 50.6–69.6 | 126.6–145.6 | none (brand line box 0.4 px) | none | 76.7 | 528 → 604 |
| 740 × 360 | 44.4–63.4 | 120.4–139.4 | 5.5 px (640.2 px²) | none | 70.5 | 492.2 → 568.2 |
| 1440 × 900 | 209.7–228.7 | 209.7–228.7 | none | none | 165.9 | 900 → 900 |
| 1920 × 1080 | 299.4–318.4 | 299.4–318.4 | none | none | 255.6 | 1080 → 1080 |

“Gap after” is the distance from the wordmark bottom to the eyebrow top. The 844 × 390 after-gap below the nav itself is `50.6px`; at 390 × 390 it is `32px`.

## 6. Chromium and WebKit results

All **14/14 runs** passed: 7 viewports × 2 engines.

| Engine | Runs | Wordmark/eyebrow overlap | Horizontal overflow | Console errors | Page errors | Failed requests | HTTP ≥ 400 |
|---|---:|---:|---:|---:|---:|---:|---:|
| Chromium | 7 | 0 | 0 | 0 | 0 | 0 | 0 |
| WebKit | 7 | 0 | 0 | 0 | 0 | 0 | 0 |

Interaction and navigation checks:

- Mobile (≤ 900 px): the toggle opens the overlay; `aria-expanded="true"`, `body.nav-open`, `main[inert]`, and first-link focus all set correctly.
- Focus trap: `Shift+Tab` from the first link wraps to the toggle; `Tab` returns to the first link.
- Escape closes the overlay, removes `body.nav-open` and `main[inert]`, and returns focus to the toggle.
- Menu link activation: `#about` closes the menu, updates the hash, and lands the section at approximately `80px` below the top (clearing the fixed nav).
- At 390 × 390 and 740 × 360, all five menu links fit within the viewport; the overlay's `scrollHeight` equals its `clientHeight` (390 and 360 respectively). No horizontal overflow occurs with the menu open.
- At 390 × 390 and 740 × 360, scrolling to `y=600` leaves the nav at `top: 0` with `position: fixed`, `is-scrolled`, and the toggle visible.
- Desktop: nav remains fixed at `top: 0` after scrolling; `is-scrolled` is set; the active link updates; clicking `#about` lands at `79.6–80.5px` and updates `aria-current`. The mobile toggle is correctly hidden.
- No horizontal overflow at any viewport or in the menu-open state.

Background and LOCH wordmark checks:

- `.site-bg__canvas` exists in every run with a live WebGL context; its CSS size matches the viewport, with backing sizes such as `488 × 488` at 390 × 390, `1055 × 488` at 844 × 390, and `2160 × 1350` at 1440 × 900.
- `.hero__mark canvas` exists in every run with a live WebGL context, a nonzero backing size, and `aria-label="LOCH"`.
- No source changes were made by Stage 6B to `SiteBackground.tsx`, `refracted-renderer.ts`, or shader files; the black-hole background and LOCH wordmark are intact.

CV check:

- `/assets/cv.pdf` returned HTTP 200 in both engines, `58,030` bytes, SHA-256 `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3`.

## 7. Responsive regression results

| Viewport | Eyebrow top after (Chromium / WebKit) | Wordmark overlap | Horizontal overflow | Runtime errors | Nav/menu |
|---|---:|---|---:|---:|---|
| 360 × 740 | 157.3 / 157.5 | none | no | 0 | pass |
| 390 × 844 | 220.6 / 220.9 | none | no | 0 | pass |
| 390 × 390 | 108.0 / 108.0 | none | no | 0 | pass |
| 844 × 390 | 126.6 / 126.6 | none | no | 0 | pass |
| 740 × 360 | 120.4 / 120.4 | none | no | 0 | pass |
| 1440 × 900 | 209.7 / 210.0 | none | no | 0 | pass |
| 1920 × 1080 | 299.4 / 299.4 | none | no | 0 | pass |

Hero visibility and readability:

- The eyebrow, LOCH mark, statement, sub-copy, CTA, and scroll cue are all visible (nonzero rect, not `display:none`, not `visibility:hidden`, opacity above threshold) at every required viewport.
- At 360 × 740 and 390 × 844 the hero still fits the initial viewport and is visually unchanged.
- On short viewports the hero grows taller than the viewport (`542.8px` at 390 × 390, `568.2px` at 740 × 360, `604px` at 844 × 390), so lower hero elements are reached by scrolling. No content is hidden or clipped: the hero grows with its content and the content bottom matches the hero bottom.
- At 390 × 390 the CTA is at `397.9–423.2`, just below the initial 390 px fold. This is the expected trade-off of clearing the fixed nav without shrinking the established hero typography or composition.

No horizontal scrolling, clipping, background regression, or LOCH wordmark regression was observed in Chromium or WebKit.

## 8. Build and TypeScript results

- `npm run build` — exit 0. Vite 7.3.7 built 49 modules; CSS `dist/assets/index-CqdhSsoy.css` (54.59 kB), JS `dist/assets/index-BNoChCU3.js` (304.05 kB). The post-build prune excluded legacy hero assets and `webgl-diag.html`.
- `npx tsc -b --pretty false` — exit 0, no output.
- `git diff --check` — exit 0, no whitespace errors.
- `dist` — 22 files, 1.7 MB. No `*webgl-diag*` or `*diag*` files remain; `dist/index.html` references only `index-CqdhSsoy.css` and `index-BNoChCU3.js`.
- CV integrity — `public/assets/cv.pdf` and `dist/assets/cv.pdf` are both `58,030` bytes with SHA-256 `e19f60cf45a4a85cc73e314adc80953c509365f3915f9775889da9dafeb100b3`. The tracked source CV `assets/cv/Pasindu Lochana.pdf` is `110,698` bytes with SHA-256 `be1c19b1e057f18b97a3b3bbbff2bdf7f613fd64f9ea6c01c8ef3d43a7a8d346`. Both are unchanged from the Stage 6B baseline.

## 9. Final Git status

- Branch `main`, HEAD `470421a911936b9a27f4c2c7b8b39b9ac009c292`; `origin/main` equal.
- 16 tracked changed paths (14 modified, 2 deleted), unchanged from the Stage 6B baseline.
- 13 untracked paths: the 12 baseline untracked paths plus `STAGE-6B-IMPLEMENTATION-REPORT.md`.
- Nothing staged; no stashes.
- `git diff --stat`: 16 files, 775 insertions(+), 406 deletions(-). The baseline was 765 insertions / 406 deletions; the only delta is the 10-line addition in `src/index.css`.
- Only source change relative to the Stage 6B baseline: `src/index.css`. The protected files were not modified by Stage 6B. `dist/` remains gitignored and is not staged.
- No commit, push, deploy, reset, revert, restore, clean, move, rename, or delete was performed.

## 10. Remaining issues and release recommendation

**Remaining issues:** none blocking. M-06 is resolved at 390 × 390 and at the newly tested 740 × 360; the 844 × 390 brand-line proximity is also cleared. No new console errors, page errors, failed requests, HTTP errors, horizontal overflow, or background/wordmark regressions were found.

**Accepted trade-off:** on short viewports the hero now grows to clear the fixed nav, so the CTA and scroll cue sit below the initial fold at 390 × 390, 740 × 360, and 844 × 390. They remain fully visible and reachable by scrolling, and no content is clipped. This avoids shrinking the approved hero typography or changing its composition.

**Release recommendation:** **READY FOR RELEASE**, pending approval. The Stage 6A M-06 condition is satisfied, and the Stage 6B working tree remains uncommitted and unstaged. No release or deployment action has been taken.
