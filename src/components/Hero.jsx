import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import './Hero.css';
import '../components/Animations.css';

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="hero">
      <div className="hero-bg-decoration"></div>
      <div className="container">
        <div className={`hero-center scroll-reveal fade-up ${isLoaded ? 'visible' : ''}`}>
          <span className="hero-greeting">
            <span className="hello-wave">👋</span> Hi there
          </span>
          <h1>
            I'm <span className="gradient-text">Cedric Joshua</span>
          </h1>
          <h2 className={`hero-tagline scroll-reveal fade-up delay-200 ${isLoaded ? 'visible' : ''}`}>
            Fullstack Web & Mobile Developer
          </h2>
          <p className={`hero-description scroll-reveal fade-up delay-300 ${isLoaded ? 'visible' : ''}`}>
            I build mobile and web applications that are not only functional but also provide an engaging user experience.
          </p>
          <div className={`hero-buttons scroll-reveal fade-up delay-400 ${isLoaded ? 'visible' : ''}`}>
            <Link to="projects" smooth={true} duration={500} offset={-80} className="btn btn-primary">
              <span>View My Works</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link to="contact" smooth={true} duration={500} offset={-80} className="btn btn-outline">
              <span>Contact Me</span>
            </Link>
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