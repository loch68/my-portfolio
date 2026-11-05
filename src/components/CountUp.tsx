import { useEffect, useRef } from 'react';

const pad = (value: number) => String(value).padStart(2, '0');

/**
 * Lightweight, one-shot number counter.
 *
 * The final value is rendered on the server / first paint so the figure is
 * always truthful without JavaScript. When the counter enters the viewport
 * it starts at 00 and eases to the real value once. Reduced-motion visitors
 * see the final value immediately.
 */
export function CountUp({ value, duration = 1500 }: { value: number; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const final = pad(value);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      el.textContent = final;
      return;
    }

    let frame = 0;
    let started = false;

    const run = () => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min(1, (now - start) / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = pad(Math.round(value * eased));
        if (progress < 1) {
          frame = requestAnimationFrame(tick);
        } else {
          el.textContent = final;
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started) return;
        started = true;
        io.disconnect();
        el.textContent = pad(0);
        run();
      },
      { threshold: 0.45 },
    );

    io.observe(el);

    return () => {
      io.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [duration, value]);

  return (
    <span className="stat__value" ref={ref} aria-label={String(value)}>
      {pad(value)}
    </span>
  );
}
