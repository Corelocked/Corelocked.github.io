import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-logo">
            <span>&lt;Cedric Joshua Palapuz /&gt;</span>
          </div>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#skills">Skills</a>
            <a href="#projects">Projects</a>
            <a href="#contact">Contact</a>
          </div>
          <div className="footer-social">
            <a href="#" target="_blank" rel="noopener noreferrer">GitHub</a>
            <a href="#" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            <a href="#" target="_blank" rel="noopener noreferrer">Twitter</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Your Name. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;