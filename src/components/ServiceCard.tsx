import { useEffect, useRef } from 'react';
import type { ServiceCategory } from '../data/content';
import { useMediaQuery } from './useMediaQuery';

/**
 * ServiceCard - the single reusable card used by every service offering.
 *
 * The grid item, the card surface, its content and its disclosure all have
 * separate class names so no element inherits two layout roles.
 */
export function ServiceCard({ service }: { service: ServiceCategory }) {
  const desktop = useMediaQuery('(min-width: 861px)');
  const detailsRef = useRef<HTMLDetailsElement>(null);

  // Desktop keeps the full list visible; mobile starts collapsed and lets the
  // visitor open the native disclosure with a keyboard or touch.
  useEffect(() => {
    if (detailsRef.current) detailsRef.current.open = desktop;
  }, [desktop]);

  return (
    <article className="service-card">
      <div className="service-card__meta">
        <span className="service-card__index">{service.index}</span>
        {service.brand && <span className="service-card__brand">{service.brand}</span>}
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__summary">{service.summary}</p>

        {service.platforms && (
          <ul className="service-card__platforms" role="list" aria-label="Platforms">
            {service.platforms.map((platform) => (
              <li key={platform}>{platform}</li>
            ))}
          </ul>
        )}

        <ul className="service-card__highlights" role="list">
          {service.highlights.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <details className="service-card__more" ref={detailsRef}>
          <summary>What's included</summary>
          <ul className="service-card__details" role="list">
            {service.details.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </details>
      </div>
    </article>
  );
}
