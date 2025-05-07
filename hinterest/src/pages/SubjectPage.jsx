import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

function SubjectPage() {
  const { subjectId } = useParams();
  const [subject, setSubject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        setLoading(false);
      } catch (error) {
        console.error('Error fetching subject:', error);
        setError('Failed to load subject. Please try again.');
        setLoading(false);
      }
    };

    fetchSubject();
  }, [subjectId, navigate]);

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;
  }

  if (error) {
    return <div style={{ padding: '2rem', color: 'red', textAlign: 'center' }}>{error}</div>;
  }

  if (!subject) {
    return <div style={{ padding: '2rem', textAlign: 'center' }}>Subject not found</div>;
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#4285f4',
            fontSize: '16px'
          }}
        >
          &larr; Back to Home
        </button>
        <h1 style={{ margin: 0 }}>{subject.name}</h1>
        <div></div> {/* Empty div for flex spacing */}
      </div>
      
      <div style={{ marginBottom: '2rem' }}>
        <h3>Description</h3>
        <p>{subject.description}</p>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>Flashcards</h3>
          <p>Create and study flashcards for this subject</p>
          <Link 
            to={`/flashcards/${subjectId}`}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '1rem'
            }}
          >
            Open Flashcards
          </Link>
        </div>
        
        <div style={{ 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1.5rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          backgroundColor: '#f9f9f9'
        }}>
          <h3>AI Chatbot</h3>
          <p>Ask questions and get AI-powered answers</p>
          <Link 
            to={`/chatbot/${subjectId}`}
            style={{
              backgroundColor: '#4285f4',
              color: 'white',
              padding: '0.75rem 1.5rem',
              borderRadius: '4px',
              textDecoration: 'none',
              marginTop: '1rem'
            }}
          >
            Chat with AI
          </Link>
        </div>
        
        {/* Add more learning tools here as needed */}
      </div>
    </div>
  );
}

export default SubjectPage;