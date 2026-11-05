import type { Project } from "../data/content";

export function ProjectCard({ project }: { project: Project }) {
  return (
    <article className="project">
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
        </p>
        {project.status?.kind === "construction" && (
          <p className="project__status project__status--construction">
            <span className="dot" aria-hidden="true" />
            {project.status.label}
          </p>
        )}
        {project.status && project.status.kind !== "construction" && (
          <p className="project__status">
            <span className="dot" aria-hidden="true" />
            {project.status.label}
          </p>
        )}
        <h3 className="project__title">{project.title}</h3>
        <p className="project__desc">{project.description}</p>
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
            <span aria-hidden="true">→</span>
          </a>
        )}
      </div>
    </article>
  );
}
