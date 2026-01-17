import React from 'react';
import './About.css';
import '../components/Animations.css';
import about from '../assets/images/Hero.png';
import useScrollReveal from '../hooks/useScrollReveal';

const About = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.2 });
  const [imageRef, isImageVisible] = useScrollReveal({ threshold: 0.3 });

  return (
    <section id="about" className="about">
      <div className="about-bg-decoration"></div>
      <div className="container">
        <div className="about-header">
          <span 
            ref={sectionRef}
            className={`section-label scroll-reveal fade-up ${isVisible ? 'visible' : ''}`}
          >
            Get to know me
          </span>
          <h2 
            className={`section-title scroll-reveal fade-up delay-100 ${isVisible ? 'visible' : ''}`}
          >
            About Me
          </h2>
        </div>
        <div className="about-content">
          <div 
            className={`about-text scroll-reveal fade-left delay-200 ${isVisible ? 'visible' : ''}`}
          >
            <div className="about-intro">
              <p className="lead-text">
                I'm a passionate developer with 4+ years of experience building web applications.
                I specialize in JavaScript technologies including React, Node.js, and Express.
                I also have experience in mobile app development using Kotlin and a little bit of Flutter.
              </p>
              <p className="lead-subtext">
                I love creating efficient, user-friendly solutions that solve real-world problems.
                When I'm not coding, I enjoy graphic design and video editing to bring ideas to life visually.
              </p>
            </div>

            <div className="about-cards">
              {/* <div className="about-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h3>Education</h3>
                <p className="card-title">High School</p>
                <p className="card-subtitle">Quezon City Academy</p>
                <span className="card-date">2014 - 2018</span>
              </div>

              <div className="about-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h3>Education</h3>
                <p className="card-title">Senior High School - STEM</p>
                <p className="card-subtitle">Quezon City Academy</p>
                <span className="card-date">2018 - 2020</span>
              </div> */}

              <div className="about-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                    <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                  </svg>
                </div>
                <h3>Education</h3>
                <p className="card-title">Bachelor of Science in Computer Science</p>
                <p className="card-subtitle">CIIT College of Arts and Technology</p>
                <span className="card-date">2022 - 2026</span>
              </div>
              
              <div className="about-card">
                <div className="card-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
                    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
                  </svg>
                </div>
                <h3>Experience</h3>
                <p className="card-title">Work Immersion Intern</p>
                <p className="card-subtitle">Philippine Nuclear Research Institute</p>
                <span className="card-date">2020</span>
              </div>
            </div>

            <div className="about-highlights">
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
          <div 
            ref={imageRef}
            className={`about-image scroll-reveal fade-right delay-400 ${isImageVisible ? 'visible' : ''}`}
          >
            <div className="about-image-frame">
              <div className="frame-decoration frame-top-left"></div>
              <div className="frame-decoration frame-top-right"></div>
              <div className="frame-decoration frame-bottom-left"></div>
              <div className="frame-decoration frame-bottom-right"></div>
              <div className="image-frame">
                <img src={about} alt="About" width={400} height={400}/>
                <div className="image-overlay"></div>
              </div>
              <div className="frame-glow"></div>
              <div className="frame-dots"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;