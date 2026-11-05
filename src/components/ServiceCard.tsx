import type { ServiceCategory } from '../data/content';

/**
 * ServiceCard — the single reusable card used by every service offering.
 *
 * The grid item, the card surface, its content and its action all have
 * separate class names so no element inherits two layout roles.
 */
export function ServiceCard({ service }: { service: ServiceCategory }) {
  return (
    <article className="service-card">
      <div className="service-card__meta">
        <span className="service-card__index">{service.index}</span>
        {service.brand && <span className="service-card__brand">{service.brand}</span>}
      </div>

      <div className="service-card__body">
        <h3 className="service-card__title">{service.title}</h3>
        <p className="service-card__summary">{service.summary}</p>
        <ul className="service-card__details" role="list">
          {service.details.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <a className="service-card__action" href="#contact">
        Discuss this service
        <span aria-hidden="true">→</span>
      </a>
    </article>
  );
}
