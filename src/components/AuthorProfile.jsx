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
          Cedric Joshua Palapuz is a web and mobile developer focused on building practical,
          production-ready products with React, Next.js, Expo, Kotlin, Firebase, and Supabase.
        </p>

        <div className="author-grid">
          <article className="author-card">
            <h2>What I Build</h2>
            <p>
              I design and ship polished apps for web, mobile, and desktop workflows, from
              portfolio-grade case studies to real user-focused tools.
            </p>
          </article>

          <article className="author-card">
            <h2>Core Stack</h2>
            <ul>
              <li>React and Next.js</li>
              <li>Expo and Kotlin</li>
              <li>Firebase and Supabase</li>
              <li>JavaScript and modern CSS</li>
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
