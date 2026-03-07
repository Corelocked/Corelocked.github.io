import React from 'react';
import './Resume.css';
import resumeWeb from '../assets/resumes/Resume_WebDev.pdf';
import resumeQA from '../assets/resumes/Resume_QA.pdf';
import resumeData from '../assets/resumes/Resume_DataEngineer.pdf';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

const Resume = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.2 });

  const [chooserOpen, setChooserOpen] = React.useState(false);
  const [chooserPurpose, setChooserPurpose] = React.useState('download');

  const openChooser = (purpose = 'download') => {
    setChooserPurpose(purpose);
    setChooserOpen(true);
  };

  const closeChooser = () => setChooserOpen(false);

  // Handle ESC key to close modal
  React.useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && chooserOpen) closeChooser();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chooserOpen]);

  const handleSelectResume = (fileUrl, fileName) => {
    if (chooserPurpose === 'download') {
      try {
        const a = document.createElement('a');
        a.href = fileUrl;
        a.setAttribute('download', fileName);
        a.setAttribute('target', '_blank');
        document.body.appendChild(a);
        a.click();
        a.remove();
      } catch (e) {
        window.open(fileUrl, '_blank');
      }
    } else {
      // print: open new window and trigger print when loaded
      const w = window.open(fileUrl, '_blank');
      if (w) {
        const tryPrint = () => {
          try {
            w.focus();
            w.print();
          } catch (err) {
            // ignore
          }
        };
        // Some browsers won't allow immediate print; try after load
        w.addEventListener?.('load', tryPrint);
        // fallback after 1.2s
        setTimeout(tryPrint, 1200);
      } else {
        window.open(fileUrl, '_blank');
      }
    }
    closeChooser();
  };

  return (
    <section id="resume" className="resume">
      <div className="container">
          <div className="resume-header" ref={sectionRef}>
            <span className={`section-label scroll-reveal fade-up ${isVisible ? 'visible' : ''}`}>
              Download or View
            </span>
            {/* title removed per request */}
            <div className="resume-actions">
              <button onClick={() => openChooser('download')} className="download-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Download Resume
              </button>
              <button onClick={() => openChooser('print')} className="print-btn">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 9V2h12v7"/>
                  <rect x="3" y="9" width="18" height="11" rx="2" ry="2"/>
                  <path d="M17 18H7"/>
                </svg>
                Print Resume
              </button>
            </div>

          </div>

        <div className={`resume-content scroll-reveal fade-up delay-200 ${isVisible ? 'visible' : ''}`}>
          {/* Header */}
          <header className="resume-section header-section">
            <h1>Cedric Joshua Palapuz</h1>
            <p className="contact-info">
              <span>Quezon City</span>
              <span>•</span>
              <span>cedricjoshua.palapuz@gmail.com</span>
              <span>•</span>
              <a href="https://linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </p>
          </header>

          {/* Summary */}
          <section className="resume-section">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Summary
            </h2>
            <p className="summary-card">
              Computer Science student and Lead Developer specializing in full-stack web and Android mobile development.
              Proven track record of architecting scalable solutions, integrating machine learning models, and leading technical teams to deliver user-centric applications.
              Expertise in React, Node.js, and Kotlin. Seeking to leverage advanced proficiency in full-stack web and Android development in a challenging developer role.
            </p>
          </section>

          {/* Technical Skills */}
          <section className="resume-section">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
              Technical Skills
            </h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                  Web Development
                </h3>
                <span className="skill-badge advanced">React</span>
                <span className="skill-badge advanced">Node.js</span>
                <span className="skill-badge">JavaScript</span>
                <span className="skill-badge">Laravel</span>
                <span className="skill-badge">HTML/CSS</span>
              </div>
              <div className="skill-category">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect>
                    <line x1="12" y1="18" x2="12.01" y2="18"></line>
                  </svg>
                  Mobile Development
                </h3>
                <span className="skill-badge advanced">Kotlin</span>
                <span className="skill-badge">Java</span>
                <span className="skill-badge">Flutter</span>
                <span className="skill-badge">Dart</span>
              </div>
              <div className="skill-category">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                  </svg>
                  Tools & Technologies
                </h3>
                <span className="skill-badge">GitHub</span>
                <span className="skill-badge">Firebase</span>
                <span className="skill-badge">MongoDB</span>
                <span className="skill-badge">SQLite</span>
                <span className="skill-badge">Python</span>
              </div>
              <div className="skill-category">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="20" x2="18" y2="10"></line>
                    <line x1="12" y1="20" x2="12" y2="4"></line>
                    <line x1="6" y1="20" x2="6" y2="14"></line>
                  </svg>
                  Data & Productivity
                </h3>
                <span className="skill-badge">Power BI</span>
                <span className="skill-badge">Google Workspace</span>
                <span className="skill-badge">Jupyter Notebook</span>
              </div>
            </div>
          </section>

          {/* Education */}
          <section className="resume-section">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
              </svg>
              Education
            </h2>
            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>CIIT College of Arts and Technology</h3>
                <span className="date">Expected Oct 2026</span>
              </header>
              <p className="entry-subtitle">Bachelor of Science in Computer Science</p>
              <p className="entry-detail">Specialization: Web and Mobile Development</p>
            </article>
          </section>

          {/* Experience */}
          <section className="resume-section timeline">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
              </svg>
              Experience & School Technical Projects
            </h2>
            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>Lakbay: Scenic Route Navigation</h3>
                <span className="date">Oct 2025 - Feb 2026</span>
              </header>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed a system for a mobile application that generates personalized travel routes based on curated user preferences and historical data.</li>
                <li>Architected the backend logic to handle real-time route adjustments and user profile management, ensuring a seamless user experience.</li>
              </ul>
            </article>

            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>E-TALA: Inventory Management System</h3>
                <span className="date">Oct 2025 - Nov 2025</span>
              </header>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Led the development of a mobile inventory system focused on streamlining tracking and reporting for small businesses.</li>
                <li>Implemented core features including real-time stock updates, secure user authentication, and automated inventory alerts.</li>
              </ul>
            </article>

            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>BlogShark: Blogging Website</h3>
                <span className="date">May 2025 - Aug 2025</span>
              </header>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed and designed an interactive blogging site that handles posting videos and images, in-app messaging, creation of categories and tags.</li>
                <li>Architected a system with distinct layouts and permissions for different user roles, ensuring secure and organized data distribution.</li>
                <li><strong>Featured in CIIT's social media platforms</strong> | February 4, 2026</li>
              </ul>
            </article>

            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>InnSight: AI Virtual Assistant</h3>
                <span className="date">Sep 2024 - Nov 2024</span>
              </header>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed an interactive web application designed to automate customer service inquiries for the hospitality industry.</li>
                <li>Engineered a dual-input system utilizing Python's speech recognition library for real-time voice-to-text transcription and text-based querying.</li>
                <li>Implemented Machine Learning models to achieve intent recognition and sentiment analysis.</li>
              </ul>
            </article>

            <article className="resume-entry entry-card">
              <header className="entry-header">
                <h3>Philippine Nuclear Research Institute (PNRI)</h3>
                <span className="date">February 2020</span>
              </header>
              <p className="entry-subtitle">Work Immersion Intern</p>
              <ul>
                <li>Encoded 1,000+ newspaper data records into the institutional library database using Microsoft Excel within a strict 40-hour window.</li>
              </ul>
            </article>
          </section>

          {/* Interests */}
          <section className="resume-section">
            <h2>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
              </svg>
              Interests
            </h2>
            <ul className="interests-list">
              <li><strong>Game Server Management:</strong> Experience in configuring modded servers, focusing on performance optimization and community moderation.</li>
              <li><strong>UI/UX Design:</strong> Exploring the intersection of mobile functionality and aesthetic user interfaces.</li>
            </ul>
          </section>
        </div>
      </div>
        {chooserOpen && (
          <div className="resume-modal" role="dialog" aria-modal="true">
            <div className="resume-modal__backdrop" onClick={closeChooser} />
            <div className="resume-modal__content">
              <header className="modal-header">
                <h3>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="12" y1="18" x2="12" y2="12"></line>
                    <line x1="9" y1="15" x2="15" y2="15"></line>
                  </svg>
                  Select to {chooserPurpose === 'download' ? 'Download' : 'Print'}
                </h3>
                <button className="modal-close" onClick={closeChooser} aria-label="Close">×</button>
              </header>
              <div className="modal-body">
                <button className="resume-option resume-option--webdev" onClick={() => handleSelectResume(resumeWeb, 'Cedric_Palapuz_Resume_WebDev.pdf')}>
                  <div className="resume-option__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="16 18 22 12 16 6"></polyline>
                      <polyline points="8 6 2 12 8 18"></polyline>
                    </svg>
                  </div>
                  <div className="resume-option__content">
                    <div className="resume-option__title">Web Developer</div>
                    <div className="resume-option__subtitle">Full-stack development, React & Node.js</div>
                  </div>
                </button>
                <button className="resume-option resume-option--qa" onClick={() => handleSelectResume(resumeQA, 'Cedric_Palapuz_Resume_QA.pdf')}>
                  <div className="resume-option__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <div className="resume-option__content">
                    <div className="resume-option__title">Quality Assurance</div>
                    <div className="resume-option__subtitle">Testing, automation & quality control</div>
                  </div>
                </button>
                <button className="resume-option resume-option--data" onClick={() => handleSelectResume(resumeData, 'Cedric_Palapuz_Resume_DataEngineer.pdf')}>
                  <div className="resume-option__icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <ellipse cx="12" cy="5" rx="9" ry="3"></ellipse>
                      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"></path>
                      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"></path>
                    </svg>
                  </div>
                  <div className="resume-option__content">
                    <div className="resume-option__title">Data Engineer</div>
                    <div className="resume-option__subtitle">Data pipelines, analytics & databases</div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        )}
    </section>
  );
};

export default Resume;
