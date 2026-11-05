import { useEffect, useRef } from 'react';
import {
  CONTACT,
  EDUCATION,
  PORTFOLIO_STATS,
  PROJECTS,
  SERVICES,
} from '../data/content';
import { CountUp } from './CountUp';
import { ServiceCard } from './ServiceCard';
import { ProjectCard } from './ProjectCard';
import { Reveal } from './Reveal';
import { SectionHead } from './SectionHead';
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
    <section className="section section--work" id="work" aria-labelledby="work-label">
      <div className="container">
        <SectionHead
          id="work-label"
          label="Projects & Engagements"
          index="02 · Selected Work"
          support="Selected work, creative projects, and digital experiences that show how I work."
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
  return (
    <section className="section section--about" id="about" aria-labelledby="about-label">
      <div className="container">
        <SectionHead id="about-label" label="About" index="03 · Identity" />

        <div className="about__layout">
          <Reveal className="about__media">
            <figure className="about__portrait">
              <img
                src={IMAGES.profile.src}
                srcSet={IMAGES.profile.srcSet}
                sizes="(max-width: 860px) 100vw, 38vw"
                width={IMAGES.profile.width}
                height={IMAGES.profile.height}
                alt="Pasindu Lochana Rathnayaka"
                loading="lazy"
                decoding="async"
              />
            </figure>
          </Reveal>

          <div className="about__content">
            <Reveal>
              <p className="about__statement">
                One identity across several crafts. I build digital experiences,
                produce visual stories, and run the digital side of hospitality
                businesses — not four separate jobs, but one way a studio works.
              </p>
            </Reveal>

            <Reveal className="about__copy">
              <p>
                On the technical side I design and build websites and turn
                business requirements into practical digital solutions.
              </p>
              <p>
                On the creative side, <strong>Lochgraphy</strong> is where
                photography, videography, editing, and brand design live. In
                between, I support travel and hospitality businesses with booking
                platforms, property listings, and the online presence guests
                actually see.
              </p>
            </Reveal>
          </div>
        </div>

        <Reveal className="about__stats-wrap">
          <ul className="stats" role="list">
            {PORTFOLIO_STATS.map((stat) => (
              <li className="stat" key={stat.label}>
                <CountUp value={stat.value} />
                <span className="stat__label">{stat.label}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}

export function EducationSection() {
  const timelineRef = useRef<HTMLDivElement>(null);

  // Fill the timeline line as the section travels through the viewport. The
  // value is written to a CSS custom property so scrolling does not re-render
  // React. Reduced-motion visitors get a fully drawn, immediately readable line.
  useEffect(() => {
    const el = timelineRef.current;
    if (!el) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      el.style.setProperty('--timeline-progress', '1');
      return;
    }

    let frame = 0;

    const update = () => {
      frame = 0;
      const rect = el.getBoundingClientRect();
      const viewport = window.innerHeight;
      const start = viewport * 0.82;
      const end = viewport * 0.18;
      const distance = rect.height + start - end;
      const progress =
        distance > 0 ? Math.min(1, Math.max(0, (start - rect.top) / distance)) : 0;
      el.style.setProperty('--timeline-progress', progress.toFixed(4));
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

  return (
    <section className="section section--education" id="education" aria-labelledby="education-label">
      <div className="container">
        <SectionHead id="education-label" label="Education" index="01 · Background" />

        <div className="education-timeline" ref={timelineRef}>
          <div className="education-timeline__track" aria-hidden="true">
            <span className="education-timeline__fill" />
          </div>

          <ol className="education-timeline__list">
            {EDUCATION.map((entry, i) => (
              <Reveal as="li" key={entry.institution} className="education-entry" styleDelay={i}>
                <span className="education-entry__marker" aria-hidden="true" />
                <div className="education-entry__content">
                  <p className="education__period">{entry.period}</p>
                  <h3 className="education__institution">{entry.institution}</h3>
                  <p className="education__qualification">{entry.qualification}</p>
                  <div className="education__meta">
                    <span>{entry.status}</span>
                    {entry.detail && <span>{entry.detail}</span>}
                  </div>
                </div>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function ServicesSection() {
  return (
    <section className="section section--services" id="services" aria-labelledby="services-label">
      <div className="container">
        <SectionHead
          id="services-label"
          label="Services"
          index="04 · Capabilities"
          support="A professional overview of the work I offer — small-scale, honest, and discussed directly with clients."
        />

        <ul className="service-index" role="list">
          {SERVICES.map((service, i) => (
            <Reveal as="li" key={service.index} className="service-item" styleDelay={i}>
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ContactSection() {
  const mailHref = `mailto:${CONTACT.email}?subject=${encodeURIComponent('[Portfolio] Project inquiry')}`;

  return (
    <section className="section section--contact" id="contact" aria-labelledby="contact-label">
      <div className="contact__inner">
        <Reveal className="contact__intro">
          <h2 id="contact-label" className="contact__label">Let's work together.</h2>
          <p>
            Have a project in mind, need a digital solution, or want to
            collaborate? Get in touch and let's discuss what we can create.
          </p>
          <div className="contact__direct">
            <div className="contact__direct-item">
              <MailIcon />
              <a href={mailHref}>{CONTACT.email}</a>
            </div>
            <div className="contact__direct-item">
              <PhoneIcon />
              <a href={CONTACT.phones[0].href}>{CONTACT.phones[0].label}</a>
            </div>
          </div>
        </Reveal>

        <Reveal className="contact__socials">
          <h3>Elsewhere</h3>
          <ul className="contact__social-list" role="list">
            {CONTACT.socials.map((social) => (
              <li key={social.label} className="contact__social-item">
                <SocialIcon label={social.label} />
                <a href={social.href} target="_blank" rel="noopener noreferrer">
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="contact__cv">
            <a href={IMAGES.cv} download className="editorial-link">
              Download CV — PDF
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <span className="footer__identity">Pasindu Lochana Rathnayaka — Lochgraphy</span>
      <div className="footer__links">
        <a href="#top">Back to top</a>
        <a href="#work">Work</a>
        <a href="#services">Services</a>
        <a href="#contact">Contact</a>
      </div>
      <span className="footer__copy">
        © {new Date().getFullYear()} · Built with plain React, Canvas &amp; WebGL
      </span>
    </footer>
  );
}
