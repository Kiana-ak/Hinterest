import React, { useState } from 'react';

const SubjectSelector = ({ selectedSubject, setSelectedSubject, subjects, setSubjects }) => {
  const [newSubject, setNewSubject] = useState('');

  // Function to add a new subject to the list
  const addSubject = () => {
    const trimmed = newSubject.trim();
    if (trimmed !== '' && !subjects.includes(trimmed)) {
      // Add to the subjects list and auto-select it
      setSubjects([...subjects, trimmed]);
      setSelectedSubject(trimmed);
    }

    // Clear the input field after adding
    setNewSubject('');
  };

  // Handle "Enter" key to add subject
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  return (
    <div>
      <h4>Subjects</h4>

      {/* Input field to type subject name */}
      <input
        type="text"
        placeholder="Add subject"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '70%' }}
      />

      {/* "+" button to add subject manually */}
      <button onClick={addSubject} style={{ marginLeft: '0.5rem' }}>+</button>

      {/* List of existing subjects */}
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {subjects.map((subject, index) => (
          <li
            key={index}
            onClick={() => setSelectedSubject(subject)}
            style={{
              padding: '0.3rem 0.5rem',
              marginBottom: '0.2rem',
              cursor: 'pointer',
              backgroundColor: selectedSubject === subject ? '#ccc' : '#f0f0f0',
              borderRadius: '4px'
            }}
          >
            {subject}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectSelector;