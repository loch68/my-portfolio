import { Reveal } from './Reveal';

/**
 * Shared section heading. Keeping this in one place keeps the hairline,
 * index label and optional support copy identical across every section.
 */
export function SectionHead({
  id,
  label,
  index,
  support,
}: {
  id: string;
  label: string;
  index: string;
  support?: string;
}) {
  return (
    <Reveal as="header" className="section-head">
      <div className="hairline-strong" aria-hidden="true" />
      <div className="section-head__row">
        <h2 className="section-label" id={id}>
          {label}
        </h2>
        <span className="mono-tag">{index}</span>
      </div>
      {support && <p className="section-head__support">{support}</p>}
    </Reveal>
  );
}
