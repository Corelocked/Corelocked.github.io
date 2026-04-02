import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { useState, useEffect } from 'react';
import resumeWeb from '../assets/resumes/Resume_WebDev.pdf';
import resumeQA from '../assets/resumes/Resume_QA.pdf';
import resumeData from '../assets/resumes/Resume_DataEngineer.pdf';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chooserOpen, setChooserOpen] = useState(false);

  const openChooser = () => setChooserOpen(true);
  const closeChooser = () => setChooserOpen(false);

  const handleSelectResume = (fileUrl, fileName) => {
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
    closeChooser();
  };

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape' && chooserOpen) closeChooser();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [chooserOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const closeMenu = () => setIsMenuOpen(false);

  const handleNav = (target) => {
    closeMenu();
    if (location.pathname === '/') {
      const el = document.getElementById(target);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      return;
    }
    // navigate to home with hash so App can scroll on route change
    navigate(`/#${target}`);
  };

  // determine which nav item should be highlighted based on location
  const computeActiveKey = () => {
    if (location.pathname === '/' || location.pathname === '') {
      const h = (location.hash || '').replace('#', '');
      return h || 'home';
    }
    if (location.pathname.startsWith('/projects')) return 'projects';
    if (location.pathname.startsWith('/contact')) return 'contact';
    if (location.pathname.startsWith('/support')) return 'support';
    return '';
  };

  const [activeKey, setActiveKey] = useState(computeActiveKey());

  // keep activeKey in sync when the route/hash changes
  useEffect(() => {
    setActiveKey(computeActiveKey());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, location.hash]);

  // when on the home page, observe section visibility to highlight nav accordingly
  useEffect(() => {
    if (location.pathname !== '/') return undefined;

    const ids = ['home', 'about', 'projects', 'skills'];
    const observer = new IntersectionObserver(
      (entries) => {
        // pick the first intersecting entry (most visible due to rootMargin)
        const visible = entries.find((e) => e.isIntersecting);
        if (visible && visible.target && visible.target.id) {
          setActiveKey(visible.target.id || 'home');
        }
      },
      { root: null, rootMargin: '0px 0px -55% 0px', threshold: 0.25 }
    );

    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [location.pathname]);

  return (
    <>
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <button className="logo" onClick={() => handleNav('home')} aria-label="Home">
          <span className="logo-bracket">&lt;/</span>
          <span className="logo-text">Cedric</span>
          <span className="logo-bracket">&gt;</span>
        </button>
        
        <button 
          className={`menu-toggle ${isMenuOpen ? 'active' : ''}`}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <button
            type="button"
            className={`nav-link ${activeKey === 'about' ? 'active' : ''}`}
            onClick={() => handleNav('about')}
          >About</button>
          <button
            type="button"
            className={`nav-link ${activeKey === 'skills' ? 'active' : ''}`}
            onClick={() => handleNav('skills')}
          >Skills</button>
          <RouterLink
            to="/projects"
            onClick={closeMenu}
            className={`nav-link ${activeKey === 'projects' ? 'active' : ''}`}
          >Projects</RouterLink>
          <RouterLink
            to="/contact"
            onClick={closeMenu}
            className={`nav-link ${location.pathname !== '/' && activeKey === 'contact' ? 'active' : ''}`}
          >Contact</RouterLink>
          <RouterLink
            to="/support"
            onClick={closeMenu}
            className={`nav-link ${location.pathname !== '/' && activeKey === 'support' ? 'active' : ''}`}
          >Support</RouterLink>
          <button
            type="button"
            className="nav-link nav-link-cta"
            onClick={(e) => {
              e.preventDefault();
              openChooser();
              closeMenu();
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
             Resume
          </button>
        </nav>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </header>
    
    {/* Resume Chooser Modal */}
    {chooserOpen && (
      <div className="header-resume-modal" role="dialog" aria-modal="true">
        <div className="header-resume-modal__backdrop" onClick={closeChooser} />
        <div className="header-resume-modal__content">
          <header className="modal-header">
            <h3>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
                <line x1="12" y1="18" x2="12" y2="12"></line>
                <line x1="9" y1="15" x2="15" y2="15"></line>
              </svg>
              Select to Download
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
  </>
  );
};

export default Header;
