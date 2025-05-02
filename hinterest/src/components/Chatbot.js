import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { getGeminiResponse } from '../services/GeminiService';

function Chatbot({ subject }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef();

  const handleSend = async () => {
    if (!question.trim()) return;

    const newUserMessage = { sender: 'user', text: question };
    const updatedChat = [...chatHistory, newUserMessage];

    setChatHistory(updatedChat);
    setQuestion('');
    setLoading(true);

    try {
      const answer = await getGeminiResponse(updatedChat); // pass full history
      const botMessage = { sender: 'gemini', text: answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { sender: 'gemini', text: "Gemini didn't respond. Please try again." };
      setChatHistory((prev) => [...prev, errorMessage]);
    }

    setLoading(false);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!['text/plain', 'text/markdown'].includes(file.type)) {
      alert('Only .txt or .md files are supported.');
      return;
    }

    if (file.size > 1024 * 1024) {
      alert('File size must be under 1MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const fileContent = e.target.result;
      const prompt = `Analyze the following document for key takeaways and insights:\n\n${fileContent}`;
      setQuestion(prompt);
    };
    reader.readAsText(file);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
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
          flexDirection: 'column-reverse'
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
        <button onClick={handleUploadClick} style={{ marginRight: '0.5rem' }} title="Upload Document">
          ➕
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileUpload}
          accept=".txt,.md"
          style={{ display: 'none' }}
        />
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