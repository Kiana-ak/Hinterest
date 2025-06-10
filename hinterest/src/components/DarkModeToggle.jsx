import React from 'react';
import { useTheme } from '../Themes/ThemeContext';

const DarkModeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button 
      onClick={toggleTheme}
      className="dark-mode-toggle"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};

export default DarkModeToggle;