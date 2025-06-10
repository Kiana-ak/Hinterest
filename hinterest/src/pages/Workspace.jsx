import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubject } from '../context/SubjectContext';
import Chatbot from '../components/Chatbot';
import './Workspace.css';

export default function Workspace() {
  const navigate = useNavigate();
  const { selectedSubject, setSelectedSubject } = useSubject();

  const [subjects, setSubjects] = useState([]);
  const [newSubjectName, setNewSubjectName] = useState('');
  const [showInput, setShowInput] = useState(false);

  // Load subjects from backend
  useEffect(() => {
    const fetchSubjects = async () => {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:8080/api/subjects', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      const data = await res.json();
    
      // Make sure data is always an array
      if (Array.isArray(data)) {
        setSubjects(data);
      } else {
        setSubjects([]); // fallback to empty
        console.error('Fetched subject data is not an array:', data);
      }
    };
    fetchSubjects();
  }, []);

  const handleAddSubject = async () => {
    if (!newSubjectName.trim()) return;
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:8080/api/subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: newSubjectName }),
    });
    const newSubject = await res.json();
    setSubjects((prev = []) => [...prev, newSubject]);
    setNewSubjectName('');
    setShowInput(false);
  };

  const tools = [
    { name: 'Flashcards', path: '/flashcards' },
    { name: 'Notes', path: '/notes' },
    { name: 'Quizzes', path: '/quizzes' },
    { name: 'Whiteboard', path: '/whiteboard' },
  ];

  return (
    

      <main className="workspace-main">
        <h1 className="tagline">Work smarter, not harder.</h1>

        {/* Subject Dropdown */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ marginRight: '0.5rem' }}>Select Subject:</label>
          <select
            value={selectedSubject?._id || ''}
            onChange={(e) => {
              const subject = subjects.find((s) => s._id === e.target.value);
              setSelectedSubject(subject);
            }}
          >
            <option value="">Select...</option>
            {Array.isArray(subjects) && subjects.map((subj) => (
              <option key={subj._id} value={subj._id}>
                {subj.name}
              </option>
            ))}
          </select>
          <button 
            onClick={() => setShowInput(!showInput)} 
            style={{ 
              marginLeft: '0.5rem',
              backgroundColor: 'var(--tool-bg)',
              color: 'var(--tool-text)',
              borderColor: 'var(--border-color)'
            }}
          >
            + Add New
          </button>
        </div>

        {/* Subject Input Field */}
        {showInput && (
          <div style={{ marginBottom: '1rem' }}>
            <input
              type="text"
              placeholder="New subject name"
              value={newSubjectName}
              onChange={(e) => setNewSubjectName(e.target.value)}
              style={{ marginRight: '0.5rem' }}
            />
            <button onClick={handleAddSubject}>Create</button>
          </div>
        )}

        {/* Tools */}
        <div className="tools-grid">
          {tools.map((tool) => (
            <div
              key={tool.name}
              className="tool-button"
              onClick={() => {
                if (tool.name === 'Whiteboard') {
                  navigate(tool.path);
                } else if (selectedSubject?._id) {
                  navigate(`${tool.path}/${selectedSubject._id}`);
                } else {
                  alert('Please select a subject first.');
                }
              }}
            >
              {tool.name}
            </div>
          ))}
        </div>
        {selectedSubject && (
          <div style={{ marginTop: '2rem' }}>
            <h2>Ask AI about {selectedSubject.name}</h2>
            <Chatbot subject={selectedSubject.name} />
          </div>
        )}
      </main>
  );
}