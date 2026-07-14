import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { projects } from '../data/projects';

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
    const handleEscape = (event) => {
      if (event.key === 'Escape') navigate(`/projects/${slug}/info`);
    };
    window.addEventListener('keydown', handleEscape);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleEscape);
    };
  }, [navigate, slug]);

  if (!project) return <div style={{ padding: 24 }}>Project not found</div>;

  if (!viewUrl || viewUrl === '#') {
    return (
      <div style={{ padding: 24 }}>
        <p>No view available for this project.</p>
        <button onClick={() => navigate(`/projects/${slug}/info`)}>Go back</button>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, width: '100vw', height: '100dvh', background: '#000', zIndex: 2147483647 }}>
      <div style={{ height: 52, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', color: '#fff', background: '#111827', fontFamily: 'system-ui, sans-serif' }}>
        <button type="button" onClick={() => navigate(`/projects/${slug}/info`)} style={{ padding: '8px 12px', cursor: 'pointer' }}>
          Back to project
        </button>
        <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{project.title}</strong>
        <a href={viewUrl} target="_blank" rel="noopener noreferrer" style={{ marginLeft: 'auto', color: '#7dd3fc' }}>
          Open in new tab
        </a>
      </div>
      {!iframeBlocked && (
        <iframe
          title={`${project.title} project view`}
          src={viewUrl}
          style={{ width: '100%', height: 'calc(100% - 52px)', border: 0 }}
          loading="eager"
          referrerPolicy="strict-origin-when-cross-origin"
          onError={() => setIframeBlocked(true)}
        />
      )}

      {iframeBlocked && (
        <div style={{ color: '#fff', padding: 24 }}>
          <p>Embedding is blocked by the remote site.</p>
          <a href={viewUrl} target="_blank" rel="noopener noreferrer">Open in new tab</a>
          <button style={{ marginLeft: 12 }} onClick={() => navigate(`/projects/${slug}/info`)}>Go back</button>
        </div>
      )}
    </div>
  );
}
