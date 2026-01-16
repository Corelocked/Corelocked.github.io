import React, { useEffect, useState } from 'react';
import './Hero.css';
import '../components/Animations.css';
import hero from '../assets/images/Hero2.JPG';

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
        <div className={`hero-content scroll-reveal fade-left ${isLoaded ? 'visible' : ''}`}>
          <span className="hero-greeting">👋 Welcome to my portfolio</span>
          <h1>Hi, I'm <span className="gradient-text">Cedric Joshua Palapuz</span></h1>
          <h2 className={`hero-tagline scroll-reveal fade-up delay-200 ${isLoaded ? 'visible' : ''}`}>
            <span className="tagline-prefix">I'm an</span> Android <span className="tagline-prefix">and</span> Full Stack Developer
          </h2>
          <p className={`hero-description scroll-reveal fade-up delay-300 ${isLoaded ? 'visible' : ''}`}>
            I build mobile and web applications that are not only functional but also provide an engaging user experience. Let's create something amazing together!
          </p>
          <div className={`hero-buttons scroll-reveal fade-up delay-400 ${isLoaded ? 'visible' : ''}`}>
            <a href="#projects" className="btn btn-primary">
              <span>View My Works</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </a>
            <a href="#contact" className="btn btn-outline">
              <span>Contact Me</span>
            </a>
          </div>
          <div className={`hero-stats scroll-reveal fade-up delay-500 ${isLoaded ? 'visible' : ''}`}>
            <div className="stat-item">
              <span className="stat-number">4+</span>
              <span className="stat-label">Years Academic Experience</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Projects Completed</span>
            </div>
          </div>
        </div>
        <div className="hero-image-wrapper">
          <div className="hero-image-decoration"></div>
          <div className="hero-image-decoration hero-image-decoration-2"></div>
          <div className={`hero-image scroll-reveal fade-right delay-300 ${isLoaded ? 'visible' : ''}`}>
            <div className="image-frame">
              <img src={hero} alt="Hero" width={400} height={400}/>
              <div className="image-overlay"></div>
            </div>
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