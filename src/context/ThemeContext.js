import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const override = localStorage.getItem('themeOverride');
      const saved = localStorage.getItem('darkMode');
      if (override === 'manual' && saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');

    // Update theme-color meta tag
    const metaTag = document.querySelector('meta[name="theme-color"]');
    if (metaTag && !navigator.userAgent.includes('Firefox')) {
      metaTag.content = darkMode ? '#09090c' : '#f5f5f7';
    }

    // Save preference only if user explicitly chose manual override
    try {
      const override = localStorage.getItem('themeOverride');
      if (override === 'manual') {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
      }
    } catch {}
  }, [darkMode]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const syncWithSystem = (event) => {
      if (localStorage.getItem('themeOverride') !== 'manual') setDarkMode(event.matches);
    };
    media.addEventListener('change', syncWithSystem);
    return () => media.removeEventListener('change', syncWithSystem);
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

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
