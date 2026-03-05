import React, { useMemo } from 'react';
import './StarryBackground.css';

const StarryBackground = () => {
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

  return (
    <div className="starry-background" aria-hidden="true">
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
    </div>
  );
};

export default StarryBackground;
