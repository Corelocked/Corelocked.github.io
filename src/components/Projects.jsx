import React from 'react';
import './Projects.css';


const projects = [
  {
    id: 1,
    title: 'InnSight',
    description: 'An interactive web application designed as a virtual assistant tool, allowing users to inquire about hotel and restaurant-related topics through voice or text input.',
    technologies: ['React','Javascript','CSS','Python','HTML'],
    githubLink: 'https://github.com/Corelocked/react-voice-enabled-ordering-system.git',
    liveDemo: '#',
    image: require('../assets/images/innsight.png')
  },
  {
    id: 2,
    title: 'unFriendster',
    description: 'An attempt to create a social media app for my Android App Dev class.',
    technologies: ['Java','Firebase','XML'],
    githubLink: 'https://github.com/Corelocked/unFriendster2.git',
    liveDemo: 'https://drive.google.com/file/d/1OAb_6oc-SNPajD-ll_KCZ3X3yH-3UBvR/view?usp=drive_link',
    image: require('../assets/images/unfriendster.png')
  },
  {
    id: 3,
    title: 'Ang Pagong at ang Kuneho Game',
    description: 'A recreational game about the story "Ang pagong at ang Kuneho", a classic Filipino fable that teaches the value of perseverance and humility. The story revolves around a race between a slow but determined turtle and a fast yet overconfident rabbit.',
    technologies: ['Python'],
    githubLink: 'https://github.com/Corelocked/Pagong-at-Kuneho.git',
    liveDemo: 'https://drive.google.com/file/d/1wSdaMzPN1bbxsLYtLeZgqYe2JWFwiZIv/view?usp=drive_link',
    image: require('../assets/images/ang_pagong_at_ang_kuneho.png')
  },
  {
    id: 4,
    title: 'Emotion Detector',
    description: 'A program I made using Python that detects your emotion in real-time using a camera.',
    technologies: ['Python'],
    githubLink: 'https://github.com/Corelocked/emotion_detector.git',
    liveDemo: '#',
    image: require('../assets/images/placeholder.png')
  },
  {
    id: 5,
    title: 'Moody',
    description: 'An interactive web application that tracks your daily mood swings',
    technologies: ['Javascript','React','CSS','HTML'],
    githubLink: 'https://github.com/Corelocked/moody.git',
    liveDemo: '#',
    image: require('../assets/images/placeholder.png')
  },
  {
    id: 6,
    title: 'To Rysa',
    description: 'An interactive web application I made to ask my girlfriend to go out with me',
    technologies: ['Javascript','CSS','HTML'],
    githubLink: 'https://github.com/Corelocked/Corelocked.github.io.git',
    liveDemo: '#',
    image: require('../assets/images/rysa.png')
  },
];

const Projects = () => {
  return (
    <section id="projects" className="projects">
      <div className="container">
        <h2 className="section-title">My Projects</h2>
        <div className="projects-grid">
          {projects.map((project) => (
            <div key={project.id} className="project-card">
              <div className="project-image">
                <img src={project.image} alt={project.title} />
              </div>
              <div className="project-info">
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="project-technologies">
                  {project.technologies.map((tech, index) => (
                    <span key={index}>{tech}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a href={project.githubLink} target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href={project.liveDemo} target="_blank" rel="noopener noreferrer">Live Demo</a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;