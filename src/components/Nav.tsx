import { useEffect, useRef, useState } from 'react';
import { IMAGES } from '../assets';
import { SECTION_LINKS } from '../data/content';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function isVisible(el: HTMLElement) {
  const style = window.getComputedStyle(el);
  return style.display !== 'none' && style.visibility !== 'hidden' && el.getClientRects().length > 0;
}

export function Nav() {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLUListElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const hasOpenedRef = useRef(false);
  const pendingFocusRef = useRef<HTMLElement | null>(null);

  // Scroll-aware navigation: one passive, rAF-throttled listener updates the
  // muted slate surface and the active section. The active section is the last
  // one whose top has crossed a reading line 40% down the viewport, which is
  // deterministic at adjacent boundaries. Near the page bottom the final link
  // is forced active so Contact remains identifiable when it cannot reach the
  // reading line. State is only written when the value actually changes.
  useEffect(() => {
    const sections = SECTION_LINKS.map((l) => document.querySelector(l.href)).filter(
      (el): el is HTMLElement => el !== null,
    );
    let frame = 0;
    let lastActive: string | null = null;

    const update = () => {
      frame = 0;
      setScrolled(window.scrollY > 60);

      if (!sections.length) return;

      const line = window.innerHeight * 0.4;
      let next: string | null = null;

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) {
          next = `#${section.id}`;
        } else {
          break;
        }
      }

      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 2;
      if (atBottom) next = `#${sections[sections.length - 1].id}`;

      if (next !== lastActive) {
        lastActive = next;
        setActive(next);
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(update);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    update();

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  useEffect(() => {
    document.body.classList.toggle('nav-open', open);
    return () => document.body.classList.remove('nav-open');
  }, [open]);

  // Move focus into the overlay once it is actually visible. On close, move
  // focus to the destination section when a menu link was activated, or back
  // to the toggle for Escape and the close button. Initial focus waits for the
  // next frame because the overlay's visibility transition can still be
  // resolving when the effect runs. Close focus is also deferred so it
  // survives a menu-link anchor jump.
  useEffect(() => {
    let frame = 0;

    if (open) {
      hasOpenedRef.current = true;
      let attempts = 0;

      const focusFirstLink = () => {
        const firstLink = menuRef.current?.querySelector<HTMLElement>('a[href]');
        if (firstLink && isVisible(firstLink)) {
          firstLink.focus();
          return;
        }
        if (attempts++ < 3) frame = requestAnimationFrame(focusFirstLink);
      };

      frame = requestAnimationFrame(focusFirstLink);
      return () => cancelAnimationFrame(frame);
    }

    if (!hasOpenedRef.current) return;
    hasOpenedRef.current = false;
    frame = requestAnimationFrame(() => {
      const destination = pendingFocusRef.current;
      pendingFocusRef.current = null;

      if (destination && isVisible(destination)) {
        destination.focus({ preventScroll: true });
        return;
      }

      const toggle = toggleRef.current;
      if (toggle && isVisible(toggle)) toggle.focus();
    });

    return () => cancelAnimationFrame(frame);
  }, [open]);

  // Keep keyboard focus inside the open overlay. Focusable menu items are
  // queried on every Tab so the loop adapts if the link set changes.
  useEffect(() => {
    if (!open) return;

    const getFocusable = () => {
      const menuItems = menuRef.current
        ? Array.from(menuRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(isVisible)
        : [];
      const toggle = toggleRef.current;
      return toggle && isVisible(toggle) ? [...menuItems, toggle] : menuItems;
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusable = getFocusable();
      if (!focusable.length) {
        e.preventDefault();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const activeElement = document.activeElement as HTMLElement | null;
      const activeIsInside = activeElement ? focusable.includes(activeElement) : false;

      if (e.shiftKey && (activeElement === first || !activeIsInside)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && (activeElement === last || !activeIsInside)) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Escape closes only while the overlay is open, avoiding a persistent
  // document-level listener when the menu is closed.
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      setOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [open]);

  // Remove the rest of the page from the tab order while the full-screen
  // menu is open. The wordmark is covered by the overlay, so it is included.
  useEffect(() => {
    if (!open) return;

    const elements = Array.from(
      document.querySelectorAll<HTMLElement>('main, .footer, .skip-link, .nav__brand'),
    );
    const previouslyInert = elements.map((el) => el.hasAttribute('inert'));
    elements.forEach((el) => el.setAttribute('inert', ''));

    return () => {
      elements.forEach((el, i) => {
        if (!previouslyInert[i]) el.removeAttribute('inert');
      });
    };
  }, [open]);

  // The mobile overlay is not usable at desktop widths. Close it if the
  // viewport crosses the breakpoint while it is open.
  useEffect(() => {
    if (!open) return;

    const onResize = () => {
      if (window.matchMedia('(min-width: 901px)').matches) setOpen(false);
    };

    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [open]);

  return (
    <header className={`nav${scrolled ? ' is-scrolled' : ''}${open ? ' is-open' : ''}`}>
      <div className="nav__wrapper">
        <a className="nav__brand" href="#top" aria-label="Lochgraphy - back to top" onClick={() => setOpen(false)}>
          <img className="nav__logo" src={IMAGES.logo} alt="" width={26} height={26} />
          <span className="nav__wordmark">Lochgraphy</span>
        </a>
        <nav aria-label="Primary">
          <ul className="nav__links" id="nav-links" ref={menuRef}>
            {SECTION_LINKS.map((l, i) => (
              <li key={l.href}>
                <a
                  className="nav__link"
                  href={l.href}
                  aria-current={active === l.href || undefined}
                  onClick={() => {
                    if (open) {
                      pendingFocusRef.current = document.querySelector<HTMLElement>(l.href);
                    }
                    setOpen(false);
                  }}
                >
                  <span>0{i + 1}</span>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <button
          ref={toggleRef}
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="nav-links"
          aria-label={open ? 'Close menu' : 'Open menu'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}
