import { useEffect, useRef } from "react";
import { RefractedText } from "./refracted-text";
import { IMAGES, VIDEO } from "../assets";

/**
 * Hero — interactive cinematic video experience.
 *
 * The abstract hero video (assets/images/hero/heroVideo.mp4) is the full-screen
 * background behind the existing LOCH brand identity. The video plays muted,
 * autoplaying and looping, with the hero-2400.jpg poster as static fallback.
 *
 * Mouse movement produces a subtle parallax translation of the video surface
 * (desktop only, respects prefers-reduced-motion). The hero text, Refracted
 * Text wordmark, and navigation remain stable — only the background video moves.
 *
 * Renders immediately: the poster image is shown from first paint, nothing
 * waits on video download or WebGL initialization.
 */
export function Hero() {
  const rafRef = useRef<number>(0);

  // Pointer-responsive parallax: translate the video surface slightly in the
  // opposite direction of the mouse. Uses rAF (not React state) so every
  // mouse event stays cheap. Restricted to fine-pointer devices.
  useEffect(() => {
    const container = document.querySelector(".hero") as HTMLElement;
    const video = document.querySelector(".hero__video") as HTMLVideoElement;
    if (!video || !container) return;

    const MAX_TRANSLATE_X = 12;
    const MAX_TRANSLATE_Y = 9;
    let targetX = 0;
    let targetY = 0;
    let currentX = 0;
    let currentY = 0;
    let running = false;

    const isFinePointer = window.matchMedia("(pointer: fine)").matches;
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animate = () => {
      // Smooth interpolation toward the target position.
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;

      video.style.setProperty("--parallax-x", `${currentX}px`);
      video.style.setProperty("--parallax-y", `${currentY}px`);

      if (
        Math.abs(targetX - currentX) > 0.05 ||
        Math.abs(targetY - currentY) > 0.05
      ) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        running = false;
      }
    };

    const onMove = (event: PointerEvent) => {
      if (!isFinePointer || prefersReduced) return;
      const rect = container.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
      const ny = (event.clientY - rect.top) / rect.height - 0.5;
      targetX = -nx * MAX_TRANSLATE_X;
      targetY = -ny * MAX_TRANSLATE_Y;
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    const onLeave = () => {
      targetX = 0;
      targetY = 0;
      if (!running) {
        running = true;
        rafRef.current = requestAnimationFrame(animate);
      }
    };

    container.addEventListener("pointermove", onMove as EventListener);
    container.addEventListener("pointerleave", onLeave as EventListener);

    return () => {
      cancelAnimationFrame(rafRef.current);
      container.removeEventListener("pointermove", onMove as EventListener);
      container.removeEventListener("pointerleave", onLeave as EventListener);
    };
  }, []);

  return (
    <section
      className="hero"
      id="top"
      aria-label="Introduction"
      style={{ backgroundImage: `url(${IMAGES.hero.wide.src})` }}
    >
      <video
        className="hero__video"
        src={VIDEO.hero}
        poster={IMAGES.hero.wide.src}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
        tabIndex={-1}
      />
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
            bottomColor="#303A59"
            fontSize="clamp(72px, 16vw, 210px)"
            fontFamily="'ReactDrops Square Display', 'Space Grotesk', sans-serif"
            fontWeight={900}
            letterSpacing="-0.02em"
            extraBold={2.1}
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
          I create digital experiences, visual content, and practical solutions
          that help ideas and businesses move forward.
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
