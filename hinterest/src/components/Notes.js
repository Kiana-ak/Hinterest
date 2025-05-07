import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Notes({ subject }) {
  const navigate = useNavigate();
  // ... existing code ...

  // Function to navigate to chatbot
  const navigateToChatbot = () => {
    if (typeof subject === 'object' && subject._id) {
      navigate(`/chatbot/${subject._id}`);
    } else if (typeof subject === 'string') {
      navigate(`/chatbot/${subject}`);
    }
  };

  // Set subject name when component mounts or subject changes
  useEffect(() => {
    if (subject) {
      // If subject is an object with a name property, use that
      if (typeof subject === 'object' && subject.name) {
        setSubjectName(subject.name);
      } 
      // Otherwise use the subject directly (likely an ID string)
      else {
        // Try to fetch the subject name if we only have the ID
        const fetchSubjectName = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/subjects/${subject}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setSubjectName(data.name);
            } else {
              setSubjectName(subject); // Fallback to using the ID
            }
          } catch (err) {
            console.error('Error fetching subject name:', err);
            setSubjectName(subject); // Fallback to using the ID
          }
        };
        
        fetchSubjectName();
      }
    }
  }, [subject]);

  // ... existing code ...

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Notes for {subjectName}</h2>
        
        {/* Navigation button to Chatbot */}
        <button 
          onClick={navigateToChatbot}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Switch to Chatbot
        </button>
      </div>
      
      {/* ... existing code ... */}
    </div>
  );
}

export default Notes;