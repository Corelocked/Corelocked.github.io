import React from 'react';
import './Hero.css';
import hero from '../assets/images/Hero.png';

const Hero = () => {
  return (
    <section id="home" className="hero">
      <div className="container">
        <div className="hero-content">
          <h1>Hi, I'm <span>Cedric Joshua Palapuz</span></h1>
          <h2>Full Stack Developer</h2>
          <p>I build exceptional digital experiences</p>
          <div className="hero-buttons">
            <a href="#projects" className="btn">View My Work</a>
            <a href="#contact" className="btn btn-outline">Contact Me</a>
          </div>
        </div>
        <div className="hero-image">
           <img src={hero} alt="My Hero Image" width={400} height={400}/>
        </div>
      </div>
    </section>
  );
};

export default Hero;