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
import inabelAwardsPreview from '../assets/images/inabel-awards-2026-innsight.jpg';
import megacatLogo from '../assets/images/megacat-logo.jpg';
import pitakaLogo from '../assets/images/pitaka-logo.png';
// Import Current Stack icons
import { ReactComponent as JavascriptIcon } from '../assets/icons/javascript.svg';
import { ReactComponent as PhpIcon } from '../assets/icons/php.svg';

const WORK_ENTRIES = [
  {
    id: 'megacat',
    badge: 'MC',
    logo: megacatLogo,
    org: 'Mega Cat Studios',
    role: 'Web Developer',
    date: 'Apr 2026 - Present',
    bullets: [
      'Manage and maintain Shopify storefronts with a focus on technical performance and user experience.',
      'Execute technical SEO work, including alt text audits and collection page title optimization.'
    ],
    tags: ['Web Development', 'Shopify', 'Technical SEO']
  },
  {
    id: 'pitaka',
    badge: 'PT',
    logo: pitakaLogo,
    org: 'Pitaka',
    role: 'Lead Developer',
    date: 'Mar 2026 - Present',
    bullets: [
      'Designed and launched a personal finance and budget tracker tailored for the Philippine market.',
      'Ported the web application to mobile platforms while keeping feature parity for on-the-go expense tracking.'
    ],
    tags: ['Project', 'Finance', 'Web', 'Mobile']
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
      'Architected backend logic for real-time route adjustments and complex user profile management.'
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
      'Designed a schema for multimedia content, categories, and tags to organize unstructured data.',
      'Architected role-based layouts and permissions for secure, organized data distribution.'
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
      'Engineered a dual-input system for real-time voice-to-text transcription and text-based querying.',
      'Implemented machine learning models to analyze sentiment and intent in customer inquiry datasets.'
    ],
    tags: ['Project', 'Inabel Awards 2026: IoT Innovation', 'AI']
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
    date: 'Expected Oct 2027',
    bullets: [
      'Specialization in Web and Mobile Development.',
      'Focus areas: full-stack systems, Android engineering, and practical product delivery.'
    ],
    tags: ['Computer Science', 'Web', 'Mobile']
  }
];

const CURRENT_STACK = [
  { name: 'Shopify', icon: <span className="current-icon-text">SF</span> },
  { name: 'PageFly', icon: <span className="current-icon-text">PF</span> },
  { name: 'WordPress', icon: <span className="current-icon-text">WP</span> },
  { name: 'Elementor', icon: <span className="current-icon-text">EL</span> },
  { name: 'PHP', icon: <PhpIcon /> },
  { name: 'JavaScript', icon: <JavascriptIcon /> },
  { name: 'Liquid', icon: <span className="current-icon-text">LQ</span> }
];

const FEATURED_PREVIEWS = {
  blogshark: {
    kind: 'video',
    title: 'BlogShark Featured Post',
    subtitle: 'Preview of the actual featured post content',
    ariaLabel: 'BlogShark featured post',
    mediaSrc: blogsharkFeaturedVideo,
    mediaAlt: 'BlogShark featured post preview',
    actionHref: 'https://www.instagram.com/p/DUVf_PRDOQG/',
    actionLabel: 'Show on Instagram'
  },
  innsight: {
    kind: 'image',
    title: 'InnSight Inabel Awards Preview',
    subtitle: 'Preview of the Inabel Awards 2026: IoT Innovation entry',
    ariaLabel: 'InnSight Inabel Awards preview',
    mediaSrc: inabelAwardsPreview,
    mediaAlt: 'Inabel Awards 2026: IoT Innovation preview for InnSight',
    actionHref: '/projects/innsight/info',
    actionLabel: 'Open Project'
  }
};

const TimelineTabs = () => {
  const [activeTab, setActiveTab] = useState('work');
  const [preview, setPreview] = useState(null);
  const videoRef = useRef(null);
  const entries = activeTab === 'work' ? WORK_ENTRIES : EDUCATION_ENTRIES;

  const openPreview = (entryId) => {
    setPreview(FEATURED_PREVIEWS[entryId]);
  };

  const closePreview = () => {
    if (videoRef.current) {
      try {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      } catch (e) {}
    }
    setPreview(null);
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape' && preview) closePreview();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [preview]);

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
                  const previewEntry = FEATURED_PREVIEWS[entry.id];
                  const isPreviewTag = previewEntry && ((entry.id === 'blogshark' && tag === 'Featured') || (entry.id === 'innsight' && tag === 'Inabel Awards 2026: IoT Innovation'));

                  if (isPreviewTag) {
                    return (
                      <button
                        key={`${entry.id}-${tag}`}
                        type="button"
                        className="about-timeline-tag about-timeline-tag-featured"
                        onClick={() => openPreview(entry.id)}
                        aria-expanded={preview?.ariaLabel === previewEntry.ariaLabel}
                        aria-label={`Open ${previewEntry.title}`}
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

      {preview && (
        <div
          className="about-featured-modal-backdrop"
          onClick={closePreview}
        >
          <div className="about-featured-modal" role="dialog" aria-label={preview.ariaLabel} onClick={(e) => e.stopPropagation()}>
            <div className="about-featured-modal-header">
              <div>
                <p className="about-featured-modal-title">{preview.title}</p>
                <p className="about-featured-modal-subtitle">{preview.subtitle}</p>
              </div>
              <button className="about-featured-close" onClick={closePreview} aria-label="Close preview">✕</button>
            </div>

            <div className="about-featured-media">
              {preview.kind === 'video' ? (
                <video
                  ref={videoRef}
                  src={preview.mediaSrc}
                  controls
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img src={preview.mediaSrc} alt={preview.mediaAlt} loading="lazy" decoding="async" />
              )}
            </div>

            <div className="about-featured-actions">
              <a
                href={preview.actionHref}
                target="_blank"
                rel="noopener noreferrer"
                className="about-featured-link"
              >
                {preview.actionLabel}
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
                <img
                  src={about}
                  alt="Cedric Joshua Palapuz profile"
                  width={160}
                  height={160}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            </div>

            <div className="about-intro">
              <p className="lead-text">
                I'm a Computer Science student from the Philippines and a Web Developer specializing in Data Engineering and Full-Stack Architecture.
                I design scalable database solutions, real-time reporting systems, and user-focused products across web and mobile.
              </p>
              <p className="lead-subtext">
                I have experience designing and implementing complex systems from finance dashboards and route engines to AI-powered virtual assistants and Shopify storefronts.
                Based in the Philippines, I bring a practical and globally minded approach to building digital products.
                I work across both Firebase and Supabase depending on the product, and I'm passionate about maintainable code, practical product thinking, and solving real-world problems through technology.
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
          <p className="current-stack-subtitle">
            Shopify, PageFly, WordPress, Elementor, PHP, JavaScript, and Liquid for storefront and CMS development.
          </p>
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
