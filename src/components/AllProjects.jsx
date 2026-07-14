import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import './AllProjects.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import { categories, projects } from '../data/projects';

const VIDEO_PREVIEW_QUALITY = 'hd1080';
const getVideoPreviewUrl = (url) => {
  if (!url || url === '#') return null;

  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[1]}&controls=0&showinfo=0&rel=0&modestbranding=1&playsinline=1&vq=${VIDEO_PREVIEW_QUALITY}`;
  }

  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview?autoplay=1&mute=1&vq=${VIDEO_PREVIEW_QUALITY}`;
  }

  return null;
};

const isVideoDemo = (url) => {
  if (!url || url === '#') return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com/file/d/');
};

const getProjectLinks = (project) => {
  const links = [];

  if (project.githubLink && project.githubLink !== '#') {
    links.push({ label: 'View Code', href: project.githubLink, external: true, kind: 'secondary' });
  }

  if (project.website && project.website !== '#') {
    if (project.slug) {
      links.push({ label: 'Open Product', to: `/projects/${project.slug}/view?target=website`, kind: 'primary' });
    } else {
      links.push({ label: 'Open Product', href: project.website, external: true, kind: 'primary' });
    }
  } else if (project.liveDemo && project.liveDemo !== '#') {
    if (project.slug && isVideoDemo(project.liveDemo)) {
      links.push({ label: 'Watch Demo', to: `/projects/${project.slug}`, kind: 'primary' });
    } else {
      links.push({ label: 'Open Demo', href: project.liveDemo, external: true, kind: 'primary' });
    }
  }

  if (project.slug) {
    links.push({ label: 'Read Case Study', to: `/projects/${project.slug}/info`, kind: 'ghost' });
  }

  return links;
};

const renderAction = (action, className) => {
  if (action.to) {
    return (
      <Link key={`${action.label}-${action.to}`} to={action.to} className={className}>
        {action.label}
      </Link>
    );
  }

  return (
    <a
      key={`${action.label}-${action.href}`}
      href={action.href}
      target={action.external ? '_blank' : undefined}
      rel={action.external ? 'noopener noreferrer' : undefined}
      className={className}
    >
      {action.label}
    </a>
  );
};

const ProjectCard = ({ project, hideDetails = false, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = getVideoPreviewUrl(project.liveDemo);
  const hasVideo = isVideoDemo(project.liveDemo) || Boolean(project.preview);
  const showVideoPreview = hasVideo && isHovered;
  const actions = getProjectLinks(project);
  const overlayActions = actions.slice(0, 3);
  const visibleTechnologies = (project.technologies || []).slice(0, 3);
  const remainingTechnologyCount = Math.max((project.technologies || []).length - visibleTechnologies.length, 0);
  const outcomeText = project.outcome || project.impact || project.highlights?.[0];

  return (
    <div
      className={`project-card ${project.featured ? 'featured' : ''} ${hideDetails ? 'media-only' : ''}`}
      style={style}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`project-image ${hideDetails ? 'media-only-image' : ''} ${hasVideo ? 'has-video' : ''}`}>
        <img
          src={project.image}
          alt={`${project.title} project preview`}
          className={`${showVideoPreview ? 'hidden' : ''} ${hideDetails ? 'native-media' : ''}`.trim()}
          width={1200}
          height={675}
          loading={hideDetails ? 'eager' : 'lazy'}
          decoding="async"
        />
        {hasVideo && <div className="video-badge">Preview</div>}
        {!hasVideo && !project.website && !project.liveDemo && <div className="video-badge unavailable">Case Study</div>}
        {!hasVideo && project.liveDemo === '#' && project.website === '#' && <div className="video-badge unavailable">Case Study</div>}
        {showVideoPreview && (
          project.preview ? (
            <video
              className="video-preview"
              title={`${project.title} preview`}
              aria-label={`${project.title} preview video`}
              controls={false}
              autoPlay
              muted
              loop
              playsInline
              preload="none"
            >
              {project.previewWebm && <source src={project.previewWebm} type="video/webm" />}
              <source src={project.preview} type="video/mp4" />
            </video>
          ) : (
            <iframe
              className="video-preview"
              src={videoUrl}
              title={`${project.title} preview`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          )
        )}
        {hideDetails && (
          <div className={`image-overlay ${isHovered && hasVideo ? 'video-active' : ''}`}>
            <div className="overlay-links">
              {overlayActions.map((action) =>
                renderAction(action, `overlay-btn overlay-btn-${action.kind || 'secondary'}`)
              )}
            </div>
          </div>
        )}
      </div>

      {!hideDetails && (
        <div className="project-info">
          <div className="project-header-row">
            <div>
              {project.eyebrow && <span className="project-eyebrow">{project.eyebrow}</span>}
              <h3 className="project-title">{project.title}</h3>
            </div>
            <div className="project-header-meta">
              {project.status && (
                <span className={`project-status ${project.status === 'Shipped' ? 'shipped' : ''}`.trim()}>
                  {project.status}
                </span>
              )}
              {project.year && <span className="project-year">{project.year}</span>}
            </div>
          </div>

          {project.tagline && <p className="project-tagline">{project.tagline}</p>}
          <p className="project-description">{project.description}</p>
          {outcomeText && <p className="project-outcome"><span>Outcome:</span> {outcomeText}</p>}

          <div className="project-technologies">
            {project.category.map((cat, index) => (
              <span key={`cat-${index}`} className="project-category">{cat}</span>
            ))}
            {project.isWIP && <span className="project-wip-tag">WIP</span>}
            {visibleTechnologies.map((tech, index) => (
              <span key={`tech-${index}`} className="tech-tag">{tech}</span>
            ))}
            {remainingTechnologyCount > 0 && <span className="tech-tag muted">+{remainingTechnologyCount}</span>}
          </div>

          <div className="project-footer">
            {actions.map((action) =>
              renderAction(action, `project-link ${action.kind === 'primary' ? 'primary' : ''}`.trim())
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export { ProjectCard };

const AllProjects = () => {
  const [activeCategory, setActiveCategory] = useState('Top Picks');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [filterRef, isFilterVisible] = useScrollReveal({ threshold: 0.3 });
  const [gridRef, isGridVisible] = useScrollReveal({ threshold: 0.05 });

  const featuredProjects = useMemo(() => projects.filter((project) => project.featured), []);
  const filteredProjects = activeCategory === 'Top Picks'
    ? featuredProjects
    : activeCategory === 'All'
      ? projects
      : projects.filter((project) => project.category.includes(activeCategory));

  const projectStats = useMemo(() => {
    const websiteCount = projects.filter((project) => project.category.includes('Website')).length;
    const mobileCount = projects.filter((project) => project.category.includes('Mobile App')).length;
    const desktopCount = projects.filter((project) => project.category.includes('Desktop App')).length;

    return [
      { label: 'Projects', value: `${projects.length}+` },
      { label: 'Featured', value: `${featuredProjects.length}` },
      { label: 'Web / Mobile / Desktop', value: `${websiteCount} / ${mobileCount} / ${desktopCount}` }
    ];
  }, [featuredProjects.length]);

  return (
    <section id="all-projects" className="all-projects">
      <div className="container">
        <div ref={headerRef} className={`projects-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}>
          <span className="section-label">Portfolio</span>
          <h1 className="section-title">
            Selected <span className="gradient-text">Works</span>
          </h1>
          <p className="section-subtitle">
            A mix of shipped class projects, product experiments, and personal builds across web, mobile, and desktop.
          </p>
        </div>

        <div className="projects-editorial-panel">
          <div className="projects-editorial-copy">
            <span className="projects-editorial-kicker">What I like building</span>
            <h3>Products with clear UX, real workflows, and enough technical depth to feel substantial.</h3>
            <p>
              The strongest through-line in my portfolio is turning ideas into usable experiences, whether that means a finance dashboard,
              an award-winning AI assistant, a blogging platform, or a mobile thesis app.
            </p>
          </div>
          <div className="projects-editorial-stats">
            {projectStats.map((stat) => (
              <div key={stat.label} className="projects-stat-card">
                <span className="projects-stat-value">{stat.value}</span>
                <span className="projects-stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="projects-cta-strip">
          <div className="projects-cta-copy">
            <h3>Need a web or mobile app built?</h3>
            <p>I am available for internships, freelance projects, and collaboration opportunities.</p>
          </div>
          <div className="projects-cta-actions">
            <Link className="projects-cta-btn primary" to="/contact">Hire Me</Link>
            <a className="projects-cta-btn" href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          </div>
        </div>

        <div ref={filterRef} className={`projects-filter scroll-reveal fade-up ${isFilterVisible ? 'visible' : ''}`}>
          {categories.map((category) => (
            <button
              key={category}
              className={`filter-btn ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div ref={gridRef} className={`projects-grid stagger-children ${isGridVisible ? 'visible' : ''}`}>
          {filteredProjects.map((project, idx) => (
            <ProjectCard
              key={`${project.id}-${idx}`}
              project={project}
              style={{ order: project.featured ? 0 : project.id }}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default AllProjects;
