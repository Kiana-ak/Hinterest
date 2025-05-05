import React, { useState } from 'react';

const SubjectSelector = ({ selectedSubject, setSelectedSubject, subjects, setSubjects }) => {
  const [newSubject, setNewSubject] = useState('');
  const [editModeId, setEditModeId] = useState(null);
  const [editValue, setEditValue] = useState('');

  const addSubject = async () => {
    const token = localStorage.getItem('token');
    const subjectName = newSubject.trim();

    if (!subjectName) return;

    try {
      const response = await fetch('http://localhost:5000/api/subjects', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: subjectName })
      });

      if (!response.ok) throw new Error('Failed to save subject');

      const savedSubject = await response.json();
      setSubjects([...subjects, savedSubject]); // store full object
      setNewSubject('');
    } catch (err) {
      console.error('❌ Error adding subject:', err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSubject();
    }
  };

  const startRename = (subject) => {
    setEditModeId(subject._id);
    setEditValue(subject.name);
  };

  const handleRenameSubject = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: editValue })
      });

      if (!response.ok) throw new Error('Rename failed');

      const updated = await response.json();
      setSubjects(subjects.map(s => s._id === id ? updated : s));
      setEditModeId(null);
    } catch (err) {
      console.error('❌ Rename error:', err);
    }
  };

  const handleDeleteSubject = async (subject) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/subjects/${subject._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      setSubjects(subjects.filter(s => s._id !== subject._id));
      if (selectedSubject === subject.name) {
        setSelectedSubject(null);
      }
    } catch (err) {
      console.error('❌ Delete error:', err);
    }
  };

  return (
    <div>
      <h4>Subjects</h4>

      <input
        type="text"
        placeholder="Add subject"
        value={newSubject}
        onChange={(e) => setNewSubject(e.target.value)}
        onKeyDown={handleKeyDown}
        style={{ width: '70%' }}
      />
      <button onClick={addSubject} style={{ marginLeft: '0.5rem' }}>+</button>

      <ul style={{ listStyle: 'none', padding: 0, marginTop: '1rem' }}>
        {subjects.map((subject) => (
          <li key={subject._id}>
            {editModeId === subject._id ? (
              <>
                <input
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                />
                <button onClick={() => handleRenameSubject(subject._id)}>Save</button>
                <button onClick={() => setEditModeId(null)}>Cancel</button>
              </>
            ) : (
              <div
                onClick={() => setSelectedSubject(subject.name)}
                style={{
                  padding: '0.3rem 0.5rem',
                  marginBottom: '0.2rem',
                  cursor: 'pointer',
                  backgroundColor: selectedSubject === subject.name ? '#ccc' : '#f0f0f0',
                  borderRadius: '4px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <span>{subject.name}</span>
                <div>
                  <button onClick={(e) => { e.stopPropagation(); startRename(subject); }}>Rename</button>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteSubject(subject); }}>Delete</button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubjectSelector;