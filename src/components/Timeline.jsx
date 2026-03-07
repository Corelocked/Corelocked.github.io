import React from 'react';
import './Timeline.css';
import { projects } from './AllProjects';

// Timeline entries derived from Resume.jsx (Experience & School Technical Projects)
const timelineEntries = [
  {
    id: 'lakbay',
    title: 'Lakbay: Scenic Route Navigation',
    date: 'Oct 2025 - Feb 2026',
    role: 'Technical Lead',
    details: [
      'Developed a mobile app system that generates personalized travel routes based on user preferences and historical data.',
      'Architected backend logic for real-time route adjustments and user profile management.'
    ]
  },
  {
    id: 'e-tala',
    title: 'E-TALA: Inventory Management System',
    date: 'Oct 2025 - Nov 2025',
    role: 'Technical Lead',
    details: [
      'Led development of a mobile inventory system for small businesses.',
      'Implemented real-time stock updates, secure auth, and automated alerts.'
    ]
  },
  {
    id: 'blogshark',
    title: 'BlogShark: Blogging Website',
    date: 'May 2025 - Aug 2025',
    role: 'Technical Lead',
    details: [
      'Built an interactive blogging site that supports videos, images, in-app messaging, categories and tags.',
      'Designed role-based layouts and permissions for secure content distribution.'
    ]
  },
  {
    id: 'innsight',
    title: 'InnSight: AI Virtual Assistant',
    date: 'Sep 2024 - Nov 2024',
    role: 'Technical Lead',
    details: [
      'Created a voice- and text-enabled assistant for hospitality customer support.',
      'Integrated speech recognition and ML models for intent recognition and sentiment analysis.'
    ]
  },
  {
    id: 'pnri',
    title: 'Philippine Nuclear Research Institute (PNRI)',
    date: 'February 2020',
    role: 'Work Immersion Intern',
    details: [
      'Encoded 1,000+ newspaper records into the institutional library database within a 40-hour window.'
    ]
  }
];

const findProject = (title) => projects.find(p => p.title.toLowerCase().includes(title.split(':')[0].toLowerCase().trim()));

const Timeline = () => {
  return (
    <section id="timeline" className="timeline">
      <div className="container">
        <div className="timeline-header">
          <span className="section-label">Resume</span>
          <h2 className="section-title">Experience & Projects <span className="gradient-text">Timeline</span></h2>
          <p className="section-subtitle">Chronological view of projects and internship experience (from resume)</p>
        </div>

        <div className="timeline-list">
          {timelineEntries.map((entry, idx) => {
            const project = findProject(entry.title);
            return (
              <article key={entry.id} className={`timeline-item ${idx % 2 === 0 ? 'left' : 'right'}`}>
                <div className="timeline-date">{entry.date}</div>
                <div className="timeline-card">
                  <h3 className="timeline-title">{entry.title}</h3>
                  <div className="timeline-role">{entry.role}</div>
                  <ul className="timeline-details">
                    {entry.details.map((d, i) => <li key={i}>{d}</li>)}
                  </ul>
                  {project && (
                    <div className="timeline-links">
                      {project.githubLink && project.githubLink !== '#' && (
                        <a href={project.githubLink} target="_blank" rel="noopener noreferrer" className="link">View Code</a>
                      )}
                      {project.liveDemo && project.liveDemo !== '#' && (
                        <a href={project.liveDemo} target="_blank" rel="noopener noreferrer" className="link primary">View Demo</a>
                      )}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Timeline;
