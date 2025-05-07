import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse, getChatHistoryForSubject, clearChatHistory } from '../services/GeminiService';

function Chatbot({ subject }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState('');

  // Set subject name and load chat history when subject changes
  useEffect(() => {
    if (!subject) return;
    
    // Extract subject name
    if (typeof subject === 'object') {
      setSubjectName(subject.name || 'Unknown Subject');
    } else if (typeof subject === 'string') {
      // If it's just a string ID, try to get the name from localStorage
      const subjectData = localStorage.getItem(`subject_${subject}`);
      if (subjectData) {
        try {
          const parsedData = JSON.parse(subjectData);
          setSubjectName(parsedData.name || subject);
        } catch (e) {
          setSubjectName(subject);
        }
      } else {
        setSubjectName(subject);
      }
    }
    
    // Load chat history from localStorage
    const subjectId = subject._id || subject;
    const savedHistory = localStorage.getItem(`chat_history_${subjectId}`);
    if (savedHistory) {
      try {
        setChatHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing chat history:', e);
        setChatHistory([]);
      }
    } else {
      // Try to get history from memory
      const memoryHistory = getChatHistoryForSubject(subjectId);
      if (memoryHistory && memoryHistory.length > 0) {
        setChatHistory(memoryHistory);
      } else {
        setChatHistory([]);
      }
    }
  }, [subject]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0 && subject) {
      const subjectId = subject._id || subject;
      localStorage.setItem(`chat_history_${subjectId}`, JSON.stringify(chatHistory));
    }
  }, [chatHistory, subject]);

  const handleSend = async () => {
    if (!question.trim()) return;
  
    const newUserMessage = { sender: 'user', text: question };
    const updatedChat = [...chatHistory, newUserMessage];
  
    setChatHistory(updatedChat);
    setQuestion('');
    setLoading(true);
  
    try {
      // Pass the subject ID to getGeminiResponse
      const subjectId = subject._id || subject;
      const answer = await getGeminiResponse(updatedChat, subjectId);
      const botMessage = { sender: 'gemini', text: answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'gemini', text: "Gemini didn't respond. Please try again." };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  
    setLoading(false);
  };

  // Clear chat history for this subject
  const handleClearChat = () => {
    const subjectId = subject._id || subject;
    setChatHistory([]);
    clearChatHistory(subjectId);
    localStorage.removeItem(`chat_history_${subjectId}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
      {/* Subject Title */}
      <h2 style={{ marginBottom: '1rem' }}>Chat with {subjectName}</h2>
      
      {/* Clear Chat Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button 
          onClick={handleClearChat}
          style={{ 
            padding: '0.25rem 0.5rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Clear Chat
        </button>
      </div>
      
      {/* Chat Area */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '1rem',
          minHeight: '300px',
          background: '#f2f2f2',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: 'column-reverse'  // THIS is what pushes newest messages down
        }}
      >
        {[...chatHistory].reverse().map((msg, index) => (
          <div key={index} style={{ marginBottom: '1rem', textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <div
              style={{
                display: 'inline-block',
                padding: '0.75rem',
                borderRadius: '10px',
                backgroundColor: msg.sender === 'user' ? '#d1e7dd' : '#fff',
                maxWidth: '80%',
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'Gemini'}:</strong>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
            </div>
          </div>
        ))}
      </div>

      {/* Input Bar (fixed at bottom) */}
      <div style={{ display: 'flex', padding: '1rem', borderTop: '1px solid #ccc', backgroundColor: 'white' }}>
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask your question..."
          style={{ flex: 1, padding: '0.5rem' }}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend} disabled={loading} style={{ marginLeft: '0.5rem' }}>
          {loading ? 'Thinking...' : 'Send'}
        </button>
      </div>
    </div>
  );
}

export default Chatbot;