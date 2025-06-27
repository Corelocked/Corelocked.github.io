import React, { createContext, useState, useEffect } from 'react';

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('darkMode');
      if (saved !== null) return JSON.parse(saved);
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false; // Fallback to light mode
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
    
    // Save preference
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};