import React, { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';
import './ThemeToggle.css';

const ThemeToggle = () => {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  
  return (
    <button 
      className="theme-toggle"
      onClick={toggleDarkMode}
      aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {darkMode ? (
        <FaSun style={{ color: '#FFD700' }} />
      ) : (
        <FaMoon style={{ color: '#333' }} />
      )}
    </button>
  );
};

export default ThemeToggle;