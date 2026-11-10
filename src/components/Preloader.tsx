import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Preloader — minimal, brand-first loading overlay shown only on the initial
 * page load.
 *
 * Choreography (all CSS, no libraries, no canvas/WebGL):
 *   1. Deep navy background (matches --color-background).
 *   2. LOCHGRAPHY wordmark slides up and fades in (Space Grotesk).
 *   3. A geometric accent line draws across.
 *   4. A subtle blue dot bloom / glow completes the look.
 *   5. Overlay fades out and the existing homepage is revealed.
 *
 * Loading behaviour:
 *   - Shown only on initial mount; unmounts once, never re-shows during SPA
 *     navigation.
 *   - Waits for `document.fonts.ready` (essential so the wordmark renders
 *     without FOUC). Does NOT wait for optional images/media.
 *   - No fake percentage counter, no artificial 2–3 s delay.
 *   - Safety timeout + global error listeners never trap a visitor.
 *   - Body scroll is locked while the overlay is genuinely active and restored
 *     on exit; the page stays usable if JavaScript errors.
 *   - Respects `prefers-reduced-motion` (instant reveal, fast fade).
 */

const SHOW_MIN_MS = 900;      // let the choreography be seen
const SAFETY_MS = 2500;       // fallback: never stuck
const FADE_MS = 700;          // overlay fade-out duration (matches CSS)

export function Preloader() {
  const [ready, setReady] = useState(false);
  const [done, setDone] = useState(false);
  const [exited, setExited] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current = [];
  }, []);

  // Essential readiness: fonts (so the wordmark doesn't FOUC) plus a safety
  // net. Optional images/media are intentionally not waited on.
  useEffect(() => {
    let resolved = false;
    const markReady = () => {
      if (!resolved) {
        resolved = true;
        setReady(true);
      }
    };

    const safety = setTimeout(markReady, SAFETY_MS);
    timers.current.push(safety);

    document.fonts.ready.then(markReady).catch(markReady);

    // Never trap the visitor if JavaScript fails.
    const onError = () => {
      markReady();
      setDone(true);
    };
    window.addEventListener('error', onError, { capture: true });
    window.addEventListener('unhandledrejection', onError, { capture: true });

    // Prevent interaction / scroll while the overlay is genuinely active.
    document.body.style.overflow = 'hidden';

    return () => {
      clearTimers();
      window.removeEventListener('error', onError);
      window.removeEventListener('unhandledrejection', onError);
    };
  }, [clearTimers]);

  // Begin the fade-out once fonts are ready and the minimum show time has
  // elapsed. Font loading and the choreography run in parallel.
  useEffect(() => {
    if (!ready) return;
    const t = setTimeout(() => setDone(true), Math.max(0, SHOW_MIN_MS));
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [ready]);

  // Remove the overlay and restore scroll once the fade completes.
  useEffect(() => {
    if (!done) return;
    const t = setTimeout(() => {
      setExited(true);
      document.body.style.overflow = '';
    }, FADE_MS);
    timers.current.push(t);
    return () => clearTimeout(t);
  }, [done]);

  if (exited) return null;

  return (
    <div
      className={`preloader${done ? ' preloader--done' : ''}`}
      aria-hidden={!done}
    >
      <div className="preloader__layer">
        <div className="preloader__glow" aria-hidden="true" />
        <h2 className="preloader__wordmark">LOCHGRAPHY</h2>
        <div className="preloader__rule">
          <div className="preloader__line" aria-hidden="true" />
          <div className="preloader__dot" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
}
