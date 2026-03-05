import React, { useState, useEffect, useMemo } from 'react';
import './LoadingScreen.css';

const LoadingScreen = ({ onFinished }) => {
  const [hidden, setHidden] = useState(false);

  // Generate random stars once
  const stars = useMemo(() => {
    return Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 3}s`,
      size: `${1 + Math.random() * 2}px`,
    }));
  }, []);

  useEffect(() => {
    // Shorter delay to improve perceived load time (very brief)
    const timer = setTimeout(() => {
      setHidden(true);
      setTimeout(() => {
        if (onFinished) onFinished();
      }, 300); // shorter fade
    }, 200); // minimal wait so users see a quick splash
    return () => clearTimeout(timer);
  }, [onFinished]);

  return (
    <div className={`loading-screen ${hidden ? 'hidden' : ''}`}>
      <div className="loader-stars">
        {stars.map((star) => (
          <div
            key={star.id}
            className="loader-star"
            style={{
              left: star.left,
              top: star.top,
              animationDelay: star.animationDelay,
              width: star.size,
              height: star.size,
            }}
          />
        ))}
      </div>
      <div className="loader-logo">
        <span className="bracket">&lt;/</span>
        <span className="name">Cedric</span>
        <span className="bracket">&gt;</span>
      </div>
      <div className="loader-spinner">
        <div className="orbit"></div>
        <div className="orbit"></div>
        <div className="orbit"></div>
      </div>
    </div>
  );
};

export default LoadingScreen;
