import React from 'react';
import './Projects.css';

const projects = [
  {
    id: 1,
    title: 'E-commerce Platform',
    description: 'A full-stack e-commerce application with React, Node.js, and MongoDB',
    technologies: ['React', 'Node.js', 'MongoDB', 'Redux'],
    githubLink: '#',
    liveDemo: '#',
    image: 'project1.jpg'
  },
  {
    id: 2,
    title: 'Task Management App',
    description: 'A productivity application for managing tasks and projects',
    technologies: ['React', 'Firebase', 'Material UI'],
    githubLink: '#',
    liveDemo: '#',
    image: 'project2.jpg'
  },
  // Add more projects as needed
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
                {/* <img src={require(`../assets/images/${project.image}`)} alt={project.title} /> */}
                <div className="image-placeholder"></div>
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