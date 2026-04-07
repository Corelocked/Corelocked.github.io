import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import './AllProjects.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

import blogsharkFeaturedVideo from '../assets/images/blogshark-featured.mp4';

const VIDEO_PREVIEW_QUALITY = 'hd1080';
const EMAILJS_SERVICE_ID = 'service_18woyam';
const EMAILJS_TEMPLATE_ID = 'template_320vcsc';
const EMAILJS_PUBLIC_KEY = 'R9B6dfHNiMoceaxmX';

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

const ProjectCard = ({ project, hideDetails = false, onFeaturedClick, style }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = getVideoPreviewUrl(project.liveDemo);
  const hasVideo = isVideoDemo(project.liveDemo) || Boolean(project.preview);
  const showVideoPreview = hasVideo && (isHovered || hideDetails);
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
          alt={project.title}
          className={`${showVideoPreview ? 'hidden' : ''} ${hideDetails ? 'native-media' : ''}`.trim()}
        />
        {hasVideo && <div className="video-badge">Preview</div>}
        {!hasVideo && !project.website && !project.liveDemo && <div className="video-badge unavailable">Case Study</div>}
        {!hasVideo && project.liveDemo === '#' && project.website === '#' && <div className="video-badge unavailable">Case Study</div>}
        {showVideoPreview && (
          project.preview ? (
            <video
              className="video-preview"
              src={project.preview}
              title={`${project.title} preview`}
              controls={false}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
            />
          ) : (
            <iframe
              className="video-preview"
              src={videoUrl}
              title={`${project.title} preview`}
              frameBorder="0"
              allow="autoplay; encrypted-media"
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

const projects = [
  {
    id: 1,
    title: 'Lakbay',
    slug: 'lakbay',
    year: '2025',
    eyebrow: 'Thesis Project',
    tagline: 'A scenic travel mobile app built to make destinations feel explorable before the trip starts.',
    description: 'A scenic travel mobile app created as our thesis project with a focus on discovery, route planning, and a polished mobile experience.',
    impact: 'Led the technical direction and backend integration work while shaping the product into a cohesive thesis demo.',
    technologies: ['Kotlin', 'Python', 'Firebase'],
    category: ['Mobile App'],
    roles: ['Tech Lead', 'Backend'],
    githubLink: 'https://github.com/Corelocked/Lakbay_Prototype.git',
    liveDemo: '#',
    website: '#',
    preview: require('../assets/images/lakbay-showcase.mp4'),
    image: require('../assets/images/lakbay-logo2.png'),
    featured: true,
    isWIP: false,
    highlights: [
      'Thesis-level mobile product direction and implementation',
      'Cloud-backed data flow with Firebase',
      'Presentation-ready walkthrough and branding assets'
    ]
  },
  {
    id: 2,
    title: 'BlogShark',
    slug: 'blogshark',
    year: '2025',
    eyebrow: 'Full-Stack Web App',
    tagline: 'A blogging platform where creators can publish, connect, and surface standout content.',
    description: 'A social media platform for bloggers built from scratch using Laravel and SQLite for a dynamic web development class.',
    impact: 'Handled the full stack from UI to backend logic and shipped a functioning social product with a live website and video walkthrough.',
    technologies: ['Laravel', 'SQLite', 'JavaScript', 'CSS'],
    category: ['Website'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/dywebFinals.git',
    liveDemo: 'https://youtu.be/T-8okZkfd_0',
    website: 'https://blogshark.vercel.app/',
    image: require('../assets/images/blogshark-logo.png'),
    featured: true,
    status: 'Shipped',
    highlights: [
      'Built from scratch as a full-stack class project',
      'Live product deployed to the web',
      'Includes featured content presentation and demo flow'
    ]
  },
  {
    id: 3,
    title: 'Pitaka',
    slug: 'pitaka',
    year: '2026',
    eyebrow: 'Finance Dashboard',
    tagline: 'A personal finance app focused on clarity, fast entry, and practical day-to-day tracking.',
    description: 'A publicly available personal finance web app for tracking income, expenses, savings, wallets, and lendings with CSV export and realtime Firestore sync.',
    impact: 'Shaped the UI around practical financial workflows while wiring together deployment, realtime sync, and compact dashboard patterns.',
    technologies: ['React', 'Vite', 'Firebase', 'JavaScript', 'CSS'],
    category: ['Website', 'Mobile App'],
    roles: ['Frontend', 'Integration', 'DevOps'],
    githubLink: 'https://github.com/Corelocked/budget-book.git',
    liveDemo: 'https://pitaka-sigma.vercel.app/',
    website: 'https://pitaka-sigma.vercel.app/',
    image: require('../assets/images/pitaka-logo.png'),
    featured: true,
    status: 'Shipped',
    highlights: [
      'Realtime Firestore sync',
      'CSV export for portability',
      'Accessible dashboard and compact tables workflow'
    ]
  },
  {
    id: 17,
    title: 'NebulaDM',
    slug: 'nebuladm',
    year: '2026',
    eyebrow: 'Rust Desktop Product',
    tagline: 'A native Windows download manager that combines direct downloads, torrents, browser handoff, and privacy controls in one app.',
    description: 'NebulaDM is a Rust-first IDM-style download manager built as a multi-package workspace with a native desktop app, shared download engine, and companion browser extension.',
    impact: 'Designed and built as a systems-oriented product: direct downloads, optional real torrent engine integration, release packaging, installer flow, updater manifest, and a browser-to-desktop handoff path.',
    technologies: ['Rust', 'egui', 'reqwest', 'librqbit', 'SQLite-ready', 'Chrome Extension'],
    category: ['Desktop App', 'Browser Extension'],
    roles: ['Product Design', 'Desktop', 'Systems'],
    githubLink: 'https://github.com/Corelocked/NebulaDownloadManager.git',
    liveDemo: '#',
    website: '#',
    image: require('../assets/images/nebuladm-logo.png'),
    featured: true,
    status: 'Shipped',
    isWIP: true,
    highlights: [
      'Native Windows desktop app with queue, history, and setup flows',
      'Browser extension forwards captured downloads into the desktop app',
      'Installer packaging and manifest-driven updater flow for releases'
    ]
  },
  {
    id: 5,
    title: 'InnSight',
    slug: 'innsight',
    year: '2025',
    eyebrow: 'Voice + Text Assistant',
    tagline: 'A hospitality assistant that lets users ask hotel and restaurant questions by voice or text.',
    description: 'An interactive web application designed as a virtual assistant tool, allowing users to inquire about hotel and restaurant-related topics through voice or text input.',
    technologies: ['React', 'JavaScript', 'CSS', 'Python', 'HTML'],
    category: ['Website', 'AI/ML'],
    roles: ['Tech Lead', 'Backend'],
    githubLink: 'https://github.com/Corelocked/react-voice-enabled-ordering-system.git',
    liveDemo: 'https://innsight-mauve.vercel.app/',
    website: 'https://innsight-mauve.vercel.app/',
    image: require('../assets/images/innsight.png'),
    featured: false,
    status: 'Shipped',
    highlights: [
      'Supports voice or text-based interaction',
      'Combines frontend UI and Python-backed logic',
      'Explores conversational UX for hospitality use cases'
    ]
  },
  {
    id: 12,
    title: 'unFriendster',
    year: '2025',
    eyebrow: 'Android App',
    description: 'An attempt to create a social media app for my Android App Dev class.',
    technologies: ['Java', 'Firebase', 'XML'],
    category: ['Mobile App'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/unFriendster2.git',
    liveDemo: 'https://youtube.com/shorts/c1DHCTcY41w',
    website: '#',
    image: require('../assets/images/unfriendster.png'),
    featured: false
  },
  {
    id: 4,
    title: 'Emotion Detector',
    year: '2024',
    eyebrow: 'Computer Vision',
    description: 'A Python program that detects emotion in real time using a camera feed.',
    technologies: ['Python'],
    category: ['AI/ML', 'Desktop App'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/emotion_detector.git',
    liveDemo: 'https://youtu.be/GxW6s2Wpxaw',
    website: '#',
    image: require('../assets/images/placeholder.png'),
    featured: false
  },
  {
    id: 14,
    title: 'Ang Pagong at ang Kuneho Game',
    year: '2024',
    eyebrow: 'Recreational Game',
    description: 'A game adaptation of the Filipino fable that teaches perseverance and humility.',
    technologies: ['Python'],
    category: ['Game', 'Desktop App'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/Pagong-at-Kuneho.git',
    liveDemo: 'https://youtu.be/TzjV_CaTXyI',
    website: '#',
    image: require('../assets/images/ang_pagong_at_ang_kuneho.png'),
    featured: false
  },
  {
    id: 15,
    title: 'Moody',
    year: '2025',
    eyebrow: 'Mood Tracking App',
    description: 'An interactive web application that tracks your daily mood and provides insights based on your emotional patterns.',
    technologies: ['JavaScript', 'React', 'CSS', 'HTML'],
    category: ['Website'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/moody.git',
    liveDemo: 'https://youtu.be/L98Uc9FQ8DU',
    website: '#',
    image: require('../assets/images/moody.png'),
    featured: false
  },
  {
    id: 7,
    title: 'Tetris Game',
    year: '2024',
    eyebrow: 'Desktop Game',
    description: 'A simple Tetris game built using Java and CSS.',
    technologies: ['Java', 'CSS'],
    category: ['Game', 'Desktop App'],
    roles: ['Tech Lead', 'Backend', 'Frontend'],
    githubLink: 'https://github.com/Corelocked/Tetris.git',
    liveDemo: '#',
    website: '#',
    image: require('../assets/images/placeholder.png'),
    featured: false
  },
  {
    id: 9,
    title: 'E-Tala',
    year: '2024',
    eyebrow: 'Inventory App',
    description: 'A mobile inventory app with a barcode scanner feature.',
    technologies: ['Kotlin'],
    category: ['Mobile App'],
    roles: ['Tech Lead', 'Backend'],
    githubLink: 'https://github.com/Corelocked/E-TALA.git',
    liveDemo: '#',
    website: '#',
    image: require('../assets/images/e-tala logo.jpg'),
    featured: false
  },
  {
    id: 18,
    title: 'TaskFlow',
    slug: 'taskflow',
    year: '2026',
    eyebrow: 'Productivity Web App',
    description: 'A task management web app built to help users organize tasks, track progress, and keep day-to-day workflow moving smoothly.',
    technologies: ['React', 'JavaScript', 'CSS'],
    category: ['Website'],
    roles: ['Frontend', 'Product Design'],
    githubLink: 'https://github.com/Corelocked/taskflow.git',
    liveDemo: 'https://taskflow-pied-five.vercel.app/',
    website: 'https://taskflow-pied-five.vercel.app/',
    image: require('../assets/images/placeholder.png'),
    featured: false,
    status: 'Shipped'
  }
];

const categories = ['Top Picks', 'All', 'Website', 'Mobile App', 'Desktop App', 'Browser Extension', 'Game', 'AI/ML'];

export { projects, categories, ProjectCard };

const AllProjects = () => {
  const [activeCategory, setActiveCategory] = useState('Top Picks');
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const [showHireModal, setShowHireModal] = useState(false);
  const [hireSubmitted, setHireSubmitted] = useState(false);
  const [hireSubmitting, setHireSubmitting] = useState(false);
  const [hireError, setHireError] = useState(null);
  const [hireForm, setHireForm] = useState({
    name: '',
    email: '',
    projectType: 'Web App',
    budget: '< $500',
    timeline: '2-4 weeks',
    details: ''
  });
  const videoRef = useRef(null);
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

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && showFeaturedModal) {
        if (videoRef.current) {
          try {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
          } catch (error) {
            console.error(error);
          }
        }
        setShowFeaturedModal(false);
      }

      if (e.key === 'Escape' && showHireModal) {
        setShowHireModal(false);
      }
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showFeaturedModal, showHireModal]);

  const handleHireFormChange = (field, value) => {
    setHireForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleHireSubmit = async (e) => {
    e.preventDefault();
    setHireSubmitting(true);
    setHireError(null);

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          title: `Project Inquiry - ${hireForm.projectType}`,
          from_name: hireForm.name,
          from_email: hireForm.email,
          time: new Date().toLocaleString(),
          message:
            `Project Type: ${hireForm.projectType}\n` +
            `Budget Range: ${hireForm.budget}\n` +
            `Timeline: ${hireForm.timeline}\n\n` +
            `Project Details:\n${hireForm.details || '(No additional details provided)'}`,
        },
        EMAILJS_PUBLIC_KEY
      );

      setHireSubmitting(false);
      setHireSubmitted(true);
      setTimeout(() => {
        setShowHireModal(false);
        setHireSubmitted(false);
        setHireForm({
          name: '',
          email: '',
          projectType: 'Web App',
          budget: '< $500',
          timeline: '2-4 weeks',
          details: ''
        });
      }, 1300);
    } catch (error) {
      console.error('Hire form EmailJS error:', error);
      setHireSubmitting(false);
      setHireError('Failed to send inquiry. Please try again in a moment.');
    }
  };

  return (
    <section id="all-projects" className="all-projects">
      <div className="container">
        <div ref={headerRef} className={`projects-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}>
          <span className="section-label">Portfolio</span>
          <h2 className="section-title">
            Selected <span className="gradient-text">Works</span>
          </h2>
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
              a native download manager, a blogging platform, or a mobile thesis app.
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
            <button type="button" className="projects-cta-btn primary" onClick={() => setShowHireModal(true)}>Hire Me</button>
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
              onFeaturedClick={() => setShowFeaturedModal(true)}
              style={{ order: project.featured ? 0 : project.id }}
            />
          ))}
        </div>

        {showFeaturedModal && (
          <div
            className="about-featured-modal-backdrop"
            onClick={() => {
              if (videoRef.current) {
                try {
                  videoRef.current.pause();
                  videoRef.current.currentTime = 0;
                } catch (error) {
                  console.error(error);
                }
              }
              setShowFeaturedModal(false);
            }}
          >
            <div className="about-featured-modal" role="dialog" aria-label="BlogShark featured post" onClick={(e) => e.stopPropagation()}>
              <div className="about-featured-modal-header">
                <div>
                  <p className="about-featured-modal-title">BlogShark Featured Post</p>
                  <p className="about-featured-modal-subtitle">Preview of the actual featured post content</p>
                </div>
                <button
                  className="about-featured-close"
                  onClick={() => {
                    if (videoRef.current) {
                      try {
                        videoRef.current.pause();
                        videoRef.current.currentTime = 0;
                      } catch (error) {
                        console.error(error);
                      }
                    }
                    setShowFeaturedModal(false);
                  }}
                  aria-label="Close preview"
                >
                  ✕
                </button>
              </div>

              <div className="about-featured-media">
                <video ref={videoRef} src={blogsharkFeaturedVideo} controls autoPlay muted loop playsInline preload="metadata" />
              </div>

              <div className="about-featured-actions">
                <a href="https://www.instagram.com/p/DUVf_PRDOQG/" target="_blank" rel="noopener noreferrer" className="about-featured-link">
                  Show on Instagram
                </a>
              </div>
            </div>
          </div>
        )}

        {showHireModal && (
          <div className="projects-hire-modal-backdrop" onClick={() => setShowHireModal(false)}>
            <div className="projects-hire-modal" role="dialog" aria-label="Hire me form" onClick={(e) => e.stopPropagation()}>
              <div className="projects-hire-modal-header">
                <div>
                  <h3>Start a Project</h3>
                  <p>Share quick details and I will get back to you.</p>
                </div>
                <button type="button" className="projects-hire-close" onClick={() => setShowHireModal(false)} aria-label="Close hire form">
                  ✕
                </button>
              </div>

              <form className="projects-hire-form" onSubmit={handleHireSubmit}>
                <div className="projects-hire-row">
                  <label>
                    Name
                    <input
                      type="text"
                      value={hireForm.name}
                      onChange={(e) => handleHireFormChange('name', e.target.value)}
                      required
                    />
                  </label>
                  <label>
                    Email
                    <input
                      type="email"
                      value={hireForm.email}
                      onChange={(e) => handleHireFormChange('email', e.target.value)}
                      required
                    />
                  </label>
                </div>

                <div className="projects-hire-row">
                  <label>
                    Project Type
                    <select value={hireForm.projectType} onChange={(e) => handleHireFormChange('projectType', e.target.value)}>
                      <option>Web App</option>
                      <option>Mobile App</option>
                      <option>Web + Mobile</option>
                      <option>UI Implementation</option>
                      <option>Other</option>
                    </select>
                  </label>
                  <label>
                    Budget Range
                    <select value={hireForm.budget} onChange={(e) => handleHireFormChange('budget', e.target.value)}>
                      <option>{'< $500'}</option>
                      <option>$500 - $1,500</option>
                      <option>$1,500 - $3,000</option>
                      <option>$3,000+</option>
                    </select>
                  </label>
                  <label>
                    Timeline
                    <select value={hireForm.timeline} onChange={(e) => handleHireFormChange('timeline', e.target.value)}>
                      <option>1-2 weeks</option>
                      <option>2-4 weeks</option>
                      <option>1-2 months</option>
                      <option>Flexible</option>
                    </select>
                  </label>
                </div>

                <label>
                  Project Details
                  <textarea
                    rows="4"
                    value={hireForm.details}
                    onChange={(e) => handleHireFormChange('details', e.target.value)}
                    placeholder="What do you need built, and what is the goal?"
                  />
                </label>

                <div className="projects-hire-actions">
                  <button type="button" className="projects-cta-btn" onClick={() => setShowHireModal(false)}>Cancel</button>
                  <button type="submit" className="projects-cta-btn primary" disabled={hireSubmitting}>
                    {hireSubmitting ? 'Sending...' : 'Send Inquiry'}
                  </button>
                </div>

                {hireSubmitted && <p className="projects-hire-success">Inquiry sent successfully.</p>}
                {hireError && <p className="projects-hire-error">{hireError}</p>}
              </form>
            </div>
          </div>
        )}

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
