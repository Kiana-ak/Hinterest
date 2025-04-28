import React, { useState, useEffect } from 'react';

const Notes = ({ subject }) => {
  const [notes, setNotes] = useState('');
  
  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${subject}`);
    if (savedNotes) {
      setNotes(savedNotes);
    }
  }, [subject]);
  
  // Save notes to localStorage whenever they change
  const handleNotesChange = (e) => {
    const newNotes = e.target.value;
    setNotes(newNotes);
    localStorage.setItem(`notes-${subject}`, newNotes);
  };
  
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Notes for {subject}</h2>
      <textarea
        value={notes}
        onChange={handleNotesChange}
        placeholder={`Start taking notes for ${subject} here...`}
        style={{
          width: '100%',
          minHeight: '500px',
          padding: '1rem',
          border: '1px solid #ccc',
          borderRadius: '8px',
          fontFamily: 'inherit',
          fontSize: '1rem',
          lineHeight: '1.5'
        }}
      />
    </div>
  );
};

export default Notes;