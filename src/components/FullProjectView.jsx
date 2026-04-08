import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { projects } from './AllProjects';

export default function FullProjectView() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const project = projects.find((p) => p.slug === slug);
  const [iframeBlocked, setIframeBlocked] = useState(false);
  const target = searchParams.get('target');
  const viewUrl = target === 'website' && project?.website && project.website !== '#'
    ? project.website
    : project?.liveDemo;

  useEffect(() => {
    setIframeBlocked(false);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prevOverflow; };
  }, [slug]);

  if (!project) return <div style={{ padding: 24 }}>Project not found</div>;

  if (!viewUrl || viewUrl === '#') {
    return (
      <div style={{ padding: 24 }}>
        <p>No view available for this project.</p>
        <button onClick={() => navigate(-1)}>Go back</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100vh', background: '#000', zIndex: 2147483647 }}>
      {!iframeBlocked && (
        <iframe
          title={`${project.title} project view`}
          src={viewUrl}
          style={{ width: '100%', height: '100%', border: 0 }}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setIframeBlocked(true)}
        />
      )}

      {iframeBlocked && (
        <div style={{ color: '#fff', padding: 24 }}>
          <p>Embedding is blocked by the remote site.</p>
          <a href={viewUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>
          <button style={{ marginLeft: 12 }} onClick={() => navigate(-1)}>Go back</button>
        </div>
      )}
    </div>
  );
}
