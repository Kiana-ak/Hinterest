import React from 'react';
import './Home.css';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home-container">
      <div className="home-split">
        {/* Left: Logo */}
        <div className="home-left">
          <img src="/logo.png" alt="Hinterest Logo" className="home-logo-large" />
        </div>

        {/* Right: Text + Button */}
        <div className="home-right">
          <h1 className="home-welcome">WELCOME</h1>
          <p className="home-tagline">Your all-in-one academic companion.</p>
          <p className="home-about">
            Hinterest is a web app designed to simplify and enhance your learning journey.<br />
            <br />
            Use tools like AI-powered quizzes, flashcards, notes, and collaborative features to study smarter, not harder.
          </p>
          <button className="home-button" onClick={() => navigate('/workspace')}>
            Go to Workspace
          </button>
        </div>
      </div>

      <footer style={{
        position: 'absolute',
        bottom: '0',
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        textAlign: 'center',
        padding: '3rem',
        fontSize: '1.2rem',
        color: '#555',
        animation: 'fadeInUp 1s ease-in-out',
      }}>
        <p>Need help? Contact us at <br />
        <a href="mailto:hinterest1@gmail.com" style={{ color: '#007BFF' }}>hinterest1@gmail.com</a></p>
      </footer>
    </div>


  );
}

export default Home;