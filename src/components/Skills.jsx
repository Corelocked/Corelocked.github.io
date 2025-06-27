import React from 'react';
import './Skills.css';

const skills = [
  { name: 'JavaScript', level: 90 },
  { name: 'React', level: 95 },
  { name: 'Node.js', level: 95 },
  { name: 'HTML/CSS', level: 95 },
  { name: 'Python', level: 80 },
  { name: 'Laravel', level: 75 },
  { name: 'Java', level: 60 },
  { name: 'C++', level: 65 },
  { name: 'C#', level: 65 },
];

const Skills = () => {
  return (
    <section id="skills" className="skills">
      <div className="container">
        <h2 className="section-title">My Skills</h2>
        <div className="skills-grid">
          {skills.map((skill, index) => (
            <div key={index} className="skill-item">
              <h3>{skill.name}</h3>
              <div className="skill-bar">
                <div 
                  className="skill-progress" 
                  style={{ width: `${skill.level}%` }}
                ></div>
              </div>
              <span>{skill.level}%</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Skills;