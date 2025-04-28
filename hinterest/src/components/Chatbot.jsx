import React, { useState } from 'react';

const Chatbot = ({ subject }) => {
  const [messages, setMessages] = useState([
    { text: `Welcome to the ${subject} chatbot! How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    setMessages([...messages, { text: input, sender: 'user' }]);
    
    // Simulate bot response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        text: `You asked about "${input}" for ${subject}. This is a placeholder response.`, 
        sender: 'bot' 
      }]);
    }, 1000);
    
    setInput('');
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Chatbot for {subject}</h2>
      
      {/* Chat messages */}
      <div style={{ 
        height: '400px', 
        border: '1px solid #ccc', 
        borderRadius: '8px',
        padding: '1rem',
        overflowY: 'auto',
        marginBottom: '1rem',
        background: '#f9f9f9'
      }}>
        {messages.map((msg, index) => (
          <div 
            key={index}
            style={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: '0.5rem'
            }}
          >
            <div style={{
              background: msg.sender === 'user' ? '#007bff' : '#e9e9e9',
              color: msg.sender === 'user' ? 'white' : 'black',
              padding: '0.5rem 1rem',
              borderRadius: '1rem',
              maxWidth: '70%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder={`Ask something about ${subject}...`}
          style={{ flex: 1, padding: '0.5rem' }}
        />
        <button onClick={handleSend} style={{ padding: '0.5rem 1rem' }}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;