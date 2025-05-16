import React, { useState, useEffect } from 'react';

export default function Flashcards({ subject }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!subject) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/flashcards/subject/${subject}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch flashcards');
        }
        const data = await response.json();
        setFlashcards(data);
      } catch (err) {
        console.error('Error loading flashcards:', err);
        setError('Could not load flashcards');
      } finally {
        setLoading(false);
      }
    };

    fetchFlashcards();
  }, [subject]);


  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');

  const addCard = async () => {
  if (!question.trim() || !answer.trim()) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch('http://localhost:5000/api/flashcards', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        term: question,
        description: answer,
        subjectId: subject
      })
    });

    if (!response.ok) throw new Error('Failed to create flashcard');

    const newCard = await response.json();
    setFlashcards([newCard, ...flashcards]);
    setQuestion('');
    setAnswer('');
  } catch (err) {
    console.error('Error creating flashcard:', err);
    setError('Failed to create flashcard');
  }
};


  const deleteCard = async (cardId) => {
  if (!window.confirm('Are you sure you want to delete this flashcard?')) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/flashcards/${cardId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete flashcard');
    }

    setFlashcards(flashcards.filter((card) => card._id !== cardId));
    if (currentCardIndex >= flashcards.length - 1 && currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  } catch (err) {
    console.error('Error deleting flashcard:', err);
    alert('Error deleting flashcard');
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
    setEditQuestion(flashcards[index].term);
    setEditAnswer(flashcards[index].description);
  };

  const saveEdit = async (index) => {
  const card = flashcards[index];
  if (!editQuestion.trim() || !editAnswer.trim()) return;

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`http://localhost:5000/api/flashcards/${card._id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        term: editQuestion,
        description: editAnswer
      })
    });

    if (!response.ok) throw new Error('Failed to update flashcard');

    const updatedCard = await response.json();
    const updatedCards = [...flashcards];
    updatedCards[index] = updatedCard;
    setFlashcards(updatedCards);
    setEditingIndex(null);
  } catch (err) {
    console.error('Error updating flashcard:', err);
    setError('Failed to update flashcard');
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
          style={{ width: '98%', marginBottom: '0.5rem' }}
        />
        <textarea
          value={answer}
          placeholder="Answer"
          onChange={(e) => setAnswer(e.target.value)}
          rows={3}
          style={{ width: '98%' }}
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
              width: '98%',
              height: '200px',
              perspective: '1000px',
              marginBottom: '2rem', /* Increased margin to create more space */
              cursor: 'pointer'
            }}
          >
            <div style={{
              position: 'relative',
              width: '98%',
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
                width: '98%',
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
                  <p>{flashcards[currentCardIndex]?.term}</p>
                  <p style={{ fontSize: '0.8rem', marginTop: '1rem', color: '#666' }}>
                    (Click to flip)
                  </p>
                </div>
              </div>
              
              {/* Back of card (Answer) */}
              <div style={{
                position: 'absolute',
                width: '98%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#99ffbb',
                transform: 'rotateY(180deg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '1rem',
                borderRadius: '8px'
              }}>
                <div>
                  <h4>Answer:</h4>
                  <p>{flashcards[currentCardIndex]?.description}</p>
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
                        width: '98%', 
                        marginBottom: '0.5rem',
                        padding: '0.25rem'
                      }}
                    />
                    <textarea
                      value={editAnswer}
                      onChange={(e) => setEditAnswer(e.target.value)}
                      style={{ 
                        width: '98%', 
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
                    <strong>Q:</strong> {card.term?.substring(0, 30) || 'Untitled'}{card.term && card.term.length > 30 ? '...' : ''}<br />
<strong>A:</strong> {card.description?.substring(0, 30) || 'No description'}{card.description && card.description.length > 30 ? '...' : ''}<br />


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
                        onClick={() => deleteCard(card._id)}
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