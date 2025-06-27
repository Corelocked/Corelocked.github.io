import React from 'react';
import { Link } from 'react-scroll';
import ThemeToggle from './ThemeToggle';
import './Header.css';
import { useState } from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      <div className="container">
        <div className="logo">
          <span>&lt;Cedric Palapuz /&gt;</span>
        </div>
        
        <button 
          className="menu-toggle" 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
        
        <nav className={`nav ${isMenuOpen ? 'active' : ''}`}>
          <Link to="about" smooth={true} duration={500}>About</Link>
          <Link to="skills" smooth={true} duration={500}>Skills</Link>
          <Link to="projects" smooth={true} duration={500}>Projects</Link>
          <Link to="contact" smooth={true} duration={500}>Contact</Link>
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
};

export default Header;