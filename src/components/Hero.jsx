import React, { useEffect, useState } from 'react';
import { Link } from 'react-scroll';
import { Link as RouterLink } from 'react-router-dom';
import './Hero.css';
import '../components/Animations.css';
import heroImage from '../assets/images/Hero2.JPG';

const ROLES = ['Web Developer', 'Android Developer'];
const HERO_HIGHLIGHTS = [
  { label: 'Published apps', value: '3+' },
  { label: 'Focus', value: 'Web + Mobile' },
  { label: 'Next step', value: 'Web Dev Intern' }
];

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [roleIndex, setRoleIndex] = useState(0);
  const [typedRole, setTypedRole] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const currentRole = ROLES[roleIndex];
    const doneTyping = typedRole === currentRole;
    const doneDeleting = typedRole === '';

    let delay = isDeleting ? 55 : 95;
    if (!isDeleting && doneTyping) delay = 1100;
    if (isDeleting && doneDeleting) delay = 250;

    const timer = setTimeout(() => {
      if (!isDeleting && !doneTyping) {
        setTypedRole(currentRole.slice(0, typedRole.length + 1));
        return;
      }

      if (!isDeleting && doneTyping) {
        setIsDeleting(true);
        return;
      }

      if (isDeleting && !doneDeleting) {
        setTypedRole(currentRole.slice(0, typedRole.length - 1));
        return;
      }

      setIsDeleting(false);
      setRoleIndex((prev) => (prev + 1) % ROLES.length);
    }, delay);

    return () => clearTimeout(timer);
  }, [typedRole, isDeleting, roleIndex]);

  return (
    <section id="home" className="hero">
      <div className="hero-bg-decoration"></div>
      <div className="container">
        <div className={`hero-center scroll-reveal fade-up ${isLoaded ? 'visible' : ''}`}>
          <div className="hero-avatar" aria-hidden="true">
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
          <span className="hero-greeting">
            <span className="hello-wave">👋</span> Hi there
          </span>
          <h1>
            I'm <span className="gradient-text">Cedric Joshua Palapuz</span>
          </h1>
          <h2 className={`hero-tagline scroll-reveal fade-up delay-200 ${isLoaded ? 'visible' : ''}`}>
            <span className="hero-typewriter-label">Fullstack </span>
            <span className="hero-typewriter-text">{typedRole}</span>
            <span className="hero-typewriter-caret" aria-hidden="true">|</span>
          </h2>
          <p className={`hero-description scroll-reveal fade-up delay-300 ${isLoaded ? 'visible' : ''}`}>
            I build mobile and web applications that are not only functional but also provide an engaging user experience.
          </p>
          <div className={`hero-highlights scroll-reveal fade-up delay-350 ${isLoaded ? 'visible' : ''}`}>
            {HERO_HIGHLIGHTS.map((item) => (
              <div key={item.label} className="hero-highlight-pill">
                <span className="hero-highlight-value">{item.value}</span>
                <span className="hero-highlight-label">{item.label}</span>
              </div>
            ))}
          </div>
          <div className={`hero-buttons scroll-reveal fade-up delay-400 ${isLoaded ? 'visible' : ''}`}>
            <Link to="projects" smooth={true} duration={500} offset={-80} className="btn btn-primary">
              <span>View My Works</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <RouterLink to="/contact" className="btn btn-outline">
              <span>Contact Me</span>
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
