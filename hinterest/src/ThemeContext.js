import React, { createContext, useState, useEffect } from 'react';

// Create context with default values
export const ThemeContext = createContext({
  darkMode: false,
  toggleTheme: () => {},
  colors: {
    background: '#ffffff',
    text: '#333333',
    primary: '#0d6efd'
  }
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

  const colors = {
    background: darkMode ? '#333' : '#fff',
    text: darkMode ? '#fff' : '#333',
    primary: darkMode ? '#61dafb' : '#282c34'
  };

  // Update localStorage and apply class when theme changes
  useEffect(() => {
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
    document.body.className = darkMode ? 'dark-theme' : 'light-theme';
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, colors }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Export custom hook for using theme
export const useTheme = () => {
  const context = React.useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};