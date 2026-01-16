import React, { useState, useRef } from 'react';
import './Projects.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

// Helper function to convert video URLs to embeddable preview URLs with autoplay
const getVideoPreviewUrl = (url) => {
  if (!url || url === '#') return null;
  
  // Check if it's a YouTube link (various formats)
  const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]+)/);
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${youtubeMatch[1]}&controls=0&showinfo=0&rel=0`;
  }
  
  // Check if it's a Google Drive link (fallback)
  const driveMatch = url.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) {
    return `https://drive.google.com/file/d/${driveMatch[1]}/preview?autoplay=1&mute=1`;
  }
  
  return null;
};

// Check if URL is a video demo (YouTube or Google Drive)
const isVideoDemo = (url) => {
  if (!url || url === '#') return false;
  return url.includes('youtube.com') || url.includes('youtu.be') || url.includes('drive.google.com/file/d/');
};

// ProjectCard component with video hover functionality
const ProjectCard = ({ project }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoUrl = getVideoPreviewUrl(project.liveDemo);
  const hasVideo = isVideoDemo(project.liveDemo);

  return (
    <div 
      className={`project-card ${project.featured ? 'featured' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image/Video Container */}
      <div className="project-image">
        <img 
          src={project.image} 
          alt={project.title}
          className={hasVideo && isHovered ? 'hidden' : ''}
        />
        
        {/* Video Preview */}
        {hasVideo && (
          <div className="video-badge">Preview</div>
        )}
        {hasVideo && isHovered && (
          <iframe
            className="video-preview"
            src={videoUrl}
            title={`${project.title} preview`}
            frameBorder="0"
            allow="autoplay; encrypted-media"
            allowFullScreen
          />
        )}
        
        <div className={`image-overlay ${isHovered && hasVideo ? 'video-active' : ''}`}>
          <div className="overlay-links">
            {project.category.includes('Creative Design') ? (
              <>
                {project.canvaLink && project.canvaLink !== '#' && (
                  <a 
                    href={project.canvaLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="overlay-btn"
                    aria-label="View on Canva"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                    </svg>
                  </a>
                )}
                {project.viewImage && (
                  <a 
                    href={project.image} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="overlay-btn"
                    aria-label="View Image"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                  </a>
                )}
              </>
            ) : (
              <>
                <a 
                  href={project.githubLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="overlay-btn"
                  aria-label="View GitHub"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                {project.liveDemo !== '#' && (
                  <a 
                    href={project.liveDemo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="overlay-btn"
                    aria-label="View Demo"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                )}
              </>
            )}
          </div>
        </div>
        {/* Category Badges */}
        <div className="project-categories">
          {project.category.map((cat, index) => (
            <span key={index} className="project-category">{cat}</span>
          ))}
        </div>
      </div>

      {/* Project Info */}
      <div className="project-info">
        <h3 className="project-title">{project.title}</h3>
        <p className="project-description">{project.description}</p>
        
        <div className="project-technologies">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">{tech}</span>
          ))}
        </div>

        <div className="project-footer">
          {project.category.includes('Creative Design') ? (
            <>
              {project.canvaLink && project.canvaLink !== '#' && (
                <a 
                  href={project.canvaLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                  </svg>
                  View on Canva
                </a>
              )}
              {project.viewImage && (
                <a 
                  href={project.image} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  View Image
                </a>
              )}
            </>
          ) : (
            <>
              <a 
                href={project.githubLink} 
                target="_blank" 
                rel="noopener noreferrer"
                className="project-link"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                View Code
              </a>
              {project.liveDemo !== '#' && (
                <a 
                  href={project.liveDemo} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="project-link primary"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                  Live Demo
                </a>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const projects = [
  {
    id: 1,
    title: 'InnSight',
    description: 'An interactive web application designed as a virtual assistant tool, allowing users to inquire about hotel and restaurant-related topics through voice or text input.',
    technologies: ['React', 'Javascript', 'CSS', 'Python', 'HTML'],
    category: ['Web App','AI/ML'],
    githubLink: 'https://github.com/Corelocked/react-voice-enabled-ordering-system.git',
    liveDemo: 'https://voice-order-assistant.web.app/',
    image: require('../assets/images/innsight.png'),
    featured: true
  },
  {
    id: 2,
    title: 'unFriendster',
    description: 'An attempt to create a social media app for my Android App Dev class.',
    technologies: ['Java', 'Firebase', 'XML'],
    category: ['Mobile App'],
    githubLink: 'https://github.com/Corelocked/unFriendster2.git',
    liveDemo: 'https://youtube.com/shorts/c1DHCTcY41w',
    image: require('../assets/images/unfriendster.png'),
    featured: true
  },
  {
    id: 3,
    title: 'Ang Pagong at ang Kuneho Game',
    description: 'A recreational game about the story "Ang Pagong at ang Kuneho", a classic Filipino fable that teaches the value of perseverance and humility.',
    technologies: ['Python'],
    category: ['Game'],
    githubLink: 'https://github.com/Corelocked/Pagong-at-Kuneho.git',
    liveDemo: 'https://youtu.be/TzjV_CaTXyI',
    image: require('../assets/images/ang_pagong_at_ang_kuneho.png'),
    featured: true
  },
  {
    id: 4,
    title: 'Emotion Detector',
    description: 'A program I made using Python that detects your emotion in real-time using a camera.',
    technologies: ['Python'],
    category: ['AI/ML'],
    githubLink: 'https://github.com/Corelocked/emotion_detector.git',
    liveDemo: 'https://youtu.be/GxW6s2Wpxaw',
    image: require('../assets/images/emotion-detector.jpg'),
    featured: false
  },
  {
    id: 5,
    title: 'Moody',
    description: 'An interactive web application that tracks your daily mood and provides insights based on your emotional patterns.',
    technologies: ['Javascript', 'React', 'CSS', 'HTML'],
    category: ['Web App'],
    githubLink: 'https://github.com/Corelocked/moody.git',
    liveDemo: 'https://youtu.be/L98Uc9FQ8DU',
    image: require('../assets/images/moody.png'),
    featured: false
  },
  // {
  //   id: 6,
  //   title: 'Academic Evaluator',
  //   description: 'A program that evaluates the grades of a student',
  //   technologies: ['Java'],
  //   category: ['Desktop App'],
  //   githubLink: 'https://drive.google.com/drive/folders/1-0zRNomH_1Z5W1lYjkLb_s8lToHQ2vbg?usp=drive_link',
  //   liveDemo: '#',
  //   image: require('../assets/images/placeholder.png'),
  //   featured: false
  // },
  {
    id: 7,
    title: 'Tetris Game',
    description: 'A simple Tetris game made using Java and CSS',
    technologies: ['Java', 'CSS'],
    category: ['Game'],
    githubLink: 'https://github.com/Corelocked/Tetris.git',
    liveDemo: '#',
    image: require('../assets/images/placeholder.png'),
    featured: false
  },
  // {
  //   id: 8,
  //   title: 'POS',
  //   description: 'Point of Sale System',
  //   technologies: ['Java', 'CSS'],
  //   category: ['Desktop App'],
  //   githubLink: 'https://drive.google.com/drive/folders/1xMCH3Nzf1dldIWluI0p3IDfUYTJftDNP?usp=drive_link',
  //   liveDemo: '#',
  //   image: require('../assets/images/placeholder.png'),
  //   featured: false
  // },
  {
    id: 9,
    title: 'E-Tala',
    description: 'A mobile inventory app with barcode scanner feature',
    technologies: ['Kotlin'],
    category: ['Mobile App'],
    githubLink: 'https://github.com/Corelocked/E-TALA.git',
    liveDemo: '#',
    image: require('../assets/images/e-tala logo.jpg'),
    featured: false
  },
  {
    id: 10,
    title: 'DOST website Redesign',
    description: 'A redesign of the Department of Science and Technology (DOST) website using Canva. Created for a web design class project.',
    technologies: ['Canva'],
    category: ['Creative Design'],
    canvaLink: 'https://www.canva.com/design/DAG2bUOs0xA/1UyWpP2ibUgTOVAQeM9gRQ/edit?utm_content=DAG2bUOs0xA&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    image: require('../assets/images/dost-website-redesign.png'),
    featured: false
  },
  {
    id: 11,
    title: 'Lakbay Logo Design',
    description: 'A logo design for "Lakbay", our Thesis project about a scenic travel mobile app. Created using Canva.',
    technologies: ['Canva', 'Photoshop'],
    category: ['Creative Design'],
    canvaLink: 'https://www.canva.com/design/DAG3DY7iccM/gGWzD2lJDBGp3n9ekzTcMw/edit?utm_content=DAG3DY7iccM&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton',
    image: require('../assets/images/lakbay-logo.png'),
    featured: false
  },
  {
    id: 12,
    title: 'Lakbay (Work in Progress)',
    description: 'A scenic travel mobile app. Created as our Thesis project.',
    technologies: ['Kotlin','Python','Firebase'],
    category: ['Mobile App'],
    githubLink: 'https://github.com/Corelocked/Lakbay_Prototype.git',
    liveDemo: '#',
    image: require('../assets/images/lakbay-logo2.png'),
    featured: false
  },
  {
    id: 13,
    title: 'BlogShark',
    description: 'A social media platform for bloggers to share and connect. Made completely from scratch using Laravel and SQLite for my Dynamic Web Dev class.',
    technologies: ['Laravel', 'SQLite', 'JavaScript', 'CSS'],
    category: ['Website'],
    githubLink: 'https://github.com/Corelocked/dywebFinals.git',
    liveDemo: 'https://youtu.be/T-8okZkfd_0',
    image: require('../assets/images/blogshark-logo.png'),
    featured: true
  },
    {
    id: 13,
    title: 'Delirium',
    description: 'A Short film I edited using Premiere Pro for my Social Issues class.',
    technologies: ['Premiere Pro'],
    category: ['Film Editing','Creative Design'],
    githubLink: '#',
    liveDemo: 'https://youtu.be/TAJ7gHYPAGI',
    image: require('../assets/images/blogshark-logo.png'),
    featured: true
  },
];

const categories = ['All', 'Web App', 'Mobile App', 'Desktop App', 'Game', 'AI/ML', 'Creative Design'];

const Projects = () => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [headerRef, isHeaderVisible] = useScrollReveal({ threshold: 0.2 });
  const [filterRef, isFilterVisible] = useScrollReveal({ threshold: 0.3 });
  const [gridRef, isGridVisible] = useScrollReveal({ threshold: 0.05 });

  const filteredProjects = activeCategory === 'All' 
    ? projects 
    : projects.filter(project => project.category.includes(activeCategory));

  return (
    <section id="projects" className="projects">
      {/* Background decoration */}
      <div className="projects-bg-decoration"></div>
      <div className="projects-bg-decoration-2"></div>
      
      <div className="container">
        {/* Section Header */}
        <div 
          ref={headerRef}
          className={`projects-header scroll-reveal fade-up ${isHeaderVisible ? 'visible' : ''}`}
        >
          <span className="section-label">
            <span className="label-icon">💼</span>
            Portfolio
          </span>
          <h2 className="section-title">
            Featured <span className="gradient-text">Projects</span>
          </h2>
          <p className="section-subtitle">
            A collection of projects that showcase my skills and passion for development
          </p>
        </div>

        {/* Category Filter */}
        <div 
          ref={filterRef}
          className={`projects-filter scroll-reveal fade-up ${isFilterVisible ? 'visible' : ''}`}
        >
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

        {/* Projects Grid */}
        <div 
          ref={gridRef}
          className={`projects-grid stagger-children ${isGridVisible ? 'visible' : ''}`}
        >
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* Empty State */}
        {filteredProjects.length === 0 && (
          <div className="projects-empty">
            <p>No projects found in this category.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;