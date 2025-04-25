import React, { useContext } from 'react';
import { ThemeContext } from '../ThemeContext'; // Verify this path

function ThemeToggle() {
  const context = useContext(ThemeContext);
  
  // Add a check to handle undefined context
  if (!context) {
    console.error('ThemeToggle must be used within a ThemeProvider');
    return null;
  }
  
  const { darkMode, toggleTheme } = context;

  return (
    <button 
      onClick={toggleTheme}
      style={{
        background: "none",
        border: "none",
        cursor: "pointer",
        fontSize: "1.2rem"
      }}
    >
      {darkMode ? "☀️" : "🌙"}
    </button>
  );
}

export default ThemeToggle;