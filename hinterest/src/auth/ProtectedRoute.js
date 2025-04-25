import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import  React from 'react';

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;