import React, { useState } from 'react';

function SubjectSelector({ subjects, setSubjects, selectedSubject, setSelectedSubject, setSelectedTool }) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) {
      setError('Subject name cannot be empty');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: newSubjectName,
          description: `Notes for ${newSubjectName}`
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add subject');
      }

      const newSubject = await response.json();
      
      // Add the new subject to the list
      setSubjects([...subjects, newSubject]);
      
      // Select the newly created subject
      setSelectedSubject(newSubject._id);
      
      // Reset the form
      setNewSubjectName('');
      setIsAdding(false);
      setError('');
      
      // Default to chatbot when a new subject is selected
      setSelectedTool('chatbot');
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    setSelectedTool('chatbot'); // Default to chatbot when switching subjects
  };

  return (
    <div>
      <h3>Your Subjects</h3>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {subjects.map(subject => (
          <li 
            key={subject._id} 
            onClick={() => handleSelectSubject(subject._id)}
            style={{ 
              padding: '8px', 
              margin: '4px 0',
              backgroundColor: selectedSubject === subject._id ? '#ddd' : 'transparent',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {subject.name}
          </li>
        ))}
      </ul>
      
      {isAdding ? (
        <div>
          <input
            type="text"
            value={newSubjectName}
            onChange={(e) => setNewSubjectName(e.target.value)}
            placeholder="Subject name"
            style={{ width: '100%', marginBottom: '8px' }}
          />
          <div>
            <button onClick={handleAddSubject}>Add</button>
            <button onClick={() => setIsAdding(false)}>Cancel</button>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsAdding(true)}>+ Add Subject</button>
      )}
    </div>
  );
}

export default SubjectSelector;