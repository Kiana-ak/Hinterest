import Chatbot from './Chatbot';
import React from 'react';
import { Link } from 'react-router-dom';

const SubjectContent = ({ subject }) => {
  return (
    <div>
      <h2>{subject}</h2>
      <div style={{ marginBottom: '20px' }}>
        <Link 
          to="/notes" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          View Notes
        </Link>
        <Link 
          to="/flashcards" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px',
            marginRight: '10px'
          }}
        >
          View Flashcards
        </Link>
        <Link 
          to="/quizzes" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#dc3545',
            color: 'white',
            textDecoration: 'none',
            borderRadius: '4px'
          }}
        >
          Take Quiz
        </Link>
      </div>

      <Chatbot/>
    </div>
  );
};

export default SubjectContent;