import React from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import './Hero.css';
import '../components/Animations.css';
import heroImage from '../assets/images/Hero2.JPG';

const HERO_HIGHLIGHTS = [
  { label: 'Shipped products', value: '3+' },
  { label: 'Specialty', value: 'Web + mobile' },
  { label: 'Based in', value: 'Philippines' }
];

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="hero-bg-decoration"></div>
      <div className="container">
        <div className="hero-center">
          <div className="hero-avatar">
            <img
              src={heroImage}
              alt="Portrait of Cedric Joshua Palapuz"
              width={170}
              height={170}
              loading="eager"
              decoding="async"
              fetchPriority="high"
            />
          </div>
          <span className="hero-greeting"><span className="availability-dot" aria-hidden="true" />Available for select projects</span>
          <h1>
            I design the interface.<br />
            <span className="gradient-text">I engineer what’s underneath.</span>
          </h1>
          <p className="hero-tagline">Cedric Joshua Palapuz · Full-stack product developer</p>
          <p className="hero-description">
            I turn complex workflows into clear, dependable products—from polished interfaces to the systems that keep them running.
          </p>
          <div className="hero-highlights" aria-label="Profile highlights">
            {HERO_HIGHLIGHTS.map((item) => (
              <div key={item.label} className="hero-highlight-pill">
                <span className="hero-highlight-value">{item.value}</span>
                <span className="hero-highlight-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className="hero-buttons">
            <Link to="projects" smooth={true} duration={500} offset={-80} className="btn btn-primary">
              <span>Explore My Work</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <RouterLink to="/contact" className="btn btn-outline">
              <span>Start a Conversation</span>
            </RouterLink>
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <span>Scroll Down</span>
        <div className="scroll-arrow"></div>
      </div>
    </section>
  );
};

export default Hero;
