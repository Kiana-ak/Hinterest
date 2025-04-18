// Flashcard System JavaScript
// This file implements a flashcard system that allows users to create and interact with flashcards

// Flashcard class representing a single flashcard
import React, { useState, useEffect } from 'react';
import './Flashcards.css'; // Make sure to create this CSS file

const Flashcards = () => {
  // State for flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [activeTab, setActiveTab] = useState('study');

  // Load flashcards from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      setFlashcards(JSON.parse(savedCards));
    }
  }, []);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
  }, [flashcards]);

  // Handle form submission for adding/editing cards
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (isEditing && editIndex !== null) {
      // Update existing card
      const updatedCards = [...flashcards];
      updatedCards[editIndex] = { term: newTerm, definition: newDefinition };
      setFlashcards(updatedCards);
      resetForm();
    } else {
      // Add new card
      setFlashcards([...flashcards, { term: newTerm, definition: newDefinition }]);
      setNewTerm('');
      setNewDefinition('');
    }
  };

  // Start editing a card
  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewTerm(flashcards[index].term);
    setNewDefinition(flashcards[index].definition);
    setActiveTab('manage');
  };

  // Delete a card
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const updatedCards = flashcards.filter((_, i) => i !== index);
      setFlashcards(updatedCards);
      
      // Adjust current index if needed
      if (currentCardIndex >= updatedCards.length) {
        setCurrentCardIndex(Math.max(0, updatedCards.length - 1));
      }
    }
  };

  // Reset the form
  const resetForm = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewTerm('');
    setNewDefinition('');
  };

  // Navigate to previous card
  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // Navigate to next card
  const handleNext = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  // Flip the current card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className="flashcards-container">
      <h1>Flash Cards</h1>
      
      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'study' ? 'active' : ''}`}
          onClick={() => setActiveTab('study')}
        >
          Study
        </button>
        <button 
          className={`tab ${activeTab === 'manage' ? 'active' : ''}`}
          onClick={() => setActiveTab('manage')}
        >
          Manage Cards
        </button>
      </div>
      
      {activeTab === 'study' && (
        <div className="study-tab">
          {flashcards.length > 0 ? (
            <>
              <div 
                className={`card ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleFlip}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <p>{flashcards[currentCardIndex].term}</p>
                  </div>
                  <div className="card-back">
                    <p>{flashcards[currentCardIndex].definition}</p>
                  </div>
                </div>
              </div>
              
              <div className="counter">
                {currentCardIndex + 1} / {flashcards.length}
              </div>
              
              <div className="navigation">
                <button 
                  onClick={handlePrevious}
                  disabled={currentCardIndex === 0}
                >
                  Previous
                </button>
                <button onClick={handleFlip}>Flip Card</button>
                <button 
                  onClick={handleNext}
                  disabled={currentCardIndex === flashcards.length - 1}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <p>No flash cards yet. Go to the "Manage Cards" tab to add some!</p>
            </div>
          )}
        </div>
      )}
      
      {activeTab === 'manage' && (
        <div className="manage-tab">
          <div className="card-form">
            <h2>{isEditing ? 'Edit Card' : 'Add New Card'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="term">Term:</label>
                <input
                  type="text"
                  id="term"
                  value={newTerm}
                  onChange={(e) => setNewTerm(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="definition">Definition:</label>
                <textarea
                  id="definition"
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  required
                />
              </div>
              
              <div className="form-actions">
                <button type="submit">
                  {isEditing ? 'Update Card' : 'Add Card'}
                </button>
                
                {isEditing && (
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
          
          <div className="card-list">
            <h2>Your Flash Cards</h2>
            {flashcards.length > 0 ? (
              <ul>
                {flashcards.map((card, index) => (
                  <li key={index} className="card-item">
                    <div className="card-text">{card.term}</div>
                    <div className="card-actions">
                      <button 
                        className="edit-btn"
                        onClick={() => handleEdit(index)}
                      >
                        Edit
                      </button>
                      <button 
                        className="delete-btn"
                        onClick={() => handleDelete(index)}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="empty-list">No flash cards added yet</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;