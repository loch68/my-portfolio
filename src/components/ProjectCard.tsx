import type { Project } from "../data/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className={`project${project.link ? ' project--linked' : ''}${project.link?.external ? ' project--external' : ''}`}>
      {project.image && (
        <figure className="project__media">
          <img
            src={project.image.src}
            alt={project.image.alt}
            width={project.image.width}
            height={project.image.height}
            loading="lazy"
            decoding="async"
          />
        </figure>
      )}
      <div className="project__body">
        <p className="project__metarow">
          <span className="project__index">{project.index}</span>
          <span className="project__category">{project.category}</span>
          {project.alias && <span className="project__alias">{project.alias}</span>}
          {project.status && (
            <span
              className={`project__status${project.status.kind === 'construction' ? ' project__status--construction' : ''}`}
            >
              <span className="dot" aria-hidden="true" />
              {project.status.label}
            </span>
          )}
        </p>
        <h3 className="project__title">
          {project.title}
          {project.link && (
            <span className="project__title-mark" aria-hidden="true">
              {project.link.external ? '↗' : '→'}
            </span>
          )}
        </h3>
        <p className="project__desc project__desc--short">{project.descriptionShort}</p>
        <p className="project__desc project__desc--full">{project.description}</p>
        <ul className="project__tags" role="list">
          {project.tags.map((tag) => (
            <li key={tag}>{tag}</li>
          ))}
        </ul>
        {project.link && (
          <a
            className="project__action"
            href={project.link.href}
            {...(project.link.external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {})}
          >
            {project.link.label}
            <span className="sr-only"> for {project.title}</span>
            {project.link.external ? (
              <>
                <span className="external-mark" aria-hidden="true">↗</span>
                <span className="sr-only"> (opens in a new tab)</span>
              </>
            ) : (
              <span aria-hidden="true">→</span>
            )}
          </a>
        )}
      </div>
    </article>
  );
}
