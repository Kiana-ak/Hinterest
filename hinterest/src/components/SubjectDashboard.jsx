import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Chatbot from './Chatbot.jsx';
import Flashcards from './Flashcards.jsx';
import Notes from './Notes.jsx';
import Quizzes from './Quizzes.jsx';

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
    <div>
      <Navbar />
      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Left sidebar for subject list */}
        <div style={{ width: '220px', background: '#eee', padding: '1rem' }}>
          <h3>Menu</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            <li><a href="/home">Home</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
          <hr />
          <h4>Subjects</h4>
          <div style={{ padding: '0.5rem', background: '#ccc', borderRadius: '4px', marginBottom: '0.5rem' }}>
            {subjectName}
          </div>
        </div>
        
        {/* Main content area */}
        <div style={{ flex: 1, padding: '1rem' }}>
          <h1>{subjectName} Dashboard</h1>
          
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
    </div>
  );
}

export default SubjectDashboard;