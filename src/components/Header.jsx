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
          <button type="button" className="nav-link" onClick={() => handleNav('about')}>About</button>
          <button type="button" className="nav-link" onClick={() => handleNav('skills')}>Skills</button>
          <RouterLink to="/projects" onClick={closeMenu} className="nav-link">Projects</RouterLink>
          <RouterLink to="/contact" onClick={closeMenu} className="nav-link">Contact</RouterLink>
          <RouterLink to="/support" onClick={closeMenu} className="nav-link nav-link-cta">Support</RouterLink>
        </nav>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </header>
    
  </>
  );
};

export default Header;