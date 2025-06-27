import React from 'react';
import './About.css';
import about from '../assets/images/About.jpg';

const About = () => {
  return (
    <section id="about" className="about">
      <div className="container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <div className="about-text">
            <p>
              I'm a passionate developer with 3 years of experience building web applications.
              I specialize in JavaScript technologies including React, Node.js, and Express.
            </p>
            <p>
              When I'm not coding, I enjoy contributing to open-source projects,
              learning new technologies, and sharing knowledge with the developer community.
            </p>
            <div className="about-details">
              <div>
                <h3>Education</h3>
                <p>Bachelort of Science in Computer Science<br />CIIT College of Arts and Technology, 2022-2026</p>
              </div>
              <div>
                <h3>Experience</h3>
                <p>Intern<br />PNRI, 2020</p>
              </div>
            </div>
          </div>
          <div className="about-image">
            <img src={about} alt="My About Me Image" width={400} height={400}/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;