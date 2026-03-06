import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Helper: consider night between 18:00-06:00 local time
  const isNight = () => {
    try {
      const h = new Date().getHours();
      return h >= 18 || h < 6;
    } catch {
      return true;
    }
  };

  const [darkMode, setDarkMode] = useState(() => {
    try {
      const override = localStorage.getItem('themeOverride'); // 'manual' if user toggled
      const saved = localStorage.getItem('darkMode');
      if (override === 'manual' && saved !== null) return JSON.parse(saved);
      // Otherwise, default to time-of-day
      return isNight();
    } catch {
      return true; // fallback
    }
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

    // Update theme-color meta tag
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag && !navigator.userAgent.includes('Firefox')) {
      metaTag.content = darkMode ? '#121212' : '#f8f9fa';
    }

    // Save preference only if user explicitly chose manual override
    try {
      const override = localStorage.getItem('themeOverride');
      if (override === 'manual') {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      }
    } catch {}
  }, [darkMode]);

  // Periodically re-evaluate time-based theme when NOT manually overridden
  useEffect(() => {
    let timer = null;
    try {
      const override = localStorage.getItem('themeOverride');
      if (override !== 'manual') {
        // check every 5 minutes to catch day/night transitions
        timer = setInterval(() => {
          const nowNight = isNight();
          setDarkMode(prev => (prev === nowNight ? prev : nowNight));
        }, 5 * 60 * 1000);
      }
    } catch {
      // ignore
    }
    return () => clearInterval(timer);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const next = !prev;
      try {
        localStorage.setItem('themeOverride', 'manual');
        localStorage.setItem('darkMode', JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Allow re-enabling automatic (time-based) theme
  const enableAutoTheme = () => {
    try {
      localStorage.removeItem('themeOverride');
      localStorage.removeItem('darkMode');
    } catch {}
    setDarkMode(isNight());
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode, enableAutoTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};