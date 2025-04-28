import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';

// Example subjects - replace with your actual data source/logic
const subjects = ['Math', 'History', 'Science'];

export default function Sidebar() {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      if (logout) {
        await logout();
        navigate('/');
      } else {
        sessionStorage.removeItem('isLoggedIn');
        localStorage.removeItem('google_token');
        navigate('/');
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const handleAddSubject = () => {
    console.log("Add Subject clicked - implement logic");
    // Example: navigate('/add-subject'); or open a modal
  };

  // Handler for clicking a subject
  const handleSubjectClick = (subjectName) => {
    navigate(`/subject/${subjectName}`);
  };

  return (
    <div style={{
      width: '200px',
      height: '100vh',
      background: '#f0f0f0',
      padding: '1rem',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #ccc'
    }}>
      <h2 style={{ marginBottom: '1rem', textAlign: 'center' }}>Menu</h2>
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexGrow: 1 }}>
        {currentUser && (
          <>
            <Link to="/home" style={{ textDecoration: 'none', color: 'black', padding: '0.5rem 0' }}>Home</Link>

            <button onClick={handleAddSubject} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: '0.5rem 0', color: 'black' }}>
              Add Subject
            </button>

            {/* Subjects List */}
            <div style={{ marginTop: '1rem', borderTop: '1px solid #ddd', paddingTop: '1rem' }}>
              <h4>Subjects</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {subjects.map((subject) => (
                  <li key={subject} style={{ marginBottom: '0.25rem' }}>
                    <button 
                      onClick={() => handleSubjectClick(subject)} 
                      style={{ 
                        width: '100%', 
                        textAlign: 'left', 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer', 
                        padding: '0.25rem 0' 
                      }}
                    >
                      {subject}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <Link to="/calendar-login" style={{ textDecoration: 'none', color: 'black', padding: '0.5rem 0' }}>Calendar</Link>

            {/* Logout Button */}
            <button 
              onClick={handleLogout} 
              style={{ 
                marginTop: 'auto', 
                background: 'none', 
                border: 'none', 
                color: 'blue', 
                textDecoration: 'underline', 
                cursor: 'pointer', 
                textAlign: 'left', 
                padding: '0.5rem 0' 
              }}
            >
              Logout
            </button>
          </>
        )}
        {!currentUser && (
          <Link to="/" style={{ textDecoration: 'none', color: 'black', padding: '0.5rem 0' }}>Login</Link>
        )}
      </nav>
    </div>
  );
}