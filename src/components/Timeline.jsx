import React from 'react';
import './Timeline.css';
import { projects } from './AllProjects';

// Timeline entries derived from Resume.jsx (Experience & School Technical Projects)
const timelineEntries = [
  {
    id: 'megacat',
    title: 'Mega Cat Studios',
    date: 'Apr 2026 - Present',
    role: 'Web Developer',
    details: [
      'Manage and maintain Shopify storefronts for technical performance and user experience.',
      'Execute technical SEO strategies, including alt text audits and collection page title optimization.'
    ]
  },
  {
    id: 'pitaka',
    title: 'Pitaka',
    date: 'Mar 2026 - Present',
    role: 'Lead Developer',
    details: [
      'Designed and launched a personal finance and budget tracker web application tailored for the Philippine market.',
      'Ported the web application to mobile platforms while maintaining feature parity for on-the-go expense tracking.'
    ]
  },
  {
    id: 'lakbay',
    title: 'Lakbay: Scenic Route Navigation',
    date: 'Oct 2025 - Feb 2026',
    role: 'Technical Lead',
    details: [
      'Developed a system that generates personalized travel routes based on curated user preferences and historical data.',
      'Architected backend logic for real-time route adjustments and complex user profile management.'
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
      'Designed a database capable of handling multimedia content, categories, and tags for unstructured data.',
      'Architected role-based layouts and permissions for secure, organized data distribution.'
    ]
  },
  {
    id: 'innsight',
    title: 'InnSight: AI Virtual Assistant',
    date: 'Sep 2024 - Nov 2024',
    role: 'Technical Lead',
    details: [
      'Engineered a dual-input system for real-time voice-to-text transcription and text-based querying.',
      'Implemented ML models to analyze sentiment and intent within customer inquiry datasets.'
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
