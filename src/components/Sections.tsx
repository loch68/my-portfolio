import { useEffect, useRef } from 'react';
import {
  CONTACT,
  EDUCATION,
  PROJECTS,
  SECTION_LINKS,
  SERVICES,
} from '../data/content';
import { ServiceCard } from './ServiceCard';
import { ProjectCard } from './ProjectCard';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
import { useMediaQuery } from './useMediaQuery';
import { IMAGES } from '../assets';

const MailIcon = () => (
  <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.63A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);

const InstagramIcon = () => (
  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="12.5" x2="17.51" y2="12.5" />
  </svg>
);

const LinkedInIcon = () => (
  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const GitHubIcon = () => (
  <svg className="icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-3.23c-.28-.88-.84-1.51-1.56-1.78a3.37 3.37 0 0 0-3.59-3.59c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.23-.94v3.59m0 0a3.37 3.37 0 0 0-3.23-.94c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.59-3.59c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.23-.94v3.59m5.66-1.48a3.37 3.37 0 0 0-3.23-.94c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.59-3.59c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.23-.94v3.59m5.66-1.48a3.37 3.37 0 0 0-3.23-.94c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.59-3.59c-.27-.72-.9-1.28-1.78-1.56a3.37 3.37 0 0 0-3.23-.94v3.59z" />
  </svg>
);

function SocialIcon({ label }: { label: string }) {
  switch (label) {
    case 'Instagram':
      return <InstagramIcon />;
    case 'LinkedIn':
      return <LinkedInIcon />;
    case 'GitHub':
      return <GitHubIcon />;
    default:
      return null;
  }
}

export function ProjectsSection() {
  return (
    <section className="section section--work" id="work" aria-labelledby="work-label" tabIndex={-1}>
      <div className="container">
        <SectionHead
          id="work-label"
          label="Projects & Engagements"
          index="01 · Selected Work"
        />

        <div className="projects-grid">
          {PROJECTS.map((p, i) => (
            <Reveal key={p.id} as="article" styleDelay={i}>
              <ProjectCard project={p} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutSection() {
  const desktop = useMediaQuery('(min-width: 721px)');
  const moreRef = useRef<HTMLDetailsElement>(null);

  // The capability labels carry the identity on mobile. The supporting
  // paragraphs remain visible on desktop and open on demand on mobile.
  useEffect(() => {
    if (moreRef.current) moreRef.current.open = desktop;
  }, [desktop]);

  return (
    <section className="section section--about" id="about" aria-labelledby="about-label" tabIndex={-1}>
      <div className="container">
        <SectionHead id="about-label" label="About" index="02 · Identity" />

        <div className="about__layout">
          <Reveal className="about__media">
            <figure className="about__portrait">
              <img
                src={IMAGES.profile.src}
                srcSet={IMAGES.profile.srcSet}
                sizes="(max-width: 720px) calc(100vw - 40px), (max-width: 860px) 45vw, 38vw"
                width={IMAGES.profile.width}
                height={IMAGES.profile.height}
                alt="Portrait of Pasindu Lochana Rathnayaka outdoors in a green sweater, with one hand raised to his brow"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>

          <div className="about__content">
            <Reveal>
              <p className="about__statement">
                One identity across several crafts. I build websites, create
                visual content, and support hospitality businesses online.
              </p>
            </Reveal>

            <Reveal className="about__capabilities">
              <ul className="about__capability-list" role="list">
                <li className="about__capability">
                  <span className="about__capability-label">Web development</span>
                  <span className="about__capability-detail">
                    Websites and digital product interfaces.
                  </span>
                </li>
                <li className="about__capability">
                  <span className="about__capability-label">Creative production</span>
                  <span className="about__capability-detail">
                    Photography, videography, editing, and brand design.
                  </span>
                </li>
                <li className="about__capability">
                  <span className="about__capability-label">Hospitality support</span>
                  <span className="about__capability-detail">
                    Booking platforms, property listings, and online presence.
                  </span>
                </li>
              </ul>
            </Reveal>

            <Reveal className="about__more-wrap">
              <details className="about__more" ref={moreRef}>
                <summary>More about my work</summary>
                <div className="about__copy">
                  <p>
                    On the technical side, I design and build websites from
                    business requirements.
                  </p>
                  <p>
                    Through <strong>Lochgraphy</strong>, I produce photography,
                    videography, editing, and brand design. I also support travel
                    and hospitality businesses with booking platforms, property
                    listings, and the online presence guests see.
                  </p>
                </div>
              </details>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export function EducationSection() {
  return (
    <section className="section section--education" id="education" aria-labelledby="education-label" tabIndex={-1}>
      <div className="container">
        <SectionHead id="education-label" label="Education" index="03 · Background" />

        {/* The labels describe milestone types, not a chronology. The timeline
            rail is presentational; the list order is not a claim about dates. */}
        <Reveal as="ol" className="education-list" observeOnly>
          {EDUCATION.map((entry, i) => (
            <Reveal as="li" key={entry.institution} className="education-entry" styleDelay={i}>
              <div className="education-entry__meta">
                <p className="education__period">{entry.period}</p>
              </div>
              <div className="education-entry__content">
                <h3 className="education__institution">{entry.institution}</h3>
                <p className="education__qualification">{entry.qualification}</p>
              </div>
            </Reveal>
          ))}
        </Reveal>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="section section--services" id="services" aria-labelledby="services-label" tabIndex={-1}>
      <div className="container">
        <SectionHead
          id="services-label"
          label="Services"
          index="04 · Capabilities"
        />

        <ul className="service-index" role="list">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.index} className="service-item" styleDelay={i}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>

        <Reveal className="services__footer">
          <a className="editorial-link services__cta" href="#contact">
            Discuss a service
            <span aria-hidden="true">→</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function ContactSection() {
  const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent('[Portfolio] Project inquiry')}`;

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-label" tabIndex={-1}>
      <div className="container">
        <SectionHead id="contact-label" label="Contact" index="05 · Contact" />

        <div className="contact__inner">
          <Reveal className="contact__intro">
            <h3 className="contact__label">Let's work together.</h3>
            <div className="contact__direct">
              <a className="contact__direct-item" href={mailHref}>
                <MailIcon />
                <span>{CONTACT.email}</span>
              </a>
              <a className="contact__direct-item" href={CONTACT.phones[0].href}>
                <PhoneIcon />
                <span>{CONTACT.phones[0].label}</span>
              </a>
            </div>
          </Reveal>

          <Reveal className="contact__socials">
            <h3>Elsewhere</h3>
            <ul className="contact__social-list" role="list">
              {CONTACT.socials.map((social) => (
                <li key={social.label}>
                  <a
                    className="contact__social-item"
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SocialIcon label={social.label} />
                    <span>
                      {social.label}
                      <span className="external-mark" aria-hidden="true">↗</span>
                    </span>
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="contact__cv">
              <a href={IMAGES.cv} download className="editorial-link">
                Download CV (PDF)
              </a>
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__identity">Pasindu Lochana Rathnayaka - Lochgraphy</span>
      <nav className="footer__nav" aria-label="Footer">
        <ul className="footer__links" role="list">
          {SECTION_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href}>{link.label}</a>
            </li>
          ))}
          <li>
            <a href="#top">Back to top</a>
          </li>
        </ul>
      </nav>
      <span className="footer__copy">
        © {new Date().getFullYear()} · Built with plain React, Canvas &amp; WebGL
      </span>
    </footer>
  );
}
