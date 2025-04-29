import React, { useState } from 'react';

const Chatbot = ({ subject }) => {
  const [messages, setMessages] = useState([
    { text: `Welcome to the ${subject || 'Study'} chatbot! How can I help you today?`, sender: 'bot' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (input.trim() === '') return;
    
    // Add user message
    const newMessages = [...messages, { text: input, sender: 'user' }];
    setMessages(newMessages);
    setInput('');
    
    // Simulate bot response
    setTimeout(() => {
      setMessages([
        ...newMessages,
        { 
          text: `I'm a simple demo chatbot for ${subject || 'your studies'}. In the full version, I would provide helpful information about ${subject || 'this topic'}.`, 
          sender: 'bot' 
        }
      ]);
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      height: '500px', 
      border: '1px solid #ccc',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {/* Chat messages area */}
      <div style={{ 
        flex: 1, 
        padding: '1rem',
        overflowY: 'auto',
        background: '#f5f5f5'
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
              background: msg.sender === 'user' ? '#0084ff' : '#e4e6eb',
              color: msg.sender === 'user' ? 'white' : 'black',
              padding: '0.5rem 1rem',
              borderRadius: '18px',
              maxWidth: '70%'
            }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>
      
      {/* Input area */}
      <div style={{ 
        display: 'flex', 
        padding: '0.5rem',
        borderTop: '1px solid #ccc'
      }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your question..."
          style={{
            flex: 1,
            padding: '0.5rem',
            border: '1px solid #ccc',
            borderRadius: '4px',
            marginRight: '0.5rem'
          }}
        />
        <button 
          onClick={handleSend}
          style={{
            padding: '0.5rem 1rem',
            background: '#0084ff',
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
  );
};

export default Chatbot;