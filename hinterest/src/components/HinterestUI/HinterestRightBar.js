import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Themes/ThemeContext';

export default function HinterestRightBar() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const buttonStyle = {
    padding: '10px',
    border: '1px solid gray',
    borderRadius: '4px',
    marginBottom: '0.5rem',
    backgroundColor: theme === 'dark' ? '#222' : '#fff',
    color: theme === 'dark' ? '#fff' : '#000',
    cursor: 'pointer'
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ marginBottom: '1rem', fontWeight: 'bold' }}>Right Sidebar</div>

      <button style={buttonStyle} onClick={() => navigate('/flashcards')}>📚 Flashcards</button>
      <button style={buttonStyle}>📝 Notes</button>
      <button st