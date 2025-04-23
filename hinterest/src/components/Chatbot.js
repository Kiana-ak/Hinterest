import React, { useState } from 'react';
import { getGeminiResponse } from '../services/GeminiService';

function Chatbot() {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Handle Ask button
  const handleAsk = async () => {
    if (!question.trim()) return;

    setLoading(true);
    setErrorMsg('');
    setResponse('');

    try {
      const answer = await getGeminiResponse(question);
      setResponse(answer);
    } catch (error) {
      console.error(error);
      setErrorMsg("Gemini didn't respond. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div style={{ marginTop: '1rem' }}>
      {/* Input area */}
      <textarea
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Ask something about your subject..."
        rows={4}
        style={{ width: '100%', marginBottom: '0.5rem' }}
      />
      <button onClick={handleAsk} disabled={loading}>
        {loading ? 'Thinking...' : 'Ask Gemini'}
      </button>

      {/* Error message */}
      {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}

      {/* Gemini answer with action buttons */}
      {response && (
        <div style={{ marginTop: '1rem', background: '#f9f9f9', padding: '1rem', borderRadius: '8px' }}>
          <strong>Gemini:</strong>
          <p>{response}</p>

          <div style={{ marginTop: '0.5rem' }}>
            <button style={{ marginRight: '0.5rem' }}>🧠 Create Flashcard</button>
            <button style={{ marginRight: '0.5rem' }}>📝 Create Notes</button>
            <button> Create Quiz</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Chatbot;
