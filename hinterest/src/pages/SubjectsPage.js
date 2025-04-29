import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem('subjects');
    if (saved) setSubjects(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  const handleAdd = () => {
    if (newSubject.trim() && !subjects.includes(newSubject.trim())) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Subjects</h2>
      <input
        value={newSubject}
        onChange={e => setNewSubject(e.target.value)}
        placeholder="Add a new subject"
      />
      <button onClick={handleAdd}>Add Subject</button>
      <ul>
        {subjects.map(subject => (
          <li key={subject}>
            <button onClick={() => navigate(`/subject/${encodeURIComponent(subject)}`)}>
              {subject}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SubjectsPage;