import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { projects } from './AllProjects';
import './ProjectPage.css';

const isVideoDemo = (url) => {
  if (!url || url === '#') return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com/file/d/');
};

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((item) => item.slug === slug);

  if (!project) {
    return <div style={{ padding: 24 }}>Project not found</div>;
  }

  const hasWebsite = project.website && project.website !== '#';
  const hasDemo = project.liveDemo && project.liveDemo !== '#';
  const previewLink = hasWebsite ? `/projects/${project.slug}/view?target=website` : hasDemo ? `/projects/${project.slug}` : null;
  const previewLabel = hasWebsite ? 'Open Product View' : hasDemo ? (isVideoDemo(project.liveDemo) ? 'Watch Demo' : 'Open Demo') : null;
  const relatedProjects = projects.filter((item) => item.slug && item.slug !== project.slug).slice(0, 3);

  return (
    <section className="project-page">
      <div className="container project-page-shell">
        <div className="project-page-hero">
          <div className="project-page-copy">
            {project.eyebrow && <span className="project-page-eyebrow">{project.eyebrow}</span>}
            <h1>{project.title}</h1>
            <p className="project-page-tagline">{project.tagline || project.description}</p>
            <p className="project-page-summary">{project.impact || project.description}</p>

            <div className="project-page-badges">
              {project.category.map((item) => (
                <span key={`${project.title}-${item}`} className="project-page-badge category">{item}</span>
              ))}
              {project.roles?.map((item) => (
                <span key={`${project.title}-${item}`} className="project-page-badge role">{item}</span>
              ))}
              {project.year && <span className="project-page-badge year">{project.year}</span>}
              {project.isWIP && <span className="project-page-badge status">WIP</span>}
            </div>

            <div className="project-page-actions">
              {previewLink && (
                <Link to={previewLink} className="project-page-action primary">
                  {previewLabel}
                </Link>
              )}
              {project.githubLink && project.githubLink !== '#' && (
                <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="project-page-action">
                  View Code
                </a>
              )}
              <Link to="/projects" className="project-page-action subtle">
                Back to Projects
              </Link>
            </div>
          </div>

          <div className="project-page-visual">
            <div className="project-page-image-card">
              <img src={project.image} alt={project.title} />
            </div>
          </div>
        </div>

        <div className="project-page-content">
          <article className="project-page-panel">
            <h2>Overview</h2>
            <p>{project.description}</p>
            {project.impact && <p>{project.impact}</p>}
          </article>

          <article className="project-page-panel">
            <h2>Highlights</h2>
            <ul className="project-page-list">
              {(project.highlights?.length ? project.highlights : [
                'Built and documented as part of my portfolio of hands-on projects',
                'Combined product thinking with practical implementation work',
                'Shaped to be presentable as a real project, not just a code exercise'
              ]).map((item) => (
                <li key={`${project.title}-${item}`}>{item}</li>
              ))}
            </ul>
          </article>

          <article className="project-page-panel">
            <h2>Stack</h2>
            <div className="project-page-tech-grid">
              {project.technologies.map((item) => (
                <span key={`${project.title}-tech-${item}`} className="project-page-tech">
                  {item}
                </span>
              ))}
            </div>
          </article>
        </div>

        {relatedProjects.length > 0 && (
          <div className="project-page-related">
            <div className="project-page-related-header">
              <h2>More Case Studies</h2>
              <Link to="/projects">See all projects</Link>
            </div>
            <div className="project-page-related-grid">
              {relatedProjects.map((item) => (
                <Link key={item.slug} to={`/projects/${item.slug}/info`} className="project-page-related-card">
                  <span className="project-page-related-title">{item.title}</span>
                  <span className="project-page-related-copy">{item.tagline || item.description}</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
