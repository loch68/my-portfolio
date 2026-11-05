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

import { useEffect, useRef, useState, type CSSProperties, type HTMLAttributes } from 'react';
import {
  createRefractedRenderer,
  type RefractedLiftEase,
  type RefractedRenderer,
} from './refracted-renderer';
import './refracted-text.css';

export type RefractedTextProps = Omit<HTMLAttributes<HTMLSpanElement>, 'children'> & {
  /** Typography edits are applied after 350ms of inactivity; the initial text renders immediately. */
  text: string;
  /** Dark by default, independently of the site. Choose light explicitly, or auto to follow the site. */
  theme?: 'auto' | 'light' | 'dark';
  /** CSS color for the upper glass. "auto" keeps the theme's original palette. */
  topColor?: string;
  /** CSS color for the lower glass. "auto" keeps the theme's original palette. */
  bottomColor?: string;
  /** CSS color for the refracted beam. "auto" preserves the original spectral light. */
  beamColor?: string;
  /** CSS color for spectral ray 1. "auto" keeps the beam's palette. */
  spectrumWarmColor?: string;
  /** CSS color for spectral ray 2. "auto" keeps the beam's palette. */
  spectrumMiddleColor?: string;
  /** CSS color for spectral ray 3. "auto" keeps the beam's palette. */
  spectrumCoolColor?: string;
  /** Lift the characters into place. Enabled by default. */
  reveal?: boolean;
  /** Total delay in seconds between the first and last character, from 0 to 1. */
  stagger?: number;
  /** Total time in seconds from the first rising character to the last character settling. */
  liftDuration?: number;
  /** Easing for the upward character lift. Does not alter the shader flow. */
  ease?: RefractedLiftEase;
  /** Move the beam with each rising letter. By default the beam stays in canvas space. */
  beamFollowsLift?: boolean;
  /** Set false to show the beam at its settled state while the character lift can still play. */
  animateBeam?: boolean;
  /** Length of the opening light pass. The lifted beam eases to a stop afterward. */
  openingDuration?: number;
  duration?: number;
  intensity?: number;
  /** Spectral coverage, from 0 to 3. One preserves the original glass; higher values widen its existing colors without boosting saturation. */
  dispersion?: number;
  /** Strength of the spectral colors, from 0 to 2, independent of white light. */
  colorIntensity?: number;
  /** Height of the fixed beam, equivalent to the cursor's vertical position. */
  beamPosition?: number;
  /** Hold the beam at beamPosition until the cursor steers it. */
  fixedBeam?: boolean;
  paused?: boolean;
  /** The cursor bends the beam locally by default. Enable this to steer the whole beam. */
  cursorMovesBeam?: boolean;
  fontSize?: CSSProperties['fontSize'];
  /** Defaults to the bundled Square Display face with a squarer uppercase O. */
  fontFamily?: CSSProperties['fontFamily'];
  fontWeight?: CSSProperties['fontWeight'];
  letterSpacing?: CSSProperties['letterSpacing'];
  /** Added outline weight as a percentage of cap height, from 0 to 6. Keeps angular joins. */
  extraBold?: number;
  /** Height of the lettering as a percentage, from 40 to 100. */
  fontHeight?: number;
  /** Independent corner softness as a percentage of cap height, from 0 to 8. */
  cornerRounding?: number;
};

type OpticalStyle = CSSProperties & { '--refracted-width': string };

function stillFrameTime(duration: number) {
  return duration * 0.35;
}

export function RefractedText({
  text,
  theme = 'dark',
  topColor = 'auto',
  bottomColor = 'auto',
  beamColor = 'auto',
  spectrumWarmColor = 'auto',
  spectrumMiddleColor = 'auto',
  spectrumCoolColor = 'auto',
  reveal = true,
  stagger = 0.55,
  liftDuration = 1.75,
  ease = 'power4.out',
  beamFollowsLift = false,
  animateBeam = true,
  openingDuration = 6.9,
  duration = 13.2,
  intensity = 1.2,
  dispersion = 1,
  colorIntensity = 1,
  beamPosition = 0.5,
  fixedBeam = false,
  paused = false,
  cursorMovesBeam = false,
  fontSize = '400px',
  fontFamily = "'ReactDrops Square Display', 'Arial Black', sans-serif",
  fontWeight = 900,
  letterSpacing = 'normal',
  extraBold = 2.25,
  fontHeight = 80,
  cornerRounding = 1,
  className = '',
  style,
  ...props
}: RefractedTextProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<RefractedRenderer | null>(null);
  const requestRender = useRef(() => {});
  // Keep the current canvas while typing. Only the settled typography incurs
  // font loading and glyph rasterization. The WebGL program stays alive.
  const [typography, setTypography] = useState({
    text,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    extraBold,
    fontHeight,
    cornerRounding,
  });
  useEffect(() => {
    if (
      text === typography.text &&
      fontSize === typography.fontSize &&
      fontFamily === typography.fontFamily &&
      fontWeight === typography.fontWeight &&
      letterSpacing === typography.letterSpacing &&
      extraBold === typography.extraBold &&
      fontHeight === typography.fontHeight &&
      cornerRounding === typography.cornerRounding
    )
      return;
    const timeout = window.setTimeout(() => {
      setTypography({
        text,
        fontSize,
        fontFamily,
        fontWeight,
        letterSpacing,
        extraBold,
        fontHeight,
        cornerRounding,
      });
    }, 350);
    return () => window.clearTimeout(timeout);
  }, [
    text,
    fontSize,
    fontFamily,
    fontWeight,
    letterSpacing,
    extraBold,
    fontHeight,
    cornerRounding,
    typography,
  ]);
  const options = useRef({
    theme,
    topColor,
    bottomColor,
    beamColor,
    spectrumWarmColor,
    spectrumMiddleColor,
    spectrumCoolColor,
    reveal,
    stagger,
    liftDuration,
    ease,
    beamFollowsLift,
    animateBeam,
    openingDuration,
    duration,
    intensity,
    dispersion,
    colorIntensity,
    beamPosition,
    fixedBeam,
    paused,
    cursorMovesBeam,
  });
  const [failed, setFailed] = useState(false);
  options.current = {
    theme,
    topColor,
    bottomColor,
    beamColor,
    spectrumWarmColor,
    spectrumMiddleColor,
    spectrumCoolColor,
    reveal,
    stagger,
    liftDuration,
    ease,
    beamFollowsLift,
    animateBeam,
    openingDuration,
    duration,
    intensity,
    dispersion,
    colorIntensity,
    beamPosition,
    fixedBeam,
    paused,
    cursorMovesBeam,
  };
  const letters = Array.from(typography.text);
  const virtualWidth = Math.max(1, letters.length * 394);
  const opticalStyle: OpticalStyle = {
    ...style,
    fontSize: typography.fontSize,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeight,
    letterSpacing: typography.letterSpacing,
    aspectRatio: `${virtualWidth} / 318`,
    '--refracted-width': `${letters.length * 1.28}em`,
  };

  useEffect(() => {
    const { text, fontFamily, fontWeight, letterSpacing, extraBold, fontHeight, cornerRounding } =
      typography;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const host = canvas.parentElement;
    const renderer =
      rendererRef.current ??
      createRefractedRenderer(
        canvas,
        text,
        String(fontFamily),
        fontWeight,
        String(letterSpacing),
        extraBold,
        cornerRounding,
      );
    if (!renderer) {
      setFailed(true);
      return;
    }
    if (rendererRef.current)
      renderer.setTypography(
        text,
        String(fontFamily),
        fontWeight,
        String(letterSpacing),
        extraBold,
        cornerRounding,
      );
    rendererRef.current = renderer;
    setFailed(false);
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const darkPreference = window.matchMedia('(prefers-color-scheme: dark)');
    const readAutoLightTheme = () => {
      const colorScheme = window.getComputedStyle(canvas).colorScheme.trim();
      if (colorScheme === 'light') return true;
      if (colorScheme === 'dark') return false;
      return !darkPreference.matches;
    };
    let autoLightTheme = readAutoLightTheme();
    let themeMix = theme === 'light' || (theme === 'auto' && autoLightTheme) ? 1 : 0;
    const syncTheme = () => {
      const next = readAutoLightTheme();
      if (next === autoLightTheme) return;
      autoLightTheme = next;
      if (options.current.theme === 'auto') syncPlayback();
    };
    // The site retains the outgoing page during its route reveal. Treat that
    // inert surface as suspended immediately, rather than waiting to unmount.
    const inactive = () => !!host?.closest('[inert], [aria-hidden="true"]');
    let suspended = inactive();
    const themeObserver = new MutationObserver(() => {
      const next = inactive();
      if (!next) syncTheme();
      if (next !== suspended) {
        suspended = next;
        if (!next) onResize();
        syncPlayback();
      }
    });
    for (
      let element: HTMLElement | null = canvas.parentElement;
      element;
      element = element.parentElement
    ) {
      themeObserver.observe(element, {
        attributes: true,
        attributeFilter: ['data-theme', 'class', 'style', 'inert', 'aria-hidden'],
      });
    }
    darkPreference.addEventListener('change', syncTheme);
    let frame = 0;
    let fontFrame = 0;
    let previous = 0;
    let elapsed = paused ? stillFrameTime(duration) : 0;
    let previousAnimateBeam = animateBeam;
    let revealElapsed = 0;
    let disposed = false;
    let inView = true;
    // Canvas text does not update when a web font swaps in. The glyph mask
    // must be created only after the face is ready, then rebuilt on later loads.
    let fontReady = !document.fonts;
    const pointer = {
      x: 0.5,
      y: 0.435,
      influence: 0,
      targetX: 0.5,
      targetY: 0.435,
      targetInfluence: 0,
    };
    let pointerClientX = 0;
    let pointerClientY = 0;
    let pointerDirty = false;
    const movePointer = (event: PointerEvent) => {
      pointerClientX = event.clientX;
      pointerClientY = event.clientY;
      pointerDirty = true;
      syncPlayback();
    };
    const leavePointer = () => {
      pointerDirty = false;
      pointer.targetInfluence = 0;
      syncPlayback();
    };
    host?.addEventListener('pointerenter', movePointer);
    host?.addEventListener('pointermove', movePointer);
    host?.addEventListener('pointerdown', movePointer);
    host?.addEventListener('pointerleave', leavePointer);
    const tick = (now: number) => {
      frame = 0;
      if (disposed || inactive() || !inView || document.hidden || !fontReady) return;
      // Pointer events can arrive faster than frames. Measure layout once for
      // the latest event, instead of forcing a rect read on every mouse move.
      if (pointerDirty) {
        pointerDirty = false;
        const rect = canvas.getBoundingClientRect();
        if (rect.width && rect.height) {
          pointer.targetX = Math.max(0, Math.min(1, (pointerClientX - rect.left) / rect.width));
          pointer.targetY = Math.max(0, Math.min(1, (pointerClientY - rect.top) / rect.height));
          pointer.targetInfluence = 1;
        }
      }
      const {
        theme,
        topColor,
        bottomColor,
        beamColor,
        spectrumWarmColor,
        spectrumMiddleColor,
        spectrumCoolColor,
        reveal,
        stagger,
        liftDuration,
        ease,
        beamFollowsLift,
        animateBeam,
        openingDuration,
        duration,
        intensity,
        dispersion,
        colorIntensity,
        beamPosition,
        fixedBeam,
        paused,
        cursorMovesBeam,
      } = options.current;
      const delta = previous ? Math.min(0.05, Math.max(0, (now - previous) / 1000)) : 1 / 60;
      if (animateBeam && !previousAnimateBeam) elapsed = paused ? stillFrameTime(duration) : 0;
      previousAnimateBeam = animateBeam;
      if (
        fontReady &&
        previous &&
        animateBeam &&
        !paused &&
        !motion.matches &&
        document.visibilityState === 'visible'
      ) {
        elapsed += delta;
      }
      if (fontReady && previous && !motion.matches && document.visibilityState === 'visible') {
        revealElapsed += delta;
      }
      previous = now;
      const follow = motion.matches ? 1 : 1 - Math.exp(-delta * 20);
      const fade = motion.matches
        ? 1
        : 1 - Math.exp(-delta * (pointer.targetInfluence > pointer.influence ? 16 : 8));
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      pointer.influence += (pointer.targetInfluence - pointer.influence) * fade;
      if (Math.abs(pointer.targetX - pointer.x) < 0.0001) pointer.x = pointer.targetX;
      if (Math.abs(pointer.targetY - pointer.y) < 0.0001) pointer.y = pointer.targetY;
      if (Math.abs(pointer.targetInfluence - pointer.influence) < 0.0001)
        pointer.influence = pointer.targetInfluence;
      const targetTheme = theme === 'light' || (theme === 'auto' && autoLightTheme) ? 1 : 0;
      themeMix += (targetTheme - themeMix) * (motion.matches ? 1 : 1 - Math.exp(-delta * 9));
      if (Math.abs(targetTheme - themeMix) < 0.0001) themeMix = targetTheme;
      // The beam shares one opening clock across the word. The character
      // stagger remains independent, and static text keeps its light cycle.
      const flowLength = Number.isFinite(openingDuration)
        ? Math.max(2.1, Math.min(12, openingDuration))
        : 4.9;
      const settledTime = flowLength;
      const lightTime = !animateBeam
        ? settledTime
        : motion.matches
          ? stillFrameTime(duration)
          : reveal
            ? Math.min(elapsed, settledTime)
            : elapsed;
      if (fontReady)
        renderer.render(
          lightTime,
          duration,
          openingDuration,
          intensity,
          beamPosition,
          fixedBeam,
          pointer.x,
          pointer.y,
          pointer.influence,
          cursorMovesBeam,
          themeMix,
          motion.matches || !reveal ? Infinity : revealElapsed,
          liftDuration,
          stagger,
          ease,
          beamFollowsLift,
          topColor,
          bottomColor,
          dispersion,
          colorIntensity,
          beamColor,
          spectrumWarmColor,
          spectrumMiddleColor,
          spectrumCoolColor,
        );
      const totalLiftDuration = Number.isFinite(liftDuration)
        ? Math.max(0.2, Math.min(5, liftDuration))
        : 1.75;
      const beamMoving = animateBeam && !paused && (!reveal || elapsed < settledTime);
      const lettersMoving = reveal && revealElapsed < totalLiftDuration;
      const pointerMoving =
        pointer.x !== pointer.targetX ||
        pointer.y !== pointer.targetY ||
        pointer.influence !== pointer.targetInfluence;
      if (
        (!motion.matches && (beamMoving || lettersMoving)) ||
        pointerMoving ||
        themeMix !== targetTheme
      )
        frame = window.requestAnimationFrame(tick);
      else previous = 0;
    };
    const syncPlayback = () => {
      if (disposed || inactive() || !inView || document.hidden || !fontReady) {
        window.clearTimeout(resizeTimer);
        window.cancelAnimationFrame(frame);
        frame = 0;
        previous = 0;
      } else if (!frame) frame = window.requestAnimationFrame(tick);
    };
    requestRender.current = syncPlayback;
    const viewport =
      typeof IntersectionObserver === 'undefined'
        ? null
        : new IntersectionObserver(([entry]) => {
            inView = entry.isIntersecting;
            syncPlayback();
          });
    viewport?.observe(canvas);
    document.addEventListener('visibilitychange', syncPlayback);
    motion.addEventListener('change', syncPlayback);
    // Match the font's natural proportions before applying the requested
    // height. The mask and pointer use this same rectangle, as in the studio.
    let layoutReady = false;
    const resize = (force = false) => {
      if (!disposed && !inactive() && fontReady) {
        if (host && (!layoutReady || force)) {
          const metrics = document.createElement('canvas').getContext('2d');
          if (metrics) {
            metrics.font = `${fontWeight} 342px ${fontFamily}`;
            metrics.fontKerning = 'normal';
            metrics.letterSpacing = String(letterSpacing);
            const run = metrics.measureText(text);
            const cap =
              Math.max(
                metrics.measureText('H').actualBoundingBoxAscent,
                run.actualBoundingBoxAscent,
              ) + Math.max(0, run.actualBoundingBoxDescent);
            const stroke =
              (cap * (Number.isFinite(extraBold) ? Math.max(0, Math.min(6, extraBold)) : 0)) / 100;
            const inkWidth = Math.max(
              1,
              run.actualBoundingBoxLeft + run.actualBoundingBoxRight + stroke * 2,
            );
            const height =
              ((((((virtualWidth - 60) * (cap + stroke * 2)) / inkWidth) * 318) / 278) *
                (Number.isFinite(fontHeight) ? Math.max(40, Math.min(100, fontHeight)) : 100)) /
              100;
            host.style.aspectRatio = `${virtualWidth} / ${Math.max(1, height)}`;
            layoutReady = true;
          }
        }
        observedSize = `${canvas.clientWidth}x${canvas.clientHeight}`;
        renderer.resize(force);
        syncPlayback();
      }
    };
    const families = String(fontFamily)
      .split(',')
      .map((family) =>
        family
          .trim()
          .replace(/^['"]|['"]$/g, '')
          .toLowerCase(),
      );
    const queueResize = (event: FontFaceSetLoadEvent) => {
      if (
        !event.fontfaces.some((face) =>
          families.includes(face.family.replace(/^['"]|['"]$/g, '').toLowerCase()),
        )
      )
        return;
      if (!fontReady) return;
      window.cancelAnimationFrame(fontFrame);
      fontFrame = window.requestAnimationFrame(() => resize(true));
    };
    // Rebuilding the glyph masks is synchronous CPU work (hundreds of ms on
    // large, high-DPR canvases). Coalesce bursts from layout transitions and
    // window resizing into one rebuild once the size settles; a pending
    // rebuild is dropped if the page navigates away first.
    let resizeTimer = 0;
    // The observer also reports the initial size, which resize() below
    // already applies; only a changed layout size schedules a rebuild.
    let observedSize = `${canvas.clientWidth}x${canvas.clientHeight}`;
    const onResize = () => {
      if (inactive()) return;
      const size = `${canvas.clientWidth}x${canvas.clientHeight}`;
      if (size === observedSize) return;
      observedSize = size;
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(() => resize(), 120);
    };
    const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(onResize);
    if (observer) observer.observe(canvas);
    else window.addEventListener('resize', onResize);
    // The first size is applied right away; only later changes are coalesced.
    resize();
    syncPlayback();
    if (document.fonts) {
      document.fonts.addEventListener('loadingdone', queueResize);
      void document.fonts
        .load(`${fontWeight} 342px ${fontFamily}`, text)
        .catch(() => [])
        .then(async () => {
          await document.fonts.ready;
          if (disposed) return;
          // FontFaceSet may resolve before the new face reaches Canvas 2D.
          // Rasterize on the next paint, after its font cache has updated.
          window.cancelAnimationFrame(fontFrame);
          fontFrame = window.requestAnimationFrame(() => {
            if (disposed) return;
            fontReady = true;
            resize(true);
            syncPlayback();
          });
        });
    }
    return () => {
      disposed = true;
      requestRender.current = () => {};
      window.cancelAnimationFrame(frame);
      window.cancelAnimationFrame(fontFrame);
      window.clearTimeout(resizeTimer);
      document.fonts?.removeEventListener('loadingdone', queueResize);
      observer?.disconnect();
      viewport?.disconnect();
      document.removeEventListener('visibilitychange', syncPlayback);
      motion.removeEventListener('change', syncPlayback);
      themeObserver.disconnect();
      darkPreference.removeEventListener('change', syncTheme);
      window.removeEventListener('resize', onResize);
      host?.removeEventListener('pointerenter', movePointer);
      host?.removeEventListener('pointermove', movePointer);
      host?.removeEventListener('pointerdown', movePointer);
      host?.removeEventListener('pointerleave', leavePointer);
    };
  }, [
    typography.text,
    typography.fontFamily,
    typography.fontWeight,
    typography.letterSpacing,
    typography.extraBold,
    typography.fontHeight,
    typography.cornerRounding,
  ]);

  useEffect(
    () => () => {
      rendererRef.current?.dispose();
      rendererRef.current = null;
    },
    [],
  );

  useEffect(() => {
    requestRender.current();
  }, [
    theme,
    topColor,
    bottomColor,
    beamColor,
    spectrumWarmColor,
    spectrumMiddleColor,
    spectrumCoolColor,
    reveal,
    stagger,
    liftDuration,
    ease,
    beamFollowsLift,
    animateBeam,
    openingDuration,
    duration,
    intensity,
    dispersion,
    colorIntensity,
    beamPosition,
    fixedBeam,
    paused,
    cursorMovesBeam,
  ]);

  return (
    <span
      {...props}
      role="img"
      aria-label={typography.text}
      className={`refracted-text${className ? ` ${className}` : ''}`}
      style={opticalStyle}
    >
      <canvas ref={canvasRef} aria-hidden="true" />
      {failed && (
        <span className="refracted-text__fallback" aria-hidden="true">
          {typography.text}
        </span>
      )}
    </span>
  );
}
