import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

// Import your content components
// These are placeholders - replace with your actual components
const Chatbot = ({ subject }) => (
  <div>
    <h2>Chatbot for {subject}</h2>
    <p>Ask questions about {subject} here.</p>
  </div>
);

const Flashcards = ({ subject }) => (
  <div>
    <h2>Flashcards for {subject}</h2>
    <p>Study flashcards for {subject} here.</p>
  </div>
);

const Notes = ({ subject }) => (
  <div>
    <h2>Notes for {subject}</h2>
    <p>View and edit notes for {subject} here.</p>
  </div>
);

const Quizzes = ({ subject }) => (
  <div>
    <h2>Quizzes for {subject}</h2>
    <p>Take quizzes for {subject} here.</p>
  </div>
);

function SubjectDashboard() {
  // Use URL params for subject name
  const { subjectName } = useParams();
  const navigate = useNavigate();
  
  // Track current right sidebar selection
  const [selectedContent, setSelectedContent] = useState('chatbot');
  
  // Reset to chatbot when subject changes
  useEffect(() => {
    setSelectedContent('chatbot');
  }, [subjectName]);
  
  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
      {/* Main content area */}
      <div style={{ flex: 1, padding: '1rem' }}>
        <h1>{subjectName}</h1>
        
        {/* Center Display Logic */}
        {selectedContent === 'chatbot' && <Chatbot subject={subjectName} />}
        {selectedContent === 'flashcards' && <Flashcards subject={subjectName} />}
        {selectedContent === 'notes' && <Notes subject={subjectName} />}
        {selectedContent === 'quizzes' && <Quizzes subject={subjectName} />}
      </div>
      
      {/* Right sidebar */}
      <div style={{ width: '200px', background: '#f0f0f0', padding: '1rem', borderLeft: '1px solid #ddd' }}>
        <h3>Tools</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li>
            <button 
              onClick={() => setSelectedContent('chatbot')}
              style={{ 
                background: selectedContent === 'chatbot' ? '#ddd' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              Chatbot
            </button>
          </li>
          <li>
            <button 
              onClick={() => setSelectedContent('flashcards')}
              style={{ 
                background: selectedContent === 'flashcards' ? '#ddd' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              Flashcards
            </button>
          </li>
          <li>
            <button 
              onClick={() => setSelectedContent('notes')}
              style={{ 
                background: selectedContent === 'notes' ? '#ddd' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              Notes
            </button>
          </li>
          <li>
            <button 
              onClick={() => setSelectedContent('quizzes')}
              style={{ 
                background: selectedContent === 'quizzes' ? '#ddd' : 'transparent',
                border: 'none',
                padding: '0.5rem',
                width: '100%',
                textAlign: 'left',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}
            >
              Quizzes
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default SubjectDashboard;