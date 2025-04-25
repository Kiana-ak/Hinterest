import React, { createContext, useState, useEffect } from 'react';

// Create context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {}
});

// Create provider component
export const ThemeProvider = ({ children }) => {
  // Check for saved preference or use system preference
  const [darkMode, setDarkMode] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
           (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Toggle theme function
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };

  // Update localStorage and apply class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};