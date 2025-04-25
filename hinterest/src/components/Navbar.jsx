
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { useTheme } from '../ThemeContext';

export default function Navbar() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  return (
    <nav style={{ 
      padding: "1rem", 
      background: "#ddd",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <Link to="/home" style={{ marginRight: "1rem" }}>Home</Link>
        {currentUser && (
          <>
            <Link to="/calendar-login" style={{ marginRight: "1rem" }}>Calendar</Link>
            <Link to="/flashcards" style={{ marginRight: "1rem" }}>Flashcards</Link>
          </>
        )}
      </div>
    </nav>
  );
}
