import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Projects.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';
import { projects, ProjectCard } from './AllProjects';

const Projects = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [carouselRef, isCarouselVisible] = useScrollReveal({ threshold: 0.05 });
  const navigate = useNavigate();

  // Only show featured projects in carousel
  const featuredProjects = projects.filter(project => project.featured);
  const filteredProjects = featuredProjects;
  const activeProject = filteredProjects[currentIndex];

  useEffect(() => {
    if (currentIndex > filteredProjects.length - 1) {
      setCurrentIndex(0);
    }
  }, [currentIndex, filteredProjects.length]);

  const prev = useCallback(() => {
    if (filteredProjects.length <= 1) return;
    setDirection('prev');
    setCurrentIndex((idx) => (idx - 1 + filteredProjects.length) % filteredProjects.length);
  }, [filteredProjects.length]);

  const next = useCallback(() => {
    if (filteredProjects.length <= 1) return;
    setDirection('next');
    setCurrentIndex((idx) => (idx + 1) % filteredProjects.length);
  }, [filteredProjects.length]);

  return (
    <section id="projects" className="projects">
      <div className="container">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`projects-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}
        >
          <span className="section-label">
            Portfolio
          </span>
          <h2 className="section-title">
            My <span className="gradient-text">Works</span>
          </h2>
          <p className="section-subtitle">
            Explore the projects I've worked through my taps, swipes and clicks of creative tools as well as lines of code.
          </p>
        </div>

        {/* Category filter removed: carousel shows featured projects only */}

        {/* Carousel Container */}
        {filteredProjects.length > 0 && (
          <div 
            ref={carouselRef}
            className={`projects-carousel-shell scroll-reveal fade-up ${isCarouselVisible ? 'visible' : ''}`}
          >
            <span className="projects-counter">{currentIndex + 1} / {filteredProjects.length}</span>

            <button
              className="projects-arrow left"
              onClick={prev}
              aria-label="Previous project"
              disabled={filteredProjects.length <= 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>

            <div className="projects-slides">
              {filteredProjects.map((project, idx) => (
                <div
                  key={project.id}
                  className={`projects-slide ${idx === currentIndex ? 'active' : ''} ${direction}`}
                  aria-hidden={idx !== currentIndex}
                >
                  <ProjectCard project={project} hideDetails={true} />
                </div>
              ))}
            </div>

            <button
              className="projects-arrow right"
              onClick={next}
              aria-label="Next project"
              disabled={filteredProjects.length <= 1}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>

            {activeProject && (
              <div className="projects-spotlight">
                <div className="projects-spotlight-copy">
                  <span className="projects-spotlight-label">Featured Project</span>
                  <h3>{activeProject.title}</h3>
                  <p>{activeProject.tagline || activeProject.impact || activeProject.description}</p>
                  <div className="projects-spotlight-tags" aria-label="active project categories and technologies">
                    {activeProject.category.slice(0, 2).map((item) => (
                      <span key={`${activeProject.id}-${item}`} className="projects-spotlight-chip">
                        {item}
                      </span>
                    ))}
                    {activeProject.technologies.slice(0, 3).map((item) => (
                      <span key={`${activeProject.id}-tech-${item}`} className="projects-spotlight-chip muted">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="projects-spotlight-actions">
                  <button
                    className="projects-spotlight-btn primary"
                    onClick={() => {
                      if (activeProject.slug) {
                        navigate(`/projects/${activeProject.slug}/info`);
                        return;
                      }
                      navigate('/projects');
                    }}
                  >
                    Read case study
                  </button>
                  {(activeProject.website || activeProject.liveDemo || activeProject.githubLink) && (
                    <button
                      className="projects-spotlight-btn"
                      onClick={() => {
                        if (activeProject.slug) {
                          if (activeProject.website && activeProject.website !== '#') {
                            navigate(`/projects/${activeProject.slug}/view?target=website`);
                            return;
                          }

                          navigate(`/projects/${activeProject.slug}`);
                          return;
                        }

                        const targetUrl = activeProject.website || activeProject.liveDemo || activeProject.githubLink;
                        if (targetUrl && targetUrl !== '#') {
                          window.open(targetUrl, '_blank', 'noopener,noreferrer');
                        }
                      }}
                    >
                      {activeProject.website && activeProject.website !== '#'
                        ? 'Open featured project'
                        : activeProject.liveDemo && activeProject.liveDemo !== '#'
                          ? 'Watch featured demo'
                          : 'View repository'}
                    </button>
                  )}
                </div>
              </div>
            )}

            <div className="projects-controls">
              <div className="projects-dots">
                {filteredProjects.map((project, idx) => (
                  <button
                    key={`dot-${project.id}`}
                    className={`dot ${idx === currentIndex ? 'active' : ''}`}
                    onClick={() => {
                      setDirection(idx > currentIndex ? 'next' : 'prev');
                      setCurrentIndex(idx);
                    }}
                    aria-label={`Go to project ${idx + 1}`}
                  />
                ))}
              </div>

              <button className="projects-view-all-btn" onClick={() => navigate('/projects')}>
                View all
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <rect x="3" y="3" width="7" height="7" />
                  <rect x="14" y="3" width="7" height="7" />
                  <rect x="3" y="14" width="7" height="7" />
                  <rect x="14" y="14" width="7" height="7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <p>No featured projects found.</p>
          </div>
        )}

      </div>
    </section>
  );
};

export default Projects;
