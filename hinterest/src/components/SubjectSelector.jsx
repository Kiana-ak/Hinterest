import React, { useState } from 'react';

function SubjectSelector({ subjects, setSubjects, selectedSubject, setSelectedSubject }) {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [renamingSubjectId, setRenamingSubjectId] = useState(null);
  const [renamingSubjectName, setRenamingSubjectName] = useState('');

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
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add subject');
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
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSelectSubject = (subjectId) => {
    setSelectedSubject(subjectId);
    // Default to chatbot when switching subjects
  };

  const handleDeleteSubject = async (e, id) => {
    e.stopPropagation(); // Prevent triggering subject selection
    const token = localStorage.getItem('token');

    if (!window.confirm("Are you sure you want to delete this subject?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete subject');
      }

      // Remove from UI
      setSubjects(subjects.filter(subject => subject._id !== id));
      if (selectedSubject === id) {
        setSelectedSubject(null);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRenameSubject = async (e, id, currentName) => {
    e.stopPropagation(); // Prevent selecting subject
    const token = localStorage.getItem('token');
    const newName = window.prompt('Enter a new name for the subject:', currentName);

    if (!newName || newName.trim() === '') {
      return; // Cancelled or empty input
    }

    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rename subject');
      }

      const updatedSubject = await response.json();

      setSubjects(subjects.map(subject =>
        subject._id === id ? updatedSubject : subject
      ));
    } catch (err) {
      setError(err.message);
    }
  };

  const submitRename = async (id) => {
    const trimmedName = renamingSubjectName.trim();
    if (!trimmedName) {
      setRenamingSubjectId(null);
      return;
    }

    const token = localStorage.getItem('token');
    try {
      const response = await fetch(`http://localhost:5000/api/subjects/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: trimmedName })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to rename subject');
      }

      const updated = await response.json();
      setSubjects(subjects.map(subject =>
        subject._id === id ? updated : subject
      ));
    } catch (err) {
      setError(err.message);
    }

    setRenamingSubjectId(null);
  };

  return (
    <div>
      <h3>Your Subjects</h3>

      <input
        type="text"
        placeholder="Search subjects..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ width: '85%', marginBottom: '10px', padding: '6px' }}
      />

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
        {subjects
          .filter(subject => subject.name.toLowerCase().includes(searchTerm.toLowerCase()))
          .map(subject => (
            <li 
              key={subject._id}
              style={{ 
                padding: '8px', 
                margin: '4px 0',
                backgroundColor: selectedSubject === subject._id ? '#fff' : 'transparent',
                borderRadius: '4px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {renamingSubjectId === subject._id ? (
                  <input
                    type="text"
                    value={renamingSubjectName}
                    onChange={(e) => setRenamingSubjectName(e.target.value)}
                    onBlur={() => submitRename(subject._id)}
                    onKeyDown={(e) => e.key === 'Enter' && submitRename(subject._id)}
                    autoFocus
                    style={{ flexGrow: 1 }}
                  />
                ) : (
                  <span 
                    onClick={() => handleSelectSubject(subject._id)} 
                    style={{ flexGrow: 1, cursor: 'pointer' }}
                  >
                    {subject.name}
                  </span>
                )}

                <button 
                  onClick={(e) => handleDeleteSubject(e, subject._id)} 
                  style={{ marginLeft: '8px' }}
                >
                  Delete
                </button>

                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setRenamingSubjectId(subject._id);
                    setRenamingSubjectName(subject.name);
                  }} 
                  style={{ marginLeft: '4px' }}
                >
                  Rename
                </button>
              </div>
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
