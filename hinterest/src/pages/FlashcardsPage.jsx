import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const FlashcardsPage = () => {
  const [flashcards, setFlashcards] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState({});
  const [currentSubject, setCurrentSubject] = useState('');
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'multiple'
  const [currentIndex, setCurrentIndex] = useState(0); // Add this line

  // Load flashcards and subject when component mounts
  useEffect(() => {
    const savedSubject = sessionStorage.getItem('currentFlashcardSubject');
    if (savedSubject) {
      setCurrentSubject(savedSubject);
      const savedCards = sessionStorage.getItem(`flashcards_${savedSubject}`);
      if (savedCards) {
        setFlashcards(JSON.parse(savedCards));
      }
    }
  }, []);

  // Update sessionStorage when subject changes
  useEffect(() => {
    if (currentSubject) {
      sessionStorage.setItem('currentFlashcardSubject', currentSubject);
      const savedCards = sessionStorage.getItem(`flashcards_${currentSubject}`);
      if (savedCards) {
        setFlashcards(JSON.parse(savedCards));
      } else {
        setFlashcards([]);
      }
    }
  }, [currentSubject]);

  // Save flashcards to sessionStorage
  const saveFlashcards = (cards) => {
    if (currentSubject) {
      sessionStorage.setItem(`flashcards_${currentSubject}`, JSON.stringify(cards));
      setFlashcards(cards);
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      const newCard = {
        id: Date.now(),
        question: question,
        answer: answer
      };
      saveFlashcards([...flashcards, newCard]);
      setQuestion('');
      setAnswer('');
      setShowForm(false);
    }
  };

  const toggleAnswer = (cardId) => {
    setShowAnswer(prev => ({
      ...prev,
      [cardId]: !prev[cardId]
    }));
  };

  const handleDeleteCard = (cardId) => {
    const updatedCards = flashcards.filter(card => card.id !== cardId);
    saveFlashcards(updatedCards);
  };

  const handleEditCard = (card) => {
    setQuestion(card.question);
    setAnswer(card.answer);
    setShowForm(true);
    handleDeleteCard(card.id);
  };

  // Add these navigation functions
  const handleNext = () => {
    if (currentIndex < flashcards.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer({});
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer({});
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Flashcards</h2>
        
        {/* Subject Selection */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={currentSubject}
            onChange={(e) => setCurrentSubject(e.target.value)}
            placeholder="Enter subject name"
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>

        {/* View Mode Toggle and Control Buttons */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setViewMode(viewMode === 'single' ? 'multiple' : 'single')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {viewMode === 'single' ? 'Switch to Multiple Cards View' : 'Switch to Single Card View'}
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {showForm ? 'Cancel' : 'Add Flashcard'}
          </button>
          {flashcards.length > 0 && (
            <>
              <button
                onClick={() => handleEditCard(flashcards[currentIndex])}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#ffc107',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Edit Current Card
              </button>
              <button
                onClick={() => handleDeleteCard(flashcards[currentIndex].id)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete Current Card
              </button>
            </>
          )}
        </div>

        {/* Flashcard Form */}
        {showForm && (
          <form onSubmit={handleAddCard} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <textarea
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter answer"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd',
                  minHeight: '100px'
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Flashcard
            </button>
          </form>
        )}

        {/* Flashcards Display */}
        <div style={{ 
          display: viewMode === 'multiple' ? 'grid' : 'flex',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '20px',
          justifyContent: viewMode === 'single' ? 'center' : 'start',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {viewMode === 'single' && flashcards.length > 0 ? (
            <>
              <div
                onClick={() => toggleAnswer(flashcards[currentIndex].id)}
                style={{
                  width: '400px',
                  height: '250px',
                  perspective: '1000px',
                  cursor: 'pointer',
                  marginBottom: '20px'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: showAnswer[flashcards[currentIndex].id] ? 'rotateY(180deg)' : '',
                  boxShadow: 'none',
                  border: '2px solid black',
                  borderRadius: '0px',
                  boxSizing: 'border-box'
                }}>
                  {/* Front of card */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '0px',
                    fontSize: '1.2em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    {flashcards[currentIndex].question}
                  </div>

                  {/* Back of card */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '0px',
                    fontSize: '1.2em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    {flashcards[currentIndex].answer}
                  </div>
                </div>
              </div>

              {/* Navigation Controls */}
              <div style={{ 
                display: 'flex', 
                gap: '10px', 
                alignItems: 'center',
                marginTop: '20px'
              }}>
                <button
                  onClick={handlePrevious}
                  disabled={currentIndex === 0}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === 0 ? 0.6 : 1
                  }}
                >
                  Previous
                </button>
                <span>Card {currentIndex + 1} of {flashcards.length}</span>
                <button
                  onClick={handleNext}
                  disabled={currentIndex === flashcards.length - 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentIndex === flashcards.length - 1 ? 0.6 : 1
                  }}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            flashcards.map(card => (
              <div
                key={card.id}
                onClick={() => toggleAnswer(card.id)}
                style={{
                  width: '100%',
                  height: '200px',
                  perspective: '1000px',
                  cursor: 'pointer',
                  marginBottom: '10px'
                }}
              >
                <div style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transition: 'transform 0.6s',
                  transformStyle: 'preserve-3d',
                  transform: showAnswer[card.id] ? 'rotateY(180deg)' : '',
                  boxShadow: 'none',
                  border: '2px solid black',
                  borderRadius: '0px',
                  boxSizing: 'border-box'
                }}>
                  {/* Front of card */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '0px',
                    fontSize: '1em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    {card.question}
                  </div>

                  {/* Back of card */}
                  <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    backgroundColor: 'white',
                    transform: 'rotateY(180deg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '20px',
                    borderRadius: '0px',
                    fontSize: '1em',
                    textAlign: 'center',
                    boxSizing: 'border-box'
                  }}>
                    {card.answer}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardsPage;