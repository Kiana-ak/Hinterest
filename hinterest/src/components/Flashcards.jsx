import React, { useState, useEffect } from 'react';

export default function Flashcards({ subject }) {
  const [flashcards, setFlashcards] = useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem(`flashcards-${subject}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  useEffect(() => {
    localStorage.setItem(`flashcards-${subject}`, JSON.stringify(flashcards));
  }, [flashcards, subject]);

  const addCard = () => {
    if (question.trim() && answer.trim()) {
      setFlashcards([...flashcards, { question, answer }]);
      setQuestion('');
      setAnswer('');
    }
  };

  const deleteCard = (index) => {
    const updated = [...flashcards];
    updated.splice(index, 1);
    setFlashcards(updated);
  };

  return (
    <div>
      <h3>{subject} Flashcards</h3>

      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          value={question}
          placeholder="Question"
          onChange={(e) => setQuestion(e.target.value)}
          style={{ width: '100%', marginBottom: '0.5rem' }}
        />
        <textarea
          value={answer}
          placeholder="Answer"
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          style={{ width: '100%' }}
        />
        <button onClick={addCard} style={{ marginTop: '0.5rem' }}>Add Flashcard</button>
      </div>

      <div>
        {flashcards.length === 0 ? <p>No flashcards yet.</p> : (
          flashcards.map((card, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', background: '#f1f1f1', padding: '1rem', borderRadius: '8px' }}>
              <strong>Q:</strong> {card.question}<br />
              <strong>A:</strong> {card.answer}<br />
              <button onClick={() => deleteCard(idx)}>Delete</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}