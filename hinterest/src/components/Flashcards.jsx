import React, { useState, useEffect } from 'react';

export default function Flashcards({ subject }) {
  const [flashcards, setFlashcards] = useState(() => {
    // Load from localStorage if exists
    const saved = localStorage.getItem(`flashcards-${subject}`);
    return saved ? JSON.parse(saved) : [];
  });
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

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
    
    // Adjust current card index if needed
    if (index <= currentCardIndex && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const startEditing = (index) => {
    setEditingIndex(index);
    setEditQuestion(flashcards[index].question);
    setEditAnswer(flashcards[index].answer);
  };

  const saveEdit = (index) => {
    if (editQuestion.trim() && editAnswer.trim()) {
      const updatedCards = [...flashcards];
      updatedCards[index] = {
        question: editQuestion,
        answer: editAnswer
      };
      setFlashcards(updatedCards);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
    setEditQuestion('');
    setEditAnswer('');
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
        <button 
          onClick={addCard} 
          style={{ 
            marginTop: '0.5rem', 
            backgroundColor: '#4CAF50', 
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Add Flashcard
        </button>
      </div>

      {flashcards.length === 0 ? (
        <p>No flashcards yet.</p>
      ) : (
        <div>
          {/* Flashcard display */}
          <div 
            onClick={flipCard}
            style={{ 
              width: '100%',
              height: '200px',
              perspective: '1000px',
              marginBottom: '2rem', /* Increased margin to create more space */
              cursor: 'pointer'
            }}
          >
            <div style={{
              position: 'relative',
              width: '100%',
              height: '100%',
              textAlign: 'center',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: isFlipped ? 'rotateY(180deg)' : '',
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
              borderRadius: '8px'
            }}>
              {/* Front of card (Question) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#f8f8f8',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div>
                  <h4>Question:</h4>
                  <p>{flashcards[currentCardIndex]?.question}</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>
                    (Click to flip)
                  </p>
                </div>
              </div>
              
              {/* Back of card (Answer) */}
              <div style={{
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#b3ffb3',
                transform: 'rotateY(180deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div>
                  <h4>Answer:</h4>
                  <p>{flashcards[currentCardIndex]?.answer}</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>
                    (Click to flip)
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Navigation controls - moved down with more space and styled buttons */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            marginBottom: '2rem',
            marginTop: '1rem' /* Added top margin for more separation */
          }}>
            <button 
              onClick={prevCard} 
              disabled={currentCardIndex === 0}
              style={{ 
                opacity: currentCardIndex === 0 ? 0.5 : 1,
                backgroundColor: '#2196F3', /* Blue color for navigation */
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: currentCardIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
            <button 
              onClick={nextCard} 
              disabled={currentCardIndex === flashcards.length - 1}
              style={{ 
                opacity: currentCardIndex === flashcards.length - 1 ? 0.5 : 1,
                backgroundColor: '#2196F3', /* Blue color for navigation */
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: currentCardIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer'
              }}
            >
              Next
            </button>
          </div>
          
          {/* List of all cards for management */}
          <h4>All Flashcards:</h4>
          <div>
            {flashcards.map((card, idx) => (
              <div key={idx} style={{ 
                marginBottom: '0.5rem', 
                background: currentCardIndex === idx ? '#f0f7ff' : '#f1f1f1', 
                padding: '0.5rem', 
                borderRadius: '4px',
                border: currentCardIndex === idx ? '1px solid #4285f4' : 'none'
              }}>
                {editingIndex === idx ? (
                  <div>
                    <input
                      type="text"
                      value={editQuestion}
                      onChange={(e) => setEditQuestion(e.target.value)}
                      style={{ 
                        width: '100%', 
                        marginBottom: '0.5rem',
                        padding: '0.25rem'
                      }}
                    />
                    <textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      style={{ 
                        width: '100%', 
                        marginBottom: '0.5rem',
                        padding: '0.25rem'
                      }}
                      rows={2}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => saveEdit(idx)}
                        style={{
                          backgroundColor: '#4CAF50',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Save
                      </button>
                      <button 
                        onClick={cancelEdit}
                        style={{
                          backgroundColor: '#9e9e9e',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <strong>Q:</strong> {card.question.substring(0, 30)}{card.question.length > 30 ? '...' : ''}<br />
                    <strong>A:</strong> {card.answer.substring(0, 30)}{card.answer.length > 30 ? '...' : ''}<br />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button 
                        onClick={() => setCurrentCardIndex(idx)}
                        style={{
                          backgroundColor: '#2196F3',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Study
                      </button>
                      <button 
                        onClick={() => startEditing(idx)}
                        style={{
                          backgroundColor: '#FF9800',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => deleteCard(idx)}
                        style={{
                          backgroundColor: '#F44336',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: 'pointer'
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}