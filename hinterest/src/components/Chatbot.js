import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { saveNote } from '../services/NotesService';
import { 
  getGeminiResponse, 
  getChatHistoryForSubject, 
  clearChatHistory,
  saveChatHistoryToLocalStorage,
  loadChatHistoryFromLocalStorage
} from '../services/GeminiService';

function Chatbot({ subject }) {
  const [question, setQuestion] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const currentSubjectRef = useRef(null);

  // Extract subject ID consistently
  const getSubjectId = (subjectObj) => {
    if (!subjectObj) return null;
    return typeof subjectObj === 'object' ? subjectObj._id : subjectObj;
  };

  // Extract subject name consistently
  const getSubjectName = (subjectObj) => {
    if (!subjectObj) return 'Unknown Subject';
    
    if (typeof subjectObj === 'object' && subjectObj.name) {
      return subjectObj.name;
    }
    
    // If it's just an ID, try to get the name from localStorage
    const subjectId = getSubjectId(subjectObj);
    const subjectData = localStorage.getItem(`subject_${subjectId}`);
    if (subjectData) {
      try {
        const parsedData = JSON.parse(subjectData);
        return parsedData.name || subjectId;
      } catch (e) {
        return subjectId;
      }
    }
    
    return subjectId;
  };

  // Set subject name and load chat history when subject changes
  useEffect(() => {
    if (!subject) return;
    
    const subjectId = getSubjectId(subject);
    const name = getSubjectName(subject);
    
    // Save current subject ID to ref for comparison
    currentSubjectRef.current = subjectId;
    setSubjectName(name);
    
    // First try to load from localStorage
    const localStorageHistory = loadChatHistoryFromLocalStorage(subjectId);
    
    if (localStorageHistory && localStorageHistory.length > 0) {
      setChatHistory(localStorageHistory);
    } else {
      // If not in localStorage, try in-memory
      const memoryHistory = getChatHistoryForSubject(subjectId);
      if (memoryHistory && memoryHistory.length > 0) {
        setChatHistory(memoryHistory);
        // Also save to localStorage for persistence
        saveChatHistoryToLocalStorage(subjectId, memoryHistory);
      } else {
        setChatHistory([]);
      }
    }
  }, [subject]);

  // Save chat history to both memory and localStorage whenever it changes
  useEffect(() => {
    if (chatHistory.length > 0 && currentSubjectRef.current) {
      const subjectId = currentSubjectRef.current;
      saveChatHistoryToLocalStorage(subjectId, chatHistory);
    }
  }, [chatHistory]);

  const handleSend = async () => {
    if (!question.trim()) return;
    
    const subjectId = getSubjectId(subject);
    if (!subjectId) return;
  
    const newUserMessage = { sender: 'user', text: question };
    const updatedChat = [...chatHistory, newUserMessage];
  
    setChatHistory(updatedChat);
    setQuestion('');
    setLoading(true);
  
    try {
      // Pass the subject ID to getGeminiResponse
      const answer = await getGeminiResponse(updatedChat, subjectId);
      const botMessage = { sender: 'gemini', text: answer };
      setChatHistory((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error getting Gemini response:", error);
      const errorMessage = { sender: 'gemini', text: "Gemini didn't respond. Please try again." };
      setChatHistory((prev) => [...prev, errorMessage]);
    }
  
    setLoading(false);
  };

  // Clear chat history for this subject
  const handleClearChat = () => {
    const subjectId = getSubjectId(subject);
    if (!subjectId) return;
    
    setChatHistory([]);
    clearChatHistory(subjectId);
    localStorage.removeItem(`chat_history_${subjectId}`);
  };

  // Function to save a message as a note
  const saveMessageAsNote = (message) => {
    const subjectId = getSubjectId(subject);
    if (!subjectId) {
      console.error('Cannot save note: No subject ID available');
      alert('Failed to save note: No subject selected.');
      return;
    }
    
    console.log('Saving message as note for subject:', subjectId);
    console.log('Message content:', message.text);
    
    if (saveNote(subjectId, message.text)) {
      console.log('Note saved successfully');
      alert('Message saved as note!');
    } else {
      console.error('Failed to save note');
      alert('Failed to save note. Please try again.');
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '90vh' }}>
      {/* Subject Title */}
      <h2 style={{ marginBottom: '1rem' }}>Chat with {subjectName}</h2>
      
      {/* Clear Chat Button */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button 
          onClick={handleClearChat}
          style={{ 
            padding: '0.25rem 0.5rem',
            backgroundColor: '#ffffff',
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
          background: '#ffe6ff',//chat color
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
                backgroundColor: msg.sender === 'user' ? '#ffffb3' : '#ffffff',//your message color and AI message
                maxWidth: '80%',
              }}
            >
              <strong>{msg.sender === 'user' ? 'You' : 'Gemini'}:</strong>
              <ReactMarkdown>{msg.text}</ReactMarkdown>
              
              {/* Add Save as Note button for Gemini messages */}
              {msg.sender === 'gemini' && (
                <div style={{ textAlign: 'right', marginTop: '0.5rem' }}>
                  <button
                    onClick={() => saveMessageAsNote(msg)}
                    style={{
                      fontSize: '0.8rem',
                      padding: '0.25rem 0.5rem',
                      backgroundColor: '#ffffff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Save as Note
                  </button>
                </div>
              )}
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