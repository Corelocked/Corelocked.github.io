import React from 'react';
import { Link } from 'react-scroll';
import ThemeToggle from './ThemeToggle';
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <Link to="home" smooth={true} duration={500} className="logo">
          <span className="logo-bracket">&lt;</span>
          <span className="logo-text">Cedric</span>
          <span className="logo-bracket">/&gt;</span>
        </Link>
        
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
          <Link to="about" smooth={true} duration={500} onClick={closeMenu} className="nav-link">About</Link>
          <Link to="skills" smooth={true} duration={500} onClick={closeMenu} className="nav-link">Skills</Link>
          <Link to="projects" smooth={true} duration={500} onClick={closeMenu} className="nav-link">Projects</Link>
          <Link to="contact" smooth={true} duration={500} onClick={closeMenu} className="nav-link nav-link-cta">Contact</Link>
          <ThemeToggle />
        </nav>
      </div>
      
      {/* Mobile menu overlay */}
      {isMenuOpen && <div className="nav-overlay" onClick={closeMenu}></div>}
    </header>
  );
};

export default Header;