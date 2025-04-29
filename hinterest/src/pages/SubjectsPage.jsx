import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const navigate = useNavigate();

  // Load subjects from localStorage when component mounts
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      setSubjects(JSON.parse(savedSubjects));
    }
  }, []);

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleAddSubject = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    } else if (subjects.includes(newSubject.trim())) {
      alert('This subject already exists!');
    }
  };

  const handleDeleteSubject = (subjectToDelete) => {
    if (window.confirm(`Are you sure you want to delete ${subjectToDelete}?`)) {
      setSubjects(subjects.filter(subject => subject !== subjectToDelete));
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
        <h2>Your Subjects</h2>
        
        <div style={{ 
          display: 'flex', 
          marginBottom: '2rem',
          gap: '0.5rem'
        }}>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Enter subject name"
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleAddSubject();
            }}
          />
          <button
            onClick={handleAddSubject}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Subject
          </button>
        </div>
        
        {subjects.length === 0 ? (
          <p>No subjects yet. Add your first subject above!</p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
            gap: '1rem' 
          }}>
            {subjects.map((subject, index) => (
              <div 
                key={index}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  backgroundColor: '#f9f9f9',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <h3 style={{ marginTop: 0 }}>{subject}</h3>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '1rem'
                }}>
                  <button
                    onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4285f4',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => handleDeleteSubject(subject)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SubjectsPage;