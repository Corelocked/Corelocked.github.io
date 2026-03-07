import React from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import { useState, useEffect } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

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

    const ids = ['home', 'about', 'skills'];
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
            className={`nav-link ${location.pathname !== '/' && activeKey === 'projects' ? 'active' : ''}`}
          >Projects</RouterLink>
          <RouterLink
            to="/contact"
            onClick={closeMenu}
            className={`nav-link ${location.pathname !== '/' && activeKey === 'contact' ? 'active' : ''}`}
          >Contact</RouterLink>
          <RouterLink
            to="/support"
            onClick={closeMenu}
            className={`nav-link nav-link-cta ${location.pathname !== '/' && activeKey === 'support' ? 'active' : ''}`}
          >Support</RouterLink>
        </nav>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </header>
    
  </>
  );
};

export default Header;