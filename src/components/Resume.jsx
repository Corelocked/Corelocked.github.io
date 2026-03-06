import React from 'react';
import './Resume.css';
import '../components/Animations.css';
import useScrollReveal from '../hooks/useScrollReveal';

const Resume = () => {
  const [sectionRef, isVisible] = useScrollReveal({ threshold: 0.2 });

  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <section id="resume" className="resume">
      <div className="container">
        <div className="resume-header" ref={sectionRef}>
          <span className={`section-label scroll-reveal fade-up ${isVisible ? 'visible' : ''}`}>
            Download or View
          </span>
          <h2 className={`section-title scroll-reveal fade-up delay-100 ${isVisible ? 'visible' : ''}`}>
            My <span className="gradient-text">Resume</span>
          </h2>
          <button onClick={handlePrintPDF} className="download-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            Print to PDF
          </button>
        </div>

        <div className={`resume-content scroll-reveal fade-up delay-200 ${isVisible ? 'visible' : ''}`}>
          {/* Header */}
          <div className="resume-section header-section">
            <h1>Cedric Joshua Palapuz</h1>
            <div className="contact-info">
              <span>Quezon City</span>
              <span>•</span>
              <span>cedricjoshua.palapuz@gmail.com</span>
              <span>•</span>
              <a href="https://linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noreferrer">
                LinkedIn
              </a>
            </div>
          </div>

          {/* Summary */}
          <div className="resume-section">
            <h2>Summary</h2>
            <p>
              Computer Science student and Lead Developer specializing in full-stack web and Android mobile development.
              Proven track record of architecting scalable solutions, integrating machine learning models, and leading technical teams to deliver user-centric applications.
              Expertise in React, Node.js, and Kotlin. Seeking to leverage advanced proficiency in full-stack web and Android development in a challenging developer role.
            </p>
          </div>

          {/* Technical Skills */}
          <div className="resume-section">
            <h2>Technical Skills</h2>
            <div className="skills-grid">
              <div className="skill-category">
                <h3>Web Development</h3>
                <ul>
                  <li>React (Advanced)</li>
                  <li>Node.js (Advanced)</li>
                  <li>JavaScript</li>
                  <li>Laravel</li>
                  <li>HTML/CSS</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Mobile Development</h3>
                <ul>
                  <li>Kotlin (Advanced)</li>
                  <li>Java</li>
                  <li>Flutter</li>
                  <li>Dart</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Tools & Technologies</h3>
                <ul>
                  <li>GitHub</li>
                  <li>Firebase</li>
                  <li>MongoDB</li>
                  <li>SQLite</li>
                  <li>Python (ML models)</li>
                </ul>
              </div>
              <div className="skill-category">
                <h3>Data & Productivity</h3>
                <ul>
                  <li>Power BI</li>
                  <li>Google Workspace</li>
                  <li>Jupyter Notebook</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Education */}
          <div className="resume-section">
            <h2>Education</h2>
            <div className="resume-entry">
              <div className="entry-header">
                <h3>CIIT College of Arts and Technology</h3>
                <span className="date">Expected Oct 2026</span>
              </div>
              <p className="entry-subtitle">Bachelor of Science in Computer Science</p>
              <p className="entry-detail">Specialization: Web and Mobile Development</p>
            </div>
          </div>

          {/* Experience */}
          <div className="resume-section">
            <h2>Experience & School Technical Projects</h2>
            
            <div className="resume-entry">
              <div className="entry-header">
                <h3>Lakbay: Scenic Route Navigation</h3>
                <span className="date">Oct 2025 - Feb 2026</span>
              </div>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed a system for a mobile application that generates personalized travel routes based on curated user preferences and historical data.</li>
                <li>Architected the backend logic to handle real-time route adjustments and user profile management, ensuring a seamless user experience.</li>
              </ul>
            </div>

            <div className="resume-entry">
              <div className="entry-header">
                <h3>E-TALA: Inventory Management System</h3>
                <span className="date">Oct 2025 - Nov 2025</span>
              </div>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Led the development of a mobile inventory system focused on streamlining tracking and reporting for small businesses.</li>
                <li>Implemented core features including real-time stock updates, secure user authentication, and automated inventory alerts.</li>
              </ul>
            </div>

            <div className="resume-entry">
              <div className="entry-header">
                <h3>BlogShark: Blogging Website</h3>
                <span className="date">May 2025 - Aug 2025</span>
              </div>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed and designed an interactive blogging site that handles posting videos and images, in-app messaging, creation of categories and tags.</li>
                <li>Architected a system with distinct layouts and permissions for different user roles, ensuring secure and organized data distribution.</li>
                <li><strong>Featured in CIIT's social media platforms</strong> | February 4, 2026</li>
              </ul>
            </div>

            <div className="resume-entry">
              <div className="entry-header">
                <h3>InnSight: AI Virtual Assistant</h3>
                <span className="date">Sep 2024 - Nov 2024</span>
              </div>
              <p className="entry-subtitle">Technical Lead</p>
              <ul>
                <li>Developed an interactive web application designed to automate customer service inquiries for the hospitality industry.</li>
                <li>Engineered a dual-input system utilizing Python's speech recognition library for real-time voice-to-text transcription and text-based querying.</li>
                <li>Implemented Machine Learning models to achieve intent recognition and sentiment analysis.</li>
              </ul>
            </div>

            <div className="resume-entry">
              <div className="entry-header">
                <h3>Philippine Nuclear Research Institute (PNRI)</h3>
                <span className="date">February 2020</span>
              </div>
              <p className="entry-subtitle">Work Immersion Intern</p>
              <ul>
                <li>Encoded 1,000+ newspaper data records into the institutional library database using Microsoft Excel within a strict 40-hour window.</li>
              </ul>
            </div>
          </div>

          {/* Interests */}
          <div className="resume-section">
            <h2>Interests</h2>
            <ul className="interests-list">
              <li><strong>Game Server Management:</strong> Experience in configuring modded servers, focusing on performance optimization and community moderation.</li>
              <li><strong>UI/UX Design:</strong> Exploring the intersection of mobile functionality and aesthetic user interfaces.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Resume;
