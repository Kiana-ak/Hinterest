import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Chatbot from '../components/Chatbot';

function ChatbotPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    // Fetch subject details
    const fetchSubject = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/subjects/${subjectId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch subject');
        }
        
        const data = await response.json();
        setSubject(data);
      } catch (error) {
        console.error('Error fetching subject:', error);
      }
    };

    fetchSubject();
  }, [subjectId, navigate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vhz' }}>
      <div style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#fff',
            fontSize: '16px'
          }}
        >
          &larr; Back to Home
        </button>
        <h1 style={{ margin: '0.5rem 0' }}>{subject ? subject.name : 'Loading...'} Chatbot</h1>
      </div>
      
      <div style={{ flex: 1, padding: '1rem' }}>
        {subject && <Chatbot subject={subject.name} />}
      </div>
    </div>
  );
}

export default ChatbotPage;