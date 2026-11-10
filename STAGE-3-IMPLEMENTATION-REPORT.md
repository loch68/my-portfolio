# LOCH Portfolio — Stage 3 Implementation Report

**Date:** 2026-11-07
**Repository:** `/Users/lochgraphy/Documents/Desktop/my-portfolio`
**Branch / HEAD:** `main` / `470421a911936b9a27f4c2c7b8b39b9ac009c292` (`Fix solid LOCH wordmark rendering on iOS Safari`)
**Verification build:** `http://localhost:4173/`
**Status:** Stage 3 implemented and verified. Nothing was committed, pushed, or deployed.

This was a focused enhancement to the mobile Hero and Education sections. No unrelated sections, content, navigation, services, contact details, footer content, shaders, WebGL architecture, LOCH wordmark, or black-hole framing were changed by this stage.

---

## 1. Baseline Git state

The baseline inspection was performed before any Stage 3 edit.

- Repository root: `/Users/lochgraphy/Documents/Desktop/my-portfolio`
- Branch: `main`
- HEAD: `470421a911936b9a27f4c2c7b8b39b9ac009c292`
- HEAD subject: `Fix solid LOCH wordmark rendering on iOS Safari`

Baseline `git status --short`:

```text
 M index.html
 D src/components/CountUp.tsx
 M src/components/Hero.tsx
 D src/components/LoadingIndicator.tsx
 M src/components/Nav.tsx
 M src/components/ProjectCard.tsx
 M src/components/Sections.tsx
 M src/components/ServiceCard.tsx
 M src/components/SiteBackground.tsx
 M src/components/refracted-renderer.ts
 M src/data/content.ts
 M src/index.css
?? PORTFOLIO-CONTENT-AUDIT.md
?? STAGE-2-IMPLEMENTATION-REPORT.md
?? public/webgl-diag.html
?? src/components/useMediaQuery.ts
?? src/webgl-diag2-entry.tsx
?? webgl-diag2.html
```

All of the above was preserved. `src/components/Reveal.tsx` was clean at baseline and is the only additional tracked source file modified by Stage 3. The existing Stage 2 and pre-existing working-tree changes were not reset, reverted, restored, cleaned, or deleted.

`STAGE-2-IMPLEMENTATION-REPORT.md` was read before implementation. It confirms the Stage 2 content, responsive, and mobile work, and does not describe an Education timeline.

---

## 2. Did the Education timeline animation exist before implementation?

No.

At HEAD and in the Stage 2 working tree, Education was a divided list:

```tsx
<ol className="education-list">
  {EDUCATION.map((entry, i) => (
    <Reveal as="li" className="education-entry" styleDelay={i}>
      ...
    </Reveal>
  ))}
</ol>
```

The only animation was the shared one-shot `Reveal` opacity/vertical transition on each entry. There was no vertical timeline line, no timeline nodes, no timeline-specific CSS, and no Education-specific IntersectionObserver logic. The Stage 3 timeline was therefore added, not restored.

---

## 3. Exact files changed

| File | Change |
|---|---|
| `src/components/Hero.tsx` | Added the responsive mobile identity-strip markup while preserving the existing desktop sentence. |
| `src/components/Sections.tsx` | Made the Education list an observed `Reveal as="ol"` container and updated the explanatory comment. Education content and order are unchanged. |
| `src/components/Reveal.tsx` | Added the `observeOnly` option and `ol` support, plus a try/catch fallback that keeps content visible if the observer cannot be created or attached. Existing default behavior is unchanged. |
| `src/index.css` | Added the mobile Hero identity strip, its entrance keyframes, and reduced-motion handling. Added the Education rail, nodes, sequential reveal CSS, and reduced-motion handling. |
| `STAGE-3-IMPLEMENTATION-REPORT.md` | This report. |

Protected files were not modified by Stage 3:

- `src/components/refracted-renderer.ts`
- `src/components/SiteBackground.tsx`
- Existing shader code and WebGL rendering architecture

Those files remain modified from the pre-existing working tree, exactly as found.

---

## 4. Hero changes

### Desktop

The desktop composition is substantially unchanged. The existing sentence remains exactly:

> Web development, creative production, and hospitality support.

It is still rendered through `.hero__sub-copy` inside the existing `.hero__sub` paragraph. The new identity strip is `display: none` above the mobile breakpoint, so desktop retains the same wording, typography, spacing, CTAs, scroll cue, wordmark, and black-hole framing.

### Mobile

At `max-width: 720px`, the sentence is hidden and the same information is presented as a compact three-column identity strip:

- **Web Development**
- **Creative Production**
- **Hospitality**

The strip is part of the Hero composition rather than a separate card:

- a fine top hairline spans the strip;
- a short `2.4rem` accent segment sits on the hairline;
- fine vertical separators divide the three disciplines;
- labels use Space Grotesk, muted text, `0.7rem` to `0.72rem` sizing, and restrained `0.08em` tracking;
- label text is vertically centered within the full-height columns, so the single-line “Hospitality” balances the two-line first two columns;
- the strip has a `27rem` maximum width and no extra badges, cards, or paragraphs;
- mobile CTA spacing was increased to `2rem` below the strip.

At 360px the labels measure `11.2px`; at 390px they measure `11.31px`; at 402px and 430px they measure `11.52px`. No label overflowed its column at any tested width.

### Entrance transition

The strip uses a short CSS-only entrance:

```css
animation: hero-identity-in 0.65s cubic-bezier(0.22, 0.61, 0.36, 1) 0.9s both;
```

It moves from `opacity: 0` and `translateY(8px)` to fully visible and settled. The `0.9s` delay coordinates it with the existing LOCH wordmark lift. There is no continuous animation and no JavaScript animation loop.

With `prefers-reduced-motion: reduce`, the animation is removed and the strip is visible immediately.

---

## 5. Education timeline changes

All three institutions, qualifications, period labels, typography, content, and list order are unchanged.

The Education list is now an observed container:

```tsx
<Reveal as="ol" className="education-list" observeOnly>
```

`observeOnly` adds the one-shot `is-in` class without applying the shared fade/translate to the entire list. That class activates the rail.

### Timeline rail

- A `1px` vertical line is rendered with `.education-list::before`.
- It uses a subtle gradient from the accent border at the top, through the standard border color, to transparent at the bottom.
- It animates once from `scaleY(0)` to `scaleY(1)` over `1.15s` with a `0.05s` delay and `cubic-bezier(0.22, 0.61, 0.36, 1)`.
- `transform-origin` is the top center, so the line draws progressively downward as the list enters the viewport.
- The line is decorative and marked `pointer-events: none`.

### Timeline nodes

- Each entry has a `6px` accent square node rendered with `.education-entry::before`.
- Nodes sit on the rail and align vertically with the first meta line of each entry.
- Nodes animate from `opacity: 0` / `scale(0.4)` to fully visible / `scale(1)` over `0.45s`.
- Nodes receive sequential delays: `0s`, `0.16s`, and `0.32s`.
- Entries retain the existing `Reveal` opacity and vertical-position transition (`0.7s`, `translateY(22px)` to none), with the existing `90ms` stagger.

### Responsive alignment

- Desktop rail: `1.5rem` inset, line at `0.5rem`.
- Mobile rail: `1.1rem` inset, line at `0.375rem`.
- The list uses left padding for the rail, so the line and nodes never overlap text.
- The existing top border and entry dividers still span the list width, and the section heading remains aligned with the list edge.
- Mobile remains a single-column layout; desktop remains the existing two-column meta/content layout. The desktop content is inset by the rail width but the overall section dimensions and composition are preserved.

### One-shot behavior

The list and each entry use the existing `once` behavior. After an entry or the rail is revealed, the `is-in` class is not removed. Scrolling away and back does not restart or flicker the animation.

---

## 6. Mobile and desktop behaviour

### Mobile

- The identity strip replaces the sentence at `<= 720px` and is visible at 360, 390, 402, and 430px portrait widths.
- The strip is also visible at 667px landscape width, where it fits without overflow.
- The Education timeline uses the narrower `1.1rem` rail. The line and nodes remain aligned, and no line or node overlaps text.
- Education remains single-column with adequate spacing between entries.
- No horizontal overflow, text clipping, or item overflow was measured at 360 × 740, 390 × 844, 402 × 714, or 430 × 932.
- The primary CTA remained within the first viewport at all tested portrait sizes:
  - 360 × 740: CTA bottom `495px`
  - 390 × 844: CTA bottom `536px`
  - 402 × 714: CTA bottom `472px`
  - 430 × 932: CTA bottom `583px`

### Desktop

- The identity strip is hidden at 740px and 844px landscape widths and at 1440px and 1920px desktop widths. The original sentence is shown.
- The desktop Hero was compared before and after at 1440 × 900 and 1920 × 1080. The LOCH wordmark, heading, sub-copy, CTA, scroll cue, background, and composition are unchanged.
- Education remains two-column on desktop. The timeline rail is a restrained left-side addition; the section height and typography are preserved.
- No horizontal overflow or layout breakage was measured at 1440 × 900 or 1920 × 1080.

### Landscape

- 844 × 390 and 740 × 360 use the desktop sentence because they are wider than the 720px breakpoint. The Hero content extends below the first fold on these very short viewports, which is a pre-existing constraint; the page scrolls normally and no horizontal clipping occurs.
- 667 × 375 is below the 720px breakpoint, so the identity strip is shown. It fits without overflow. The Hero also extends below the first fold, consistent with the pre-existing short-landscape behavior.

### Console and network

At every tested viewport:

- console errors: `0`
- page errors: `0`
- failed network requests: `0`
- site background canvas present
- LOCH wordmark canvas present

---

## 7. Reduced-motion verification

Reduced motion was tested with Playwright WebKit at 390 × 844 and 1440 × 900 using `reducedMotion: 'reduce'`.

Verified computed values:

- Hero identity strip: `animation-name: none`, `opacity: 1`, `transform: none`.
- Education rail: `transform: matrix(1, 0, 0, 1, 0, 0)` (fully drawn), `transition-duration: 0.00001s`, `transition-delay: 0s`.
- All Education entries: `opacity: 1`, `transform: none`, `transition-delay: 0s`.
- All Education nodes: `opacity: 1`, fully scaled, `transition-delay: 0s`.

All information is visible immediately. Animation is not required to reveal content.

### Observer-failure fallback

`Reveal` now:

1. adds `is-in` immediately when `IntersectionObserver` is unavailable;
2. catches a failed observer construction or attachment and adds `is-in` immediately.

This was tested by deleting `window.IntersectionObserver` before page load. Result:

- `24 / 24` reveal elements received `is-in`;
- `0` reveal elements remained at `opacity: 0`;
- the Education list received `is-in`;
- the rail was visible;
- all entries and nodes were visible.

If JavaScript is fully disabled, the site’s existing `<noscript>` summary remains the only content fallback because the application is client-rendered. That is a pre-existing architecture constraint, not introduced by Stage 3.

---

## 8. Performance considerations

- No new dependencies or animation libraries.
- No additional WebGL systems, particles, or shader changes.
- No continuously running JavaScript animation loops.
- No new global event listeners.
- No unnecessary React re-renders were added. `Reveal` continues to toggle a class through the existing observer pattern.
- One additional `IntersectionObserver` observes the Education list for the rail. The existing per-entry observers continue to handle entry reveals. Observers disconnect on unmount, and the one-shot observers unobserve after revealing.
- Animations use `opacity` and `transform` only:
  - Hero strip: `opacity` + `translateY`
  - Timeline rail: `scaleY`
  - Timeline nodes: `opacity` + `scale`
  - Entries: existing `opacity` + `translateY`
- No layout dimensions, blur filters, or large shadows are animated.
- No additional large assets were loaded.
- The strip is CSS-only; it does not depend on JavaScript or the shader.
- The timeline rail and nodes are CSS pseudo-elements, so no extra DOM nodes were added for them.

---

## 9. Before-and-after screenshot paths

All screenshots were captured with Playwright WebKit from the production build at `http://localhost:4173/`.

**Before:** `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage3/before/`

**After:** `/private/var/folders/p2/r8l3qxkj3s51g8_4mqd_kk4r0000gn/T/opencode/stage3/after/`

Required viewport screenshots exist in both directories:

| Viewport | Hero | Education | Education bottom |
|---|---|---|---|
| 360 × 740 | `360x740-hero.png` | `360x740-education.png` | `360x740-education-bottom.png` |
| 390 × 844 | `390x844-hero.png` | `390x844-education.png` | `390x844-education-bottom.png` |
| 402 × 714 | `402x714-hero.png` | `402x714-education.png` | `402x714-education-bottom.png` |
| 430 × 932 | `430x932-hero.png` | `430x932-education.png` | `430x932-education-bottom.png` |
| 844 × 390 landscape | `844x390-landscape-hero.png` | `844x390-landscape-education.png` | `844x390-landscape-education-bottom.png` |
| 740 × 360 landscape | `740x360-landscape-hero.png` | `740x360-landscape-education.png` | `740x360-landscape-education-bottom.png` |
| 1440 × 900 | `1440x900-hero.png` | `1440x900-education.png` | `1440x900-education-bottom.png` |
| 1920 × 1080 | `1920x1080-hero.png` | `1920x1080-education.png` | `1920x1080-education-bottom.png` |

Additional after-only evidence:

- `667x375-landscape-hero.png` (extra landscape check)
- `667x375-landscape-education.png`
- `667x375-landscape-education-bottom.png`
- `390x844-hero-entrance.png` (mid-entrance strip)
- `390x844-education-mid-reveal.png`
- `390x844-education-final.png`
- `390x844-no-observer-education.png`
- `390x844-reduced-motion-education.png`
- `1440x900-reduced-motion-education.png`
- `390x844-full.png`
- `1440x900-full.png`

The before and after desktop Hero screenshots at 1440 × 900 and 1920 × 1080 were reviewed side by side. The composition, wordmark, background, heading, sentence, CTA, and scroll cue remain unchanged.

---

## 10. Build and TypeScript results

### `npm run build`

Passed.

```text
vite v7.3.7 building client environment for production...
✓ 49 modules transformed.
dist/assets/index-CpuWIMhd.css   54.01 kB │ gzip: 26.78 kB
dist/assets/index-CYbRfRqs.js   303.93 kB │ gzip: 96.18 kB
✓ built in 852ms
[prune] excluded assets/hero/heroVideo.mp4
[prune] excluded assets/hero/hero-1200.jpg
[prune] excluded assets/hero/hero-2400.jpg
[prune] removed empty dist/assets/hero
```

### `npx tsc -b --pretty false`

Passed with no output.

### `git diff --check`

Passed with no output.

---

## 11. Final Git status

```text
 M index.html
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
?? public/webgl-diag.html
?? src/components/useMediaQuery.ts
?? src/webgl-diag2-entry.tsx
?? webgl-diag2.html
```

Stage 3 source changes are limited to `Hero.tsx`, `Sections.tsx`, `Reveal.tsx`, and `index.css`. All earlier working-tree changes and untracked diagnostics were preserved.

No commit, push, deploy, reset, revert, restore, clean, or deletion was performed.

---

## 12. Remaining issues

1. **No physical-device verification was performed.** Verification used Playwright WebKit headlessly at the required viewport sizes. This report does not claim real iPhone, Android, or desktop-browser testing.

2. **Short landscape viewports remain dense.** At 740 × 360 and 844 × 390, the Hero uses the desktop sentence and extends below the first fold; at 667 × 375 the identity strip is shown and also extends below the first fold. The page scrolls normally and there is no horizontal overflow or clipping, but the fixed navigation sits close to the top hero content. This is a pre-existing short-landscape constraint and was not changed as part of the focused Stage 3 scope.

3. **The Education timeline is presentational.** The available labels describe milestone types, not supported dates. The list order is unchanged and the rail does not add or imply chronological dates.

4. **Client-rendered no-JavaScript fallback is limited to the existing `<noscript>` summary.** With `IntersectionObserver` unavailable or failing, the new fallback keeps all rendered content visible. Full content without JavaScript remains dependent on the existing client-rendered architecture.

5. **No other regressions were observed.** The LOCH wordmark, black-hole background, protected renderer/background files, desktop Hero, navigation, projects, about, services, contact, and footer were not modified by Stage 3.
