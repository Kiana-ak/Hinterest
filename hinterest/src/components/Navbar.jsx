import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { ThemeContext } from '../ThemeContext';

function Navbar() {
  const context = useContext(ThemeContext);

  //saftery check
  const darkMode = context?.darkmode || false;
  const toggleTheme = context?.toggleTheme || (() => console.log('Theme context not available'));


  return (
    <nav style={{ 
      padding: "1rem", 
      background: "#ddd",
      display: "flex",
      justifyContent: "space-between"
    }}>
      <div>
        <Link to="/home" style={{ marginRight: "1rem" }}>Home</Link>
        <Link to="/calendar-login" style={{ marginRight: "1rem" }}>Calendar</Link>
        <Link to="/">Logout</Link>
      </div>
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
    </nav>
  );
}

export default Navbar;
