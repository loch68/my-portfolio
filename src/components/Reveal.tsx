import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Reveal wrapper: CSS owns the transition, IntersectionObserver only flips a
 * class. Falls back to instantly-visible when IO is unavailable; honors
 * prefers-reduced-motion purely through CSS.
 */
export function Reveal({
  children,
  className = '',
  as: Tag = 'div',
  once = true,
  styleDelay = 0,
}: {
  children: ReactNode;
  className?: string;
  as?: 'div' | 'section' | 'header' | 'figure' | 'article' | 'li';
  once?: boolean;
  /** Small stagger index; adds transition-delay when revealed. */
  styleDelay?: number;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!('IntersectionObserver' in window)) {
      el.classList.add('is-in');
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            el.classList.add('is-in');
            if (once) io.unobserve(el);
          } else if (!once) {
            el.classList.remove('is-in');
          }
        }
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [once]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag
      ref={ref as any}
      className={`reveal ${className}`.trim()}
      style={styleDelay ? { transitionDelay: `${Math.min(styleDelay, 6) * 90}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
