import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddSubjectPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/');
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/subjects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  // Make sure the token format is correct
        },
        body: JSON.stringify({
          name,
          description
        })
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to add subject');
      }

      navigate('/home');
    } catch (error) {
      setError(error.message);
      console.error('Error creating subject:', error);  // Add this for debugging
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
        <button 
          onClick={() => navigate('/home')}
          style={{ 
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#ffffff',
            fontSize: '16px',
            marginRight: '1rem'
          }}
        >
          &larr; Back
        </button>
        <h1 style={{ margin: 0 }}>Add New Subject</h1>
      </div>
      
      {error && (
        <div style={{ 
          padding: '0.75rem', 
          backgroundColor: '#fff', 
          color: '#fff', 
          borderRadius: '4px',
          marginBottom: '1rem'
        }}>
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Subject Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #fff',
              borderRadius: '4px',
              fontSize: '16px'
            }}
            required
          />
        </div>
        
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
            Description:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{ 
              width: '100%', 
              padding: '0.75rem', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              minHeight: '150px',
              resize: 'vertical'
            }}
            required
          />
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <button 
            type="button" 
            onClick={() => navigate('/home')}
            style={{ 
              padding: '0.75rem 1.5rem',
              background: '#ffffff',
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Cancel
          </button>
          <button 
            type="submit"
            style={{ 
              padding: '0.75rem 1.5rem',
              backgroundColor: '#fff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Add Subject
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddSubjectPage;