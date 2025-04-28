import React, { useState, useEffect } from 'react';

const Flashcards = ({ subject }) => {
  // State for flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem(`flashcards-${subject}`);
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    }
  }, [subject]);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`flashcards-${subject}`, JSON.stringify(flashcards));
  }, [flashcards, subject]);

  // Handle creating a new flashcard
  const handleCreateCard = () => {
    if (newCardFront.trim() === '' || newCardBack.trim() === '') {
      alert('Please fill in both sides of the flashcard');
      return;
    }

    const newCard = {
      front: newCardFront,
      back: newCardBack
    };

    setFlashcards([...flashcards, newCard]);
    setNewCardFront('');
    setNewCardBack('');
  };

  // Handle editing a flashcard
  const handleEditCard = (index) => {
    setEditing(true);
    setEditIndex(index);
    setNewCardFront(flashcards[index].front);
    setNewCardBack(flashcards[index].back);
  };

  // Handle saving edits
  const handleSaveEdit = () => {
    if (newCardFront.trim() === '' || newCardBack.trim() === '') {
      alert('Please fill in both sides of the flashcard');
      return;
    }

    const updatedCards = [...flashcards];
    updatedCards[editIndex] = {
      front: newCardFront,
      back: newCardBack
    };

    setFlashcards(updatedCards);
    setNewCardFront('');
    setNewCardBack('');
    setEditing(false);
    setEditIndex(null);
  };

  // Handle removing a flashcard
  const handleRemoveCard = (index) => {
    const updatedCards = flashcards.filter((_, i) => i !== index);
    setFlashcards(updatedCards);
    
    // Adjust current index if necessary
    if (index <= currentIndex && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
    if (flashcards.length === 1) {
      setCurrentIndex(0);
    }
  };

  // Handle flipping the current card
  const handleFlip = () => {
    setFlipped(!flipped);
  };

  // Navigate to the previous card
  const handlePrevCard = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  // Navigate to the next card
  const handleNextCard = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => (prevIndex < flashcards.length - 1 ? prevIndex + 1 : prevIndex));
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setNewCardFront('');
    setNewCardBack('');
    setEditing(false);
    setEditIndex(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Flashcards for {subject}</h2>

      {/* Flashcard display area */}
      {flashcards.length > 0 ? (
        <div style={{ marginBottom: '2rem' }}>
          <div 
            onClick={handleFlip}
            style={{
              width: '100%',
              height: '200px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              padding: '1rem',
              boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
              background: '#fff',
              transition: 'transform 0.6s',
              transformStyle: 'preserve-3d',
              transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {flipped ? (
              <div style={{ transform: 'rotateY(180deg)' }}>
                <h3>Answer:</h3>
                <p>{flashcards[currentIndex].back}</p>
              </div>
            ) : (
              <div>
                <h3>Question:</h3>
                <p>{flashcards[currentIndex].front}</p>
              </div>
            )}
          </div>

          {/* Navigation controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
            <button 
              onClick={handlePrevCard} 
              disabled={currentIndex === 0}
              style={{ padding: '0.5rem 1rem' }}
            >
              Previous
            </button>
            <span>Card {currentIndex + 1} of {flashcards.length}</span>
            <button 
              onClick={handleNextCard} 
              disabled={currentIndex === flashcards.length - 1}
              style={{ padding: '0.5rem 1rem' }}
            >
              Next
            </button>
          </div>

          {/* Edit and Remove buttons */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
            <button 
              onClick={() => handleEditCard(currentIndex)}
              style={{ padding: '0.5rem 1rem' }}
            >
              Edit
            </button>
            <button 
              onClick={() => handleRemoveCard(currentIndex)}
              style={{ padding: '0.5rem 1rem' }}
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <p>No flashcards yet. Create your first one below!</p>
      )}

      {/* Form for creating/editing flashcards */}
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Flashcard' : 'Create New Flashcard'}</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Front (Question):</label>
          <textarea
            value={newCardFront}
            onChange={(e) => setNewCardFront(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Back (Answer):</label>
          <textarea
            value={newCardBack}
            onChange={(e) => setNewCardBack(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', minHeight: '80px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          {editing ? (
            <>
              <button onClick={handleSaveEdit} style={{ padding: '0.5rem 1rem' }}>Save Changes</button>
              <button onClick={handleCancelEdit} style={{ padding: '0.5rem 1rem' }}>Cancel</button>
            </>
          ) : (
            <button onClick={handleCreateCard} style={{ padding: '0.5rem 1rem' }}>Create Flashcard</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Flashcards;