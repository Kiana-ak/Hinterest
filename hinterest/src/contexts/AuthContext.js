import React, { createContext, useContext, useState, useEffect } from 'react';

// Create a context for authentication
const AuthContext = createContext();

// Provider component that wraps your app and makes auth object available to any child component that calls useAuth().
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on initial load
  useEffect(() => {
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
      setCurrentUser({ id: 1, name: 'User' }); // Placeholder user object
    }
    setLoading(false);
  }, []);

  // Login function
  const login = () => {
    setCurrentUser({ id: 1, name: 'User' }); // Placeholder user object
    sessionStorage.setItem('isLoggedIn', 'true');
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('isLoggedIn');
    localStorage.removeItem('google_token');
  };

  const value = {
    currentUser,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Hook for child components to get the auth object and re-render when it changes.
export function useAuth() {
  return useContext(AuthContext);
}