import React from 'react';
import './About.css';
import '../components/Animations.css';
import about from '../assets/images/Hero.png';
import useScrollReveal from '../hooks/useScrollReveal';

const About = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.2 });

  return (
    <section id="about" className="about">
      <div className="about-bg-decoration"></div>
      <div className="container">
        <div className="about-header" ref={sectionRef}>
          <span className={`section-label scroll-reveal fade-up ${isVisible ? 'visible' : ''}`}>
            Get to know me
          </span>
          <h2 className={`section-title scroll-reveal fade-up delay-100 ${isVisible ? 'visible' : ''}`}>
            About <span className="gradient-text">Me</span>
          </h2>
        </div>

        {/* Centered profile image */}
        <div className={`about-avatar scroll-reveal fade-up delay-200 ${isVisible ? 'visible' : ''}`}>
          <div className="avatar-frame">
            <img src={about} alt="Cedric Joshua" width={160} height={160} />
          </div>
        </div>

        {/* Centered intro text */}
        <div className={`about-intro scroll-reveal fade-up delay-300 ${isVisible ? 'visible' : ''}`}>
          <p className="lead-text">
            I'm a Computer Science student and Lead Developer specializing in full-stack web and Android mobile development.
            I architect scalable solutions using React, Node.js, and Kotlin, with proven expertise in integrating machine learning models and building user-centric applications.
          </p>
          <p className="lead-subtext">
            I have 4+ years of experience designing and implementing complex systems—from real-time inventory platforms to AI-powered virtual assistants.
            I'm passionate about creating efficient, maintainable code and solving real-world problems through technology. Beyond development, I explore UI/UX design and game server optimization.
          </p>
        </div>

        {/* Cards row */}
        <div className={`about-cards scroll-reveal fade-up delay-400 ${isVisible ? 'visible' : ''}`}>
          <div className="about-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                <path d="M6 12v5c3 3 9 3 12 0v-5"/>
              </svg>
            </div>
            <h3>Education</h3>
            <p className="card-title">BS in Computer Science</p>
            <p className="card-subtitle">CIIT College of Arts and Technology</p>
            <p style={{fontSize: '0.85rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)'}}>Specialization: Web & Mobile Development</p>
            <span className="card-date">Expected Oct 2026</span>
          </div>

          <div className="about-card">
            <div className="card-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
              </svg>
            </div>
            <h3>Experience</h3>
            <p className="card-title">Technical Lead</p>
            <p className="card-subtitle">Full-stack & Mobile Apps</p>
            <p style={{fontSize: '0.85rem', marginTop: '0.5rem', color: 'rgba(255,255,255,0.7)'}}>React • Node.js • Kotlin • Firebase</p>
            <span className="card-date">2024 - Present</span>
          </div>
        </div>

        {/* Highlights */}
        <div className={`about-highlights scroll-reveal fade-up delay-500 ${isVisible ? 'visible' : ''}`}>
          <div className="highlight-item">
            <span className="highlight-icon">🎯</span>
            <span>Problem Solver</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">💡</span>
            <span>Creative Thinker</span>
          </div>
          <div className="highlight-item">
            <span className="highlight-icon">🚀</span>
            <span>Fast Learner</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;