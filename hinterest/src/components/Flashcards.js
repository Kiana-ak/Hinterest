// Flashcard System JavaScript
// This file implements a flashcard system that allows users to create and interact with flashcards

// Flashcard class representing a single flashcard

import React, { useState, useEffect } from 'react';
import './Flashcards.css';

const Flashcards = () => {
  // State for flashcards
  const [flashcards, setFlashcards] = useState([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);
  const [newTerm, setNewTerm] = useState('');
  const [newDefinition, setNewDefinition] = useState('');
  const [newTopic, setNewTopic] = useState('');
  const [activeTab, setActiveTab] = useState('study');
  
  // Topics management
  const [topics, setTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('all');
  const [newTopicName, setNewTopicName] = useState('');
  const [isAddingTopic, setIsAddingTopic] = useState(false);
  
  // Filtered cards based on selected topic
  const [filteredCards, setFilteredCards] = useState([]);

  // Load flashcards and topics from localStorage on component mount
  useEffect(() => {
    const savedCards = localStorage.getItem('flashcards');
    if (savedCards) {
      const parsedCards = JSON.parse(savedCards);
      setFlashcards(parsedCards);
      
      // Extract unique topics from cards
      const uniqueTopics = [...new Set(parsedCards.map(card => card.topic))].filter(Boolean);
      setTopics(uniqueTopics);
    }
  }, []);

  // Save flashcards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    
    // Update topics list when cards change
    const uniqueTopics = [...new Set(flashcards.map(card => card.topic))].filter(Boolean);
    setTopics(uniqueTopics);
  }, [flashcards]);

  // Filter cards based on selected topic
  useEffect(() => {
    if (selectedTopic === 'all') {
      setFilteredCards(flashcards);
    } else {
      setFilteredCards(flashcards.filter(card => card.topic === selectedTopic));
    }
    
    // Reset current card index when filtered cards change
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [selectedTopic, flashcards]);

  // Handle form submission for adding/editing cards
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const cardData = { 
      term: newTerm, 
      definition: newDefinition,
      topic: newTopic 
    };
    
    if (isEditing && editIndex !== null) {
      // Update existing card
      const updatedCards = [...flashcards];
      updatedCards[editIndex] = cardData;
      setFlashcards(updatedCards);
      resetForm();
    } else {
      // Add new card
      setFlashcards([...flashcards, cardData]);
      // Reset just the term and definition but keep the selected topic
      setNewTerm('');
      setNewDefinition('');
    }
  };

  // Add a new topic
  const handleAddTopic = (e) => {
    e.preventDefault();
    if (newTopicName && !topics.includes(newTopicName)) {
      setTopics([...topics, newTopicName]);
      setNewTopic(newTopicName);
      setNewTopicName('');
      setIsAddingTopic(false);
    }
  };

  // Start editing a card
  const handleEdit = (index) => {
    setIsEditing(true);
    setEditIndex(index);
    setNewTerm(flashcards[index].term);
    setNewDefinition(flashcards[index].definition);
    setNewTopic(flashcards[index].topic || '');
    setActiveTab('manage');
  };

  // Delete a card
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this card?')) {
      const updatedCards = flashcards.filter((_, i) => i !== index);
      setFlashcards(updatedCards);
      
      // Adjust current index if needed
      if (currentCardIndex >= filteredCards.length - 1) {
        setCurrentCardIndex(Math.max(0, filteredCards.length - 2));
      }
    }
  };

  // Reset the form
  const resetForm = () => {
    setIsEditing(false);
    setEditIndex(null);
    setNewTerm('');
    setNewDefinition('');
    // We don't reset the topic to allow for quick adding of multiple cards to the same topic
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
    if (currentCardIndex < filteredCards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  // Flip the current card
  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  // Delete topic and all associated cards
  const handleDeleteTopic = (topic) => {
    if (window.confirm(`Are you sure you want to delete the topic "${topic}" and all its cards?`)) {
      // Remove all cards with this topic
      const updatedCards = flashcards.filter(card => card.topic !== topic);
      setFlashcards(updatedCards);
      
      // Reset selected topic if the current one is being deleted
      if (selectedTopic === topic) {
        setSelectedTopic('all');
      }
    }
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
        <button 
          className={`tab ${activeTab === 'topics' ? 'active' : ''}`}
          onClick={() => setActiveTab('topics')}
        >
          Topics
        </button>
      </div>
      
      {activeTab === 'study' && (
        <div className="study-tab">
          <div className="topic-selector">
            <label htmlFor="topic-select">Study Topic:</label>
            <select 
              id="topic-select" 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="all">All Topics</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          
          {filteredCards.length > 0 ? (
            <>
              <div 
                className={`card ${isFlipped ? 'flipped' : ''}`} 
                onClick={handleFlip}
              >
                <div className="card-inner">
                  <div className="card-front">
                    <div className="card-topic-tag">
                      {filteredCards[currentCardIndex].topic || 'No Topic'}
                    </div>
                    <p>{filteredCards[currentCardIndex].term}</p>
                  </div>
                  <div className="card-back">
                    <div className="card-topic-tag">
                      {filteredCards[currentCardIndex].topic || 'No Topic'}
                    </div>
                    <p>{filteredCards[currentCardIndex].definition}</p>
                  </div>
                </div>
              </div>
              
              <div className="counter">
                {currentCardIndex + 1} / {filteredCards.length}
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
                  disabled={currentCardIndex === filteredCards.length - 1}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="empty-state">
              {topics.length > 0 && selectedTopic !== 'all' ? (
                <p>No flash cards in this topic yet. Go to the "Manage Cards" tab to add some!</p>
              ) : (
                <p>No flash cards yet. Go to the "Manage Cards" tab to add some!</p>
              )}
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
              
              <div className="form-group">
                <label htmlFor="topic">Topic:</label>
                <div className="topic-input-group">
                  <select
                    id="topic"
                    value={newTopic}
                    onChange={(e) => setNewTopic(e.target.value)}
                  >
                    <option value="">No Topic</option>
                    {topics.map((topic, index) => (
                      <option key={index} value={topic}>
                        {topic}
                      </option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    className="add-topic-btn"
                    onClick={() => setIsAddingTopic(true)}
                  >
                    + New Topic
                  </button>
                </div>
              </div>
              
              {isAddingTopic && (
                <div className="form-group">
                  <label htmlFor="new-topic">New Topic Name:</label>
                  <div className="topic-input-group">
                    <input
                      type="text"
                      id="new-topic"
                      value={newTopicName}
                      onChange={(e) => setNewTopicName(e.target.value)}
                      required
                    />
                    <button 
                      type="button"
                      onClick={handleAddTopic}
                    >
                      Add
                    </button>
                    <button 
                      type="button" 
                      className="cancel-btn"
                      onClick={() => setIsAddingTopic(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
              
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
          
          <div className="card-list-filter">
            <label htmlFor="filter-topic">Filter by Topic:</label>
            <select 
              id="filter-topic" 
              value={selectedTopic} 
              onChange={(e) => setSelectedTopic(e.target.value)}
            >
              <option value="all">All Topics</option>
              {topics.map((topic, index) => (
                <option key={index} value={topic}>
                  {topic}
                </option>
              ))}
            </select>
          </div>
          
          <div className="card-list">
            <h2>Your Flash Cards</h2>
            {filteredCards.length > 0 ? (
              <ul>
                {filteredCards.map((card, index) => {
                  // Find the actual index in the full flashcards array
                  const fullIndex = flashcards.indexOf(card);
                  return (
                    <li key={fullIndex} className="card-item">
                      <div className="card-details">
                        <div className="card-text">{card.term}</div>
                        {card.topic && <div className="card-topic">{card.topic}</div>}
                      </div>
                      <div className="card-actions">
                        <button 
                          className="edit-btn"
                          onClick={() => handleEdit(fullIndex)}
                        >
                          Edit
                        </button>
                        <button 
                          className="delete-btn"
                          onClick={() => handleDelete(fullIndex)}
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="empty-list">
                {selectedTopic !== 'all' ? 
                  `No flash cards in the "${selectedTopic}" topic yet.` : 
                  'No flash cards added yet'
                }
              </p>
            )}
          </div>
        </div>
      )}
      
      {activeTab === 'topics' && (
        <div className="topics-tab">
          <div className="topics-management">
            <h2>Manage Topics</h2>
            
            <div className="add-topic-form">
              <form onSubmit={handleAddTopic}>
                <div className="topic-input-group">
                  <input
                    type="text"
                    value={newTopicName}
                    onChange={(e) => setNewTopicName(e.target.value)}
                    placeholder="New topic name"
                    required
                  />
                  <button type="submit">Add Topic</button>
                </div>
              </form>
            </div>
            
            <div className="topics-list">
              <h3>Your Topics</h3>
              {topics.length > 0 ? (
                <ul>
                  {topics.map((topic, index) => {
                    const cardsInTopic = flashcards.filter(card => card.topic === topic).length;
                    return (
                      <li key={index} className="topic-item">
                        <div className="topic-details">
                          <div className="topic-name">{topic}</div>
                          <div className="topic-count">{cardsInTopic} card{cardsInTopic !== 1 ? 's' : ''}</div>
                        </div>
                        <div className="topic-actions">
                          <button 
                            className="study-btn"
                            onClick={() => {
                              setSelectedTopic(topic);
                              setActiveTab('study');
                            }}
                          >
                            Study
                          </button>
                          <button 
                            className="delete-btn"
                            onClick={() => handleDeleteTopic(topic)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="empty-list">No topics added yet</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flashcards;
