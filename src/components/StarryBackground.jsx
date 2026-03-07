import React, { useMemo, useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import './StarryBackground.css';

const StarryBackground = () => {
  const { darkMode } = useContext(ThemeContext);
  
  const layers = useMemo(() => {
    const createStars = (count, sizeMin, sizeMax) =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: sizeMin + Math.random() * (sizeMax - sizeMin),
        delay: Math.random() * 5,
        duration: 3 + Math.random() * 4,
      }));

    return {
      small: createStars(80, 0.5, 1.5),
      medium: createStars(30, 1.5, 2.5),
      large: createStars(8, 2.5, 4),
    };
  }, []);

  const clouds = useMemo(() => {
    const createClouds = (count) =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        startY: 10 + Math.random() * 60,
        size: 0.6 + Math.random() * 1.2,
        delay: Math.random() * 20,
        duration: 40 + Math.random() * 40,
        opacity: 0.6 + Math.random() * 0.3,
      }));

    return createClouds(8);
  }, []);

  return (
    <div className="starry-background" aria-hidden="true">
      {darkMode ? (
        // Dark mode: stars, atmospheric gradient, and Perlin noise
        <>
          <div className="night-gradient-layer"></div>
          <div className="night-noise-layer"></div>

          {/* Gradient overlays */}
          <div className="star-gradient star-gradient-top"></div>
          <div className="star-gradient star-gradient-bottom"></div>

          {/* Shooting stars */}
          <div className="shooting-star shooting-star-1"></div>
          <div className="shooting-star shooting-star-2"></div>
          <div className="shooting-star shooting-star-3"></div>

          {/* Star layers */}
          {layers.small.map((s) => (
            <div
              key={`s-${s.id}`}
              className="star star-small"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
          {layers.medium.map((s) => (
            <div
              key={`m-${s.id}`}
              className="star star-medium"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
          {layers.large.map((s) => (
            <div
              key={`l-${s.id}`}
              className="star star-large"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                animationDelay: `${s.delay}s`,
                animationDuration: `${s.duration}s`,
              }}
            />
          ))}
        </>
      ) : (
        // Light mode: sky gradient, Perlin noise, and floating clouds
        <>
          <div className="sky-gradient-layer"></div>
          <div className="sky-noise-layer"></div>

          {clouds.map((cloud) => (
            <div
              key={`cloud-${cloud.id}`}
              className="cloud"
              style={{
                top: `${cloud.startY}%`,
                '--cloud-scale': cloud.size,
                animationDelay: `${cloud.delay}s`,
                animationDuration: `${cloud.duration}s`,
                opacity: cloud.opacity,
              }}
            >
              <div className="cloud-part cloud-part-1"></div>
              <div className="cloud-part cloud-part-2"></div>
              <div className="cloud-part cloud-part-3"></div>
              <div className="cloud-part cloud-part-4"></div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};

export default StarryBackground;
