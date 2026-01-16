import React, { useEffect, useState } from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Projects from './components/Projects';
// import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import Support from './components/Support';
import Footer from './components/Footer';

function App() {
  const [cursorPos, setCursorPos] = useState({ x: 0, y: 0 });
  const [ripples, setRipples] = useState([]);
  const [trail, setTrail] = useState([]);

  useEffect(() => {
    let lastTime = 0;
    const throttleMs = 30; // Add point every 30ms for smoother trail

    const handleMouseMove = (e) => {
      setCursorPos({ x: e.clientX, y: e.clientY });
      
      const now = Date.now();
      if (now - lastTime >= throttleMs) {
        lastTime = now;
        const newPoint = {
          x: e.clientX,
          y: e.clientY,
          id: now + Math.random(),
        };
        setTrail((prev) => [...prev.slice(-20), newPoint]);
      }
    };

    // Fade out trail points over time
    const trailInterval = setInterval(() => {
      setTrail((prev) => prev.slice(1));
    }, 50);

    const handleClick = (e) => {
      const newRipple = {
        x: e.clientX,
        y: e.clientY,
        id: Date.now(),
      };
      setRipples((prev) => [...prev, newRipple]);

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      clearInterval(trailInterval);
    };
  }, []);

  return (
    <div className="App">
      {/* Mouse Trail */}
      {trail.map((point, index) => (
        <div
          key={point.id}
          className="cursor-trail"
          style={{
            left: point.x,
            top: point.y,
            opacity: (index + 1) / trail.length * 0.6,
            transform: `translate(-50%, -50%) scale(${(index + 1) / trail.length})`,
          }}
        />
      ))}

      {/* Cursor Glow */}
      <div
        className="cursor-glow"
        style={{
          left: cursorPos.x,
          top: cursorPos.y,
        }}
      />

      {/* Click Ripples */}
      {ripples.map((ripple) => (
        <div
          key={ripple.id}
          className="click-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
          }}
        />
      ))}

      <Header />
      <Hero />
      <About />
      <Skills />
      <Projects />
      {/* <Testimonials /> */}
      <Contact />
      <Support />
      <Footer />
    </div>
  );
}

export default App;