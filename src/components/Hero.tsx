import { useEffect, useState } from "react";
import { RefractedText } from "./refracted-text";

const COMPACT_MARK_QUERY = "(max-width: 720px)";

/**
 * The refracted wordmark is tuned for a large desktop canvas. At the smaller
 * mobile size its dark lower glass reads as an outline against the dark
 * background, so the compact breakpoint gets a lighter lower glass and a
 * slightly heavier contour. Desktop props stay untouched.
 */
function useCompactMark() {
  const [compact, setCompact] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia(COMPACT_MARK_QUERY).matches,
  );

  useEffect(() => {
    const query = window.matchMedia(COMPACT_MARK_QUERY);
    const onChange = () => setCompact(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return compact;
}

/**
 * Hero — editorial intro over the site-wide procedural black-hole background.
 *
 * The background is owned by <SiteBackground /> at the application level, so
 * this section only owns the LOCH identity, typography, CTAs and scroll cue.
 * The content is never blocked on shader compilation, GPU availability or
 * media downloads.
 */
export function Hero() {
  const compactMark = useCompactMark();

  return (
    <section className="hero" id="top" aria-label="Introduction">
      <div className="container hero__content">
        <div className="hero__eyebrow">
          Pasindu Lochana Rathnayaka <span aria-hidden="true">-</span> Digital
          Creator, Sri Lanka
        </div>

        <div className="hero__mark-wrap">
          <RefractedText
            className="hero__mark"
            text="LOCH"
            theme="dark"
            reveal
            stagger={0.45}
            liftDuration={1.6}
            ease="power4.out"
            animateBeam
            openingDuration={5}
            duration={12.5}
            intensity={1.15}
            dispersion={1}
            colorIntensity={0.9}
            beamColor="#1670BB"
            topColor="#E7E6E7"
            bottomColor={compactMark ? "#5C6C88" : "#303A59"}
            fontSize="clamp(72px, 16vw, 210px)"
            fontFamily="'ReactDrops Square Display', 'Space Grotesk', sans-serif"
            fontWeight={900}
            letterSpacing="-0.02em"
            extraBold={compactMark ? 2.8 : 2.1}
            fontHeight={78}
            cornerRounding={1}
          />
        </div>

        <h1 className="hero__statement">
          Building digital experiences.
          <br />
          <span className="dim">Creating visual stories.</span>
        </h1>

        <p className="hero__sub">
          <span className="hero__sub-copy">
            Web development, creative production, and hospitality support.
          </span>
          <span className="hero__identity">
            <span className="hero__identity-item">Web Development</span>
            <span className="hero__identity-item">Creative Production</span>
            <span className="hero__identity-item">Hospitality</span>
          </span>
        </p>

        <a className="editorial-link" href="#work">
          Selected Work
          <span aria-hidden="true">→</span>
        </a>

        <a className="hero__scroll" href="#work" aria-label="Scroll 01">
          Scroll
          <span className="hero__scroll-line" aria-hidden="true" /> 01
        </a>
      </div>
    </section>
  );
}
