    import React, { useState, useEffect, useRef } from 'react';
import './About.css';
import '../components/Animations.css';
import about from '../assets/images/Hero.png';
import useScrollReveal from '../hooks/useScrollReveal';
import ciitLogo from '../assets/images/ciit-logo.png';
import pnriLogo from '../assets/images/pnri-logo.png';
import lakbayLogo from '../assets/images/lakbay-logo.png';
import etalaLogo from '../assets/images/e-tala logo.jpg';
import blogsharkLogo from '../assets/images/blogshark-logo.png';
import blogsharkFeaturedVideo from '../assets/images/blogshark-featured.mp4';
import innsightLogo from '../assets/images/innsight.png';
import megacatLogo from '../assets/images/megacat-logo.jpg';
// Import Current Stack icons
import { ReactComponent as ReactIcon } from '../assets/icons/react.svg';
import { ReactComponent as TailwindIcon } from '../assets/icons/tailwind.svg';
import { ReactComponent as PythonIcon } from '../assets/icons/python.svg';
import { ReactComponent as GitIcon } from '../assets/icons/github.svg';
import { ReactComponent as FirebaseIcon } from '../assets/icons/firebase.svg';
import { ReactComponent as VercelIcon } from '../assets/icons/vercel.svg';

const WORK_ENTRIES = [
  {
    id: 'megacat',
    badge: 'MC',
    logo: megacatLogo,
    org: 'Mega Cat Studios',
    role: 'Incoming Web Developer Intern',
    date: 'Starts April 2026',
    bullets: [
      'Joining the team as a Web Developer Intern to contribute to web experiences and front-end implementation.',
      'Preparing to support production tasks, collaboration workflows, and feature delivery in a professional development environment.'
    ],
    tags: ['Internship', 'Web Development', 'Incoming']
  },
  {
    id: 'lakbay',
    badge: 'LK',
    logo: lakbayLogo,
    org: 'Lakbay: Scenic Route Navigation',
    role: 'Technical Lead',
    date: 'Oct 2025 - Feb 2026',
    bullets: [
      'Developed a route generation system based on traveler preferences and historical data.',
      'Architected backend logic for real-time route updates and profile management.'
    ],
    tags: ['Project', 'Mobile', 'Backend', 'Thesis']
  },
  {
    id: 'e-tala',
    badge: 'ET',
    logo: etalaLogo,
    org: 'E-TALA: Inventory Management System',
    role: 'Technical Lead',
    date: 'Oct 2025 - Nov 2025',
    bullets: [
      'Led development of a mobile inventory platform for small businesses.',
      'Implemented secure auth, realtime stock updates, and automated alerts.'
    ],
    tags: ['Project', 'Kotlin', 'Firebase']
  },
  {
    id: 'blogshark',
    badge: 'BS',
    logo: blogsharkLogo,
    org: 'BlogShark: Blogging Website',
    role: 'Technical Lead',
    date: 'May 2025 - Aug 2025',
    bullets: [
      'Built an interactive blogging platform with media posting and in-app communication.',
      'Designed role-based layouts and permission controls for secure content flow.'
    ],
    tags: ['Project', 'Laravel', 'SQLite', 'Featured']
  },
  {
    id: 'innsight',
    badge: 'IN',
    logo: innsightLogo,
    org: 'InnSight: AI Virtual Assistant',
    role: 'Technical Lead',
    date: 'Sep 2024 - Nov 2024',
    bullets: [
      'Built a voice and text assistant for hospitality customer support.',
      'Integrated speech recognition and ML models for intent and sentiment analysis.'
    ],
    tags: ['Project', 'AI', 'React', 'Python']
  },
  {
    id: 'pnri',
    badge: 'PN',
    logo: pnriLogo,
    org: 'Philippine Nuclear Research Institute (PNRI)',
    role: 'Work Immersion Intern',
    date: 'Feb 2020',
    bullets: [
      'Encoded 1,000+ newspaper records into the institutional database in a 40-hour window.'
    ],
    tags: ['Internship']
  }
];

const EDUCATION_ENTRIES = [
  {
    id: 'ciit',
    badge: 'CI',
    logo: ciitLogo,
    org: 'CIIT College of Arts and Technology',
    role: 'Bachelor of Science in Computer Science',
    date: 'Expected Oct 2026',
    bullets: [
      'Specialization in Web and Mobile Development.',
      'Focus areas: full-stack systems, Android engineering, and practical product delivery.'
    ],
    tags: ['Computer Science', 'Web', 'Mobile']
  }
];

const CURRENT_STACK = [
  { name: 'React', icon: <ReactIcon /> },
  { name: 'Tailwind CSS', icon: <TailwindIcon /> },
  { name: 'Python', icon: <PythonIcon /> },
  { name: 'Git/GitHub', icon: <GitIcon /> },
  { name: 'Firebase', icon: <FirebaseIcon /> },
  { name: 'Vercel', icon: <VercelIcon /> }
];

const TimelineTabs = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [showFeaturedModal, setShowFeaturedModal] = useState(false);
  const videoRef = useRef(null);
  const entries = activeTab === 'work' ? WORK_ENTRIES : EDUCATION_ENTRIES;

  const openFeaturedModal = () => {
    setShowFeaturedModal(true);
  };

  const closeFeaturedModal = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
    setShowFeaturedModal(false);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && showFeaturedModal) closeFeaturedModal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [showFeaturedModal]);

  return (
    <div className="about-timeline-shell">
      <div className="about-timeline-tabs" role="tablist" aria-label="Experience categories">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'work'}
          className={`about-timeline-tab ${activeTab === 'work' ? 'active' : ''}`}
          onClick={() => setActiveTab('work')}
        >
          Work
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'education'}
          className={`about-timeline-tab ${activeTab === 'education' ? 'active' : ''}`}
          onClick={() => setActiveTab('education')}
        >
          Education
        </button>
      </div>

      <div className="about-timeline-track">
        {entries.map((entry) => (
          <article key={entry.id} className="about-timeline-item">
            <div className="about-timeline-marker" aria-hidden="true">
              {entry.logo ? (
                <img src={entry.logo} alt={`${entry.org} logo`} />
              ) : (
                <span>{entry.badge}</span>
              )}
            </div>

            <div className="about-timeline-card">
              <header className="about-timeline-card-header">
                <div>
                  <h4 className="about-timeline-org">{entry.org}</h4>
                  <p className="about-timeline-role">{entry.role}</p>
                </div>
                <span className="about-timeline-date">{entry.date}</span>
              </header>

              <ul className="about-timeline-bullets">
                {entry.bullets.map((item, index) => (
                  <li key={`${entry.id}-${index}`}>{item}</li>
                ))}
              </ul>

              <div className="about-timeline-tags" aria-label="skills and labels">
                {entry.tags.map((tag) => {
                  const isBlogsharkFeatured = entry.id === 'blogshark' && tag === 'Featured';

                  if (isBlogsharkFeatured) {
                    return (
                      <button
                        key={`${entry.id}-${tag}`}
                        type="button"
                        className="about-timeline-tag about-timeline-tag-featured"
                        onClick={openFeaturedModal}
                        aria-expanded={showFeaturedModal}
                        aria-label="Open BlogShark featured video"
                      >
                        {tag}
                      </button>
                    );
                  }

                  return (
                    <span key={`${entry.id}-${tag}`} className="about-timeline-tag">
                      {tag}
                    </span>
                  );
                })}
              </div>
            </div>
          </article>
        ))}
      </div>

      {showFeaturedModal && (
        <div
          className="about-featured-modal-backdrop"
          onClick={closeFeaturedModal}
        >
          <div className="about-featured-modal" role="dialog" aria-label="BlogShark featured post" onClick={(e) => e.stopPropagation()}>
            <div className="about-featured-modal-header">
              <div>
                <p className="about-featured-modal-title">BlogShark Featured Post</p>
                <p className="about-featured-modal-subtitle">Preview of the actual featured post content</p>
              </div>
              <button className="about-featured-close" onClick={closeFeaturedModal} aria-label="Close preview">✕</button>
            </div>

            <div className="about-featured-media">
              <video
                ref={videoRef}
                src={blogsharkFeaturedVideo}
                controls
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              />
            </div>

            <div className="about-featured-actions">
              <a
                href="https://www.instagram.com/p/DUVf_PRDOQG/"
                target="_blank"
                rel="noopener noreferrer"
                className="about-featured-link"
              >
                Show on Instagram
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const About = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.2 });
  const leftRef = useRef(null);
  const rightRef = useRef(null);

  useEffect(() => {
    const applyMatch = () => {
      if (!leftRef.current || !rightRef.current) return;
      const leftHeight = leftRef.current.offsetHeight;
      // set maxHeight on right panel to match left and allow scrolling
      rightRef.current.style.maxHeight = `${leftHeight}px`;
      rightRef.current.style.overflow = 'auto';
      rightRef.current.style.overflowX = 'hidden';
    };

    // Initial apply
    applyMatch();

    // Recompute on resize
    window.addEventListener('resize', applyMatch);
    // Also observe mutations in left panel to update when content changes
    const ro = new MutationObserver(applyMatch);
    if (leftRef.current) ro.observe(leftRef.current, { childList: true, subtree: true, characterData: true });

    return () => {
      window.removeEventListener('resize', applyMatch);
      ro.disconnect();
    };
  }, []);

  return (
    <section id="about" className="about">
      <div className="about-bg-decoration"></div>
      <div className="container">
        <div className="about-header" ref={sectionRef}>
          <span className={`section-label scroll-reveal fade-up ${isVisible ? 'visible' : ''}`}>
            Get to know me
          </span>
          <h2 className={`section-title scroll-reveal fade-up delay-100 ${isVisible ? 'visible' : ''}`}>
            About <span className="gradient-text">Me</span>
          </h2>
        </div>

        <div className="about-content-grid">
          <div ref={leftRef} className={`about-left-panel scroll-reveal fade-right delay-200 ${isVisible ? 'visible' : ''}`}>
            <div className="about-avatar">
              <div className="avatar-frame">
                <img src={about} alt="Cedric Joshua" width={160} height={160} />
              </div>
            </div>

            <div className="about-intro">
              <p className="lead-text">
                I'm a Computer Science student from the Philippines, specializing in Full-stack Web and Android mobile development.
                I architect scalable solutions using React, Node.js, and Kotlin, with proven expertise in integrating machine learning models and building user-centric applications.
              </p>
              <p className="lead-subtext">
                I have 4+ years of experience designing and implementing complex systems from realtime inventory platforms to AI-powered virtual assistants.
                Based in the Philippines, I bring a practical and globally minded approach to building digital products.
                I'm passionate about maintainable code, practical product thinking, and solving real-world problems through technology.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <span className="highlight-icon">PS</span>
                <span>Problem Solver</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">CT</span>
                <span>Creative Thinker</span>
              </div>
              <div className="highlight-item">
                <span className="highlight-icon">FL</span>
                <span>Fast Learner</span>
              </div>
            </div>
          </div>

          <div ref={rightRef} className={`about-right-panel scroll-reveal fade-left delay-300 ${isVisible ? 'visible' : ''}`}>
            <div className="about-timeline">
              <TimelineTabs />
            </div>
          </div>
        </div>

        {/* Current Stack Footer */}
        <div className="current-stack-footer">
          <h3 className="current-stack-title">Current Stack</h3>
          <div className="current-stack-list">
            {CURRENT_STACK.map((tech, i) => (
              <div
                key={`stack-${i}`}
                className="current-item"
                role="button"
                tabIndex={0}
              >
                <span className="current-icon">{tech.icon}</span>
                <span className="current-label">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
