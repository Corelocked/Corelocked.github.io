import React from 'react';
import '../apps/ResumeViewer.css';

const ResumeViewer = () => {
  const handlePrintPDF = () => {
    window.print();
  };

  return (
    <div className="resume-viewer">
      <div className="resume-viewer-header">
        <h2>My Resume</h2>
        <button onClick={handlePrintPDF} className="resume-print-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="6 9 6 2 18 2 18 9"/>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
            <rect x="6" y="14" width="12" height="8"/>
          </svg>
          Print
        </button>
      </div>

      <div className="resume-viewer-content">
        {/* Header */}
        <div className="resume-header-section">
          <h1>Cedric Joshua Palapuz</h1>
          <div className="resume-contact">
            <span>📧 cedricjoshua.palapuz@gmail.com</span>
            <span>📍 Quezon City</span>
          </div>
        </div>

        {/* Summary */}
        <div className="resume-section-viewer">
          <h3>Summary</h3>
          <p>
            Computer Science student and Lead Developer specializing in full-stack web and Android mobile development.
            Proven track record of architecting scalable solutions, integrating machine learning models, and leading technical teams to deliver user-centric applications.
          </p>
        </div>

        {/* Technical Skills */}
        <div className="resume-section-viewer">
          <h3>Technical Skills</h3>
          <div className="skills-section">
            <div>
              <strong>Web Development:</strong> React, Node.js, JavaScript, Laravel, HTML/CSS
            </div>
            <div>
              <strong>Mobile Dev:</strong> Kotlin, Java, Flutter, Dart
            </div>
            <div>
              <strong>Tools:</strong> GitHub, Firebase, MongoDB, SQLite, Python (ML)
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="resume-section-viewer">
          <h3>Education</h3>
          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>CIIT College of Arts and Technology</strong>
              <span className="date-viewer">Expected Oct 2026</span>
            </div>
            <p className="entry-subtitle-viewer">BS Computer Science</p>
            <p className="entry-detail-viewer">Specialization: Web and Mobile Development</p>
          </div>
        </div>

        {/* Experience */}
        <div className="resume-section-viewer">
          <h3>Experience & Projects</h3>

          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>Lakbay (Thesis Project)</strong>
              <span className="date-viewer">Oct 2025 - Feb 2026</span>
            </div>
            <p className="entry-subtitle-viewer">Technical Lead</p>
            <p className="entry-detail-viewer">Scenic route navigation mobile app | Kotlin • Python • Firebase</p>
          </div>

          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>E-TALA</strong>
              <span className="date-viewer">Oct-Nov 2025</span>
            </div>
            <p className="entry-subtitle-viewer">Technical Lead</p>
            <p className="entry-detail-viewer">Mobile inventory management with barcode scanner | Kotlin</p>
          </div>

          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>BlogShark</strong>
              <span className="date-viewer">May - Aug 2025</span>
            </div>
            <p className="entry-subtitle-viewer">Technical Lead</p>
            <p className="entry-detail-viewer">Social blogging platform | Laravel • SQLite • JavaScript</p>
          </div>

          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>InnSight</strong>
              <span className="date-viewer">Sep - Nov 2024</span>
            </div>
            <p className="entry-subtitle-viewer">Technical Lead</p>
            <p className="entry-detail-viewer">AI Virtual Assistant for hospitality | React • Python • ML</p>
          </div>

          <div className="resume-entry-viewer">
            <div className="entry-header-viewer">
              <strong>PNRI Internship</strong>
              <span className="date-viewer">Feb 2020</span>
            </div>
            <p className="entry-subtract-viewer">Work Immersion Intern</p>
          </div>
        </div>

        {/* Interests */}
        <div className="resume-section-viewer">
          <h3>Interests</h3>
          <ul className="interests-viewer">
            <li><strong>Game Server Management:</strong> Modded server configuration</li>
            <li><strong>UI/UX Design:</strong> Mobile interfaces and aesthetics</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ResumeViewer;
