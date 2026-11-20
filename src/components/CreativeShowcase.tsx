import { useRef, useState, type KeyboardEvent } from 'react';
import { DESIGN_WORK, IDENTITY_SHOWCASE, VIDEO_EDITING_EXAMPLES } from '../data/content';
import { Reveal } from './Reveal';

const PlayIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M8 5.5v13l11-6.5z" />
  </svg>
);

/**
 * Refined identity presentation. The supplied files are shown as they are -
 * only the solid matte is dropped at render time (screen / multiply) so the
 * mark can sit on the navy stage without a visible plate.
 */
function IdentityShowcase() {
  const { views, system } = IDENTITY_SHOWCASE;
  const [active, setActive] = useState(0);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const current = views[active];

  const select = (index: number) => setActive(index);

  const onTabKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    const last = views.length - 1;
    let next: number;

    switch (event.key) {
      case 'ArrowRight':
        next = active === last ? 0 : active + 1;
        break;
      case 'ArrowLeft':
        next = active === 0 ? last : active - 1;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = last;
        break;
      default:
        return;
    }

    event.preventDefault();
    select(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="identity-showcase">
      <Reveal className="identity-showcase__stage">
        <div className="identity-panel">
          <div className="identity-panel__bar">
            <div
              className="identity-tabs"
              role="tablist"
              aria-label="Logo application"
              onKeyDown={onTabKeyDown}
            >
              {views.map((view, i) => (
                <button
                  key={view.id}
                  ref={(node) => {
                    tabRefs.current[i] = node;
                  }}
                  id={`identity-tab-${view.id}`}
                  className={`identity-tab${i === active ? ' is-active' : ''}`}
                  type="button"
                  role="tab"
                  aria-selected={i === active}
                  aria-controls="identity-stage"
                  tabIndex={i === active ? 0 : -1}
                  onClick={() => select(i)}
                >
                  {view.label}
                </button>
              ))}
            </div>
            <span className="identity-panel__count" aria-hidden="true">
              {String(active + 1).padStart(2, '0')} / {String(views.length).padStart(2, '0')}
            </span>
          </div>

          <div
            id="identity-stage"
            className="identity-stage"
            role="tabpanel"
            aria-labelledby={`identity-tab-${current.id}`}
            tabIndex={0}
          >
            {views.map((view, i) => (
              <div
                key={view.id}
                className={`identity-view identity-view--${view.assets.length > 1 ? 'split' : 'single'}${
                  i === active ? ' is-active' : ''
                }`}
                aria-hidden={i !== active}
              >
                {view.assets.map((logo) => (
                  <div
                    key={logo.src}
                    className={`identity-pane identity-pane--${logo.surface}`}
                  >
                    <img
                      src={logo.src}
                      alt={logo.alt}
                      width={logo.width}
                      height={logo.height}
                      loading="lazy"
                      decoding="async"
                    />
                    {view.assets.length > 1 && (
                      <span className="identity-pane__label">{logo.caption}</span>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>

          <p className="identity-panel__caption">{current.caption}</p>
        </div>
      </Reveal>

      <Reveal className="identity-showcase__system" styleDelay={1}>
        <figure className="identity-system">
          <div className="identity-system__media">
            <img
              src={system.src}
              alt={system.alt}
              width={system.width}
              height={system.height}
              loading="lazy"
              decoding="async"
            />
          </div>
          <figcaption className="identity-system__caption">
            {system.caption}
          </figcaption>
        </figure>
      </Reveal>
    </div>
  );
}

/**
 * Creative proof shown alongside the service index: the refined identity,
 * music video edits and a cover-art gallery. The cards reuse the portfolio's
 * surface, border and typography tokens rather than introducing a second card
 * language.
 */
export function CreativeShowcase() {
  return (
    <div className="creative-showcase">
      <section className="creative-showcase__group" aria-labelledby="identity-title">
        <Reveal className="creative-showcase__head">
          <p className="creative-showcase__eyebrow">Brand identity</p>
          <h3 className="creative-showcase__title" id="identity-title">
            The refined LOCHGRAPHY identity
          </h3>
          <p className="creative-showcase__support">
            The primary lockup, light and dark applications, and the symbol at
            icon scale.
          </p>
        </Reveal>

        <IdentityShowcase />
      </section>

      <section className="creative-showcase__group" aria-labelledby="video-editing-title">
        <Reveal className="creative-showcase__head">
          <p className="creative-showcase__eyebrow">Video editing</p>
          <h3 className="creative-showcase__title" id="video-editing-title">
            Music video examples
          </h3>
          <p className="creative-showcase__support">
            Two recent edits. Each card opens the official release on YouTube.
          </p>
        </Reveal>

        <ul className="video-examples" role="list">
          {VIDEO_EDITING_EXAMPLES.map((video, i) => (
            <Reveal as="li" key={video.id} className="video-example" styleDelay={i}>
              <a
                className="video-example__link"
                href={video.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch the ${video.title} music video edit on YouTube (opens in a new tab)`}
              >
                <span className="video-example__media">
                  <img
                    src={video.image.src}
                    alt={video.image.alt}
                    width={video.image.width}
                    height={video.image.height}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="video-example__play" aria-hidden="true">
                    <PlayIcon />
                  </span>
                </span>
                <span className="video-example__body">
                  <span className="video-example__meta">Music video edit</span>
                  <span className="video-example__title">{video.title}</span>
                  <span className="video-example__caption">{video.caption}</span>
                  <span className="video-example__action">
                    Watch on YouTube
                    <span className="external-mark" aria-hidden="true">↗</span>
                  </span>
                </span>
              </a>
            </Reveal>
          ))}
        </ul>
      </section>

      <section className="creative-showcase__group" aria-labelledby="design-work-title">
        <Reveal className="creative-showcase__head">
          <p className="creative-showcase__eyebrow">Graphic design</p>
          <h3 className="creative-showcase__title" id="design-work-title">
            Cover art & visual design
          </h3>
          <p className="creative-showcase__support">
            A selection of cover-art treatments and digital artwork.
          </p>
        </Reveal>

        <ul className="design-gallery" role="list">
          {DESIGN_WORK.map((work, i) => (
            <Reveal
              as="li"
              key={work.id}
              className="design-item"
              styleDelay={i % 3}
            >
              <article className="design-card">
                <figure className="design-card__figure">
                  <span className="design-card__media">
                    <img
                      src={work.image.src}
                      alt={work.image.alt}
                      width={work.image.width}
                      height={work.image.height}
                      loading="lazy"
                      decoding="async"
                    />
                  </span>
                  <figcaption className="design-card__caption">
                    {work.caption}
                  </figcaption>
                </figure>
              </article>
            </Reveal>
          ))}
        </ul>
      </section>
    </div>
  );
}
