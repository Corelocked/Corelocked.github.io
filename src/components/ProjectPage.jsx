import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { projects } from './AllProjects';

export default function ProjectPage() {
  const { slug } = useParams();
  const project = projects.find((p) => p.slug === slug);
  const [iframeBlocked, setIframeBlocked] = useState(false);

  useEffect(() => {
    setIframeBlocked(false);
  }, [slug]);

  if (!project) return <div style={{ padding: 24 }}>Project not found</div>;

  const openExtern = () => window.open(project.liveDemo, '_blank', 'noopener');

  return (
    <section className="project-page">
      <div className="container" style={{ padding: '24px 0' }}>
        <h1>{project.title}</h1>
        <p>{project.description}</p>
        <div style={{ marginTop: 12 }}>
          <Link to={`/projects/${project.slug}/info`} className="project-link primary">View details</Link>
        </div>

        {project.liveDemo && project.liveDemo !== '#' ? (
          <>
            {!iframeBlocked && (
              <iframe
                title={project.title}
                src={project.liveDemo}
                style={{ width: '100%', height: '75vh', border: 0 }}
                onError={() => setIframeBlocked(true)}
              />
            )}

            {iframeBlocked && (
              <div style={{ marginTop: 16 }}>
                <p>Embedding is blocked by the remote site.</p>
                <button onClick={openExtern}>Open demo in new tab</button>
              </div>
            )}
          </>
        ) : (
          <div style={{ marginTop: 16 }}>
            <p>No live demo available.</p>
            <button onClick={openExtern}>Open project</button>
          </div>
        )}
      </div>
    </section>
  );
}
