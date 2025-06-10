import React, { useState, useEffect } from 'react';
import '../styles/Flashcards.css';

export default function Flashcards({ subject }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editQuestion, setEditQuestion] = useState('');
  const [editAnswer, setEditAnswer] = useState('');
  const [showAllCards, setShowAllCards] = useState(false);

  useEffect(() => {
    const fetchFlashcards = async () => {
      if (!subject) return;
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/flashcards/subject/${subject}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (!response.ok) throw new Error('Failed to fetch flashcards');
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

  const addCard = async () => {
    if (!question.trim() || !answer.trim()) return;
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8080/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ term: question, description: answer, subjectId: subject })
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
      const response = await fetch(`http://localhost:8080/api/flashcards/${cardId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to delete flashcard');
      setFlashcards(flashcards.filter((card) => card._id !== cardId));
      if (currentCardIndex >= flashcards.length - 1 && currentCardIndex > 0) {
        setCurrentCardIndex(currentCardIndex - 1);
      }
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      alert('Error deleting flashcard');
    }
  };

  const flipCard = () => setIsFlipped(!isFlipped);
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
      const response = await fetch(`http://localhost:8080/api/flashcards/${card._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ term: editQuestion, description: editAnswer })
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
    <div className="flashcards-container">
      <div className="flashcard-form">
        <input type="text" value={question} placeholder="Question" onChange={(e) => setQuestion(e.target.value)} />
        <textarea value={answer} placeholder="Answer" onChange={(e) => setAnswer(e.target.value)} rows={3} />
        <button onClick={addCard}>Add Flashcard</button>
      </div>
  
      {flashcards.length === 0 ? (
        <p>No flashcards yet.</p>
      ) : (
        <>
          <div className="flashcard-wrapper" onClick={flipCard}>
            <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
              <div className="flashcard-front">
                <h4>Question:</h4>
                <p>{flashcards[currentCardIndex]?.term}</p>
                <small>(Click to flip)</small>
              </div>
              <div className="flashcard-back">
                <h4>Answer:</h4>
                <p>{flashcards[currentCardIndex]?.description}</p>
                <small>(Click to flip)</small>
              </div>
            </div>
          </div>
  
          <div className="flashcard-nav">
            <button onClick={prevCard} disabled={currentCardIndex === 0}>Previous</button>
            <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
            <button onClick={nextCard} disabled={currentCardIndex === flashcards.length - 1}>Next</button>
          </div>
  
          {/* Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
            <h4 style={{ margin: 0 }}>All Flashcards</h4>
            <button
              onClick={() => setShowAllCards(!showAllCards)}
              style={{
                padding: '4px 10px',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: '#696969',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              {showAllCards ? 'Hide' : 'Show'}
            </button>
          </div>
  
          {/* Conditional List Display */}
          {showAllCards && (
            <div className="flashcard-list" style={{ marginTop: '1rem' }}>
              {flashcards.map((card, idx) => (
                <div className="flashcard-item" key={idx}>
                  {editingIndex === idx ? (
                    <>
                      <input value={editQuestion} onChange={(e) => setEditQuestion(e.target.value)} />
                      <textarea value={editAnswer} onChange={(e) => setEditAnswer(e.target.value)} rows={2} />
                      <div className="buttons">
                        <button className="study" onClick={() => saveEdit(idx)}>Save</button>
                        <button className="delete" onClick={cancelEdit}>Cancel</button>
                      </div>
                    </>
                  ) : (
                    <>
                      <strong>Q:</strong> {card.term?.substring(0, 30)}<br />
                      <strong>A:</strong> {card.description?.substring(0, 30)}<br />
                      <div className="buttons">
                        <button className="study" onClick={() => setCurrentCardIndex(idx)}>Study</button>
                        <button className="edit" onClick={() => startEditing(idx)}>Edit</button>
                        <button className="delete" onClick={() => deleteCard(card._id)}>Delete</button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
  }