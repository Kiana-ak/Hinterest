import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from './Navbar';

function Chatbot() {
  const { subjectName } = useParams();
  const [message, setMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');

  // Load subjects from localStorage
  useEffect(() => {
    const savedSubjects = localStorage.getItem('subjects');
    if (savedSubjects) {
      try {
        setSubjects(JSON.parse(savedSubjects));
      } catch (error) {
        console.error("Error parsing subjects:", error);
        setSubjects([]);
      }
    }
  }, []);

  // Add new subject function
  const handleAddSubject = (e) => {
    e.preventDefault();
    
    if (newSubject.trim() === '') {
      return;
    }
    
    // Check if subject already exists
    const subjectExists = subjects.some(
      subject => subject.toLowerCase() === newSubject.trim().toLowerCase()
    );
    
    if (subjectExists) {
      alert('This subject already exists!');
      return;
    }
    
    const updatedSubjects = [...subjects, newSubject.trim()];
    setSubjects(updatedSubjects);
    localStorage.setItem('subjects', JSON.stringify(updatedSubjects));
    setNewSubject('');
  };

  const handleSendMessage = () => {
    if (message.trim() === '') return;
    
    // Add user message to chat history
    const newChatHistory = [...chatHistory, { sender: 'user', text: message }];
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = { sender: 'ai', text: `I'm the ${subjectName} chatbot. How can I help you with ${subjectName}?` };
      setChatHistory([...newChatHistory, aiResponse]);
    }, 500);
    
    setChatHistory(newChatHistory);
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      {/* Sidebar */}
      <div style={{ width: '250px', backgroundColor: '#f0f0f0', padding: '1rem', borderRight: '1px solid #ddd' }}>
        <Link to="/home" style={{ display: 'block', marginBottom: '1rem' }}>Home</Link>
        
        <h3>Menu</h3>
        <div style={{ marginBottom: '1rem' }}>
          <Link to="/home" style={{ display: 'block', marginBottom: '0.5rem' }}>Home</Link>
          <Link to="/calendar" style={{ display: 'block', marginBottom: '0.5rem' }}>Calendar</Link>
          <Link to="/" style={{ display: 'block', marginBottom: '0.5rem' }}>Logout</Link>
        </div>
        
        <h3>Subjects</h3>
        <div style={{ marginBottom: '1rem' }}>
          {subjects.map((subject, index) => (
            <Link 
              key={index}
              to={`/subject/${encodeURIComponent(subject)}`}
              style={{ 
                display: 'block', 
                padding: '0.5rem',
                marginBottom: '0.25rem',
                backgroundColor: subject === subjectName ? '#ddd' : 'transparent',
                borderRadius: '4px',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {subject}
            </Link>
          ))}
        </div>
        
        {/* Always visible subject input form */}
        <form onSubmit={handleAddSubject} style={{ marginBottom: '1rem' }}>
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Add new subject"
            style={{
              width: '100%',
              padding: '0.5rem',
              marginBottom: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '0.5rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Add Subject
          </button>
        </form>
      </div>
      
      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '1rem' }}>
        <h2>{subjectName} Chatbot</h2>
        
        {/* Chat area */}
        <div style={{ 
          flex: 1, 
          border: '1px solid #ddd', 
          borderRadius: '8px', 
          padding: '1rem',
          marginBottom: '1rem',
          overflowY: 'auto'
        }}>
          {chatHistory.length === 0 ? (
            <p>Welcome to the {subjectName} chatbot! How can I help you today?</p>
          ) : (
            chatHistory.map((msg, index) => (
              <div 
                key={index}
                style={{
                  marginBottom: '0.5rem',
                  textAlign: msg.sender === 'user' ? 'right' : 'left'
                }}
              >
                <span style={{
                  display: 'inline-block',
                  padding: '0.5rem 1rem',
                  borderRadius: '1rem',
                  backgroundColor: msg.sender === 'user' ? '#4285f4' : '#f0f0f0',
                  color: msg.sender === 'user' ? 'white' : 'black'
                }}>
                  {msg.text}
                </span>
              </div>
            ))
          )}
        </div>
        
        {/* Message input */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your question..."
            style={{
              flex: 1,
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ccc'
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSendMessage();
            }}
          />
          <button
            onClick={handleSendMessage}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chatbot;