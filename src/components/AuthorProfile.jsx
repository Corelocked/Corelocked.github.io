import React from 'react';
import { Link } from 'react-router-dom';
import './AuthorProfile.css';

export default function AuthorProfile() {
  return (
    <section className="author-profile-page">
      <div className="container author-profile-shell">
        <p className="author-kicker">Developer Profile</p>
        <h1>Cedric Joshua Palapuz</h1>
        <p className="author-summary">
          Cedric Joshua Palapuz is a Computer Science student and Full-Stack Web Developer
          focused on practical products built with JavaScript, React, Node.js, Python,
          SQL-based tools, and modern CMS platforms.
        </p>

        <div className="author-grid">
          <article className="author-card">
            <h2>What I Build</h2>
            <p>
              I design and ship full-stack web applications, from responsive interfaces and CMS
              storefronts to backend workflows, dashboards, and real-time reporting tools.
            </p>
          </article>

          <article className="author-card">
            <h2>Core Stack</h2>
            <ul>
              <li>React and Next.js</li>
              <li>Node.js, Express.js, and Laravel</li>
              <li>Python, Power BI, and Jupyter Notebook</li>
              <li>MongoDB, SQLite, and Firebase</li>
              <li>Shopify, PageFly, WordPress, and Elementor</li>
            </ul>
          </article>

          <article className="author-card">
            <h2>Find Me Online</h2>
            <p>
              GitHub: <a href="https://github.com/Corelocked" target="_blank" rel="noopener noreferrer">github.com/Corelocked</a>
            </p>
            <p>
              LinkedIn: <a href="https://www.linkedin.com/in/cedric-joshua-palapuz-85645524a/" target="_blank" rel="noopener noreferrer">cedric-joshua-palapuz</a>
            </p>
          </article>
        </div>

        <div className="author-actions">
          <Link to="/projects" className="author-btn">View Projects</Link>
          <Link to="/contact" className="author-btn primary">Contact Cedric</Link>
        </div>
      </div>
    </section>
  );
}
