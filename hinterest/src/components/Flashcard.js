import React, { useState, useEffect } from 'react';

function Flashcard({ subject }) {
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' or 'grid'
  const [editMode, setEditMode] = useState(false);
  const [editingCard, setEditingCard] = useState({ term: '', description: '' });
  const [subjectName, setSubjectName] = useState('');
  const [newCardTerm, setNewCardTerm] = useState('');
  const [newCardDescription, setNewCardDescription] = useState('');

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

  // Set subject name and load flashcards when subject changes
  useEffect(() => {
    if (!subject) return;
    
    const subjectId = getSubjectId(subject);
    const name = getSubjectName(subject);
    setSubjectName(name);
    
    fetchFlashcards(subjectId);
  }, [subject]);

  // Fetch flashcards for the selected subject
  const fetchFlashcards = async (subjectId) => {
    if (!subjectId) return;
    
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/flashcards/subject/${subjectId}`, {
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
      console.error('Error fetching flashcards:', err);
      setError('Failed to load flashcards. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Add a new flashcard
  const addFlashcard = async () => {
    if (!newCardTerm.trim() || !newCardDescription.trim()) {
      setError('Both term and description are required');
      return;
    }
    
    const subjectId = getSubjectId(subject);
    if (!subjectId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          term: newCardTerm,
          description: newCardDescription,
          subjectId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to add flashcard');
      }

      const newFlashcard = await response.json();
      setFlashcards([...flashcards, newFlashcard]);
      setNewCardTerm('');
      setNewCardDescription('');
      setError('');
    } catch (err) {
      console.error('Error adding flashcard:', err);
      setError('Failed to add flashcard. Please try again.');
    }
  };

  // Delete a flashcard
  const deleteFlashcard = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/flashcards/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete flashcard');
      }

      setFlashcards(flashcards.filter(card => card._id !== id));
      
      // Adjust current index if needed
      if (currentCardIndex >= flashcards.length - 1) {
        setCurrentCardIndex(Math.max(0, flashcards.length - 2));
      }
    } catch (err) {
      console.error('Error deleting flashcard:', err);
      setError('Failed to delete flashcard. Please try again.');
    }
  };

  // Start editing a flashcard
  const startEditing = (card) => {
    setEditingCard({ ...card });
    setEditMode(true);
  };

  // Save edited flashcard
  const saveFlashcard = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/flashcards/${editingCard._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          term: editingCard.term,
          description: editingCard.description
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update flashcard');
      }

      const updatedCard = await response.json();
      
      setFlashcards(flashcards.map(card => 
        card._id === updatedCard._id ? updatedCard : card
      ));
      
      setEditMode(false);
    } catch (err) {
      console.error('Error updating flashcard:', err);
      setError('Failed to update flashcard. Please try again.');
    }
  };

  // Navigate to the next card
  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  // Navigate to the previous card
  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  // Flip the current card
  const flipCard = () => {
    setIsFlipped(!isFlipped);
  };

  // Toggle between single and grid view
  const toggleViewMode = () => {
    setViewMode(viewMode === 'single' ? 'grid' : 'single');
    setIsFlipped(false);
  };

  // Render loading state
  if (loading) {
    return <div>Loading flashcards...</div>;
  }

  // Render error state
  if (error) {
    return (
      <div>
        <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>
        <div style={{ padding: '1rem' }}>
          <h2>Flashcards for {subjectName}</h2>
          {/* Add flashcard form */}
          <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
            <h3>Add New Flashcard</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term:</label>
              <input
                type="text"
                value={newCardTerm}
                onChange={(e) => setNewCardTerm(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
              <textarea
                value={newCardDescription}
                onChange={(e) => setNewCardDescription(e.target.value)}
                style={{ width: '100%', padding: '0.5rem', minHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
              />
            </div>
            <button
              onClick={addFlashcard}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Add Flashcard
            </button>
          </div>
          
          {/* Display existing flashcards */}
          {flashcards.length > 0 && (
            <div>
              <h3>Existing Flashcards</h3>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: '1rem'
              }}>
                {flashcards.map((card) => (
                  <div 
                    key={card._id}
                    style={{ 
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      padding: '1rem',
                      backgroundColor: 'white',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{card.term}</div>
                    <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '1rem' }}>{card.description}</div>
                    <button 
                      onClick={() => deleteFlashcard(card._id)}
                      style={{ 
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        border: '1px solid #ffcdd2',
                        borderRadius: '4px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // Render edit mode
  if (editMode) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Edit Flashcard</h2>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term:</label>
          <textarea
            value={editingCard.term}
            onChange={(e) => setEditingCard({ ...editingCard, term: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              minHeight: '100px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
          <textarea
            value={editingCard.description}
            onChange={(e) => setEditingCard({ ...editingCard, description: e.target.value })}
            style={{ 
              width: '100%', 
              padding: '0.5rem',
              minHeight: '150px',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
        </div>
        
        <div>
          <button 
            onClick={saveFlashcard}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Save
          </button>
          
          <button 
            onClick={() => setEditMode(false)}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  // Render empty state
  if (flashcards.length === 0) {
    return (
      <div style={{ padding: '1rem' }}>
        <h2>Flashcards for {subjectName}</h2>
        
        {/* Add flashcard form */}
        <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Add New Flashcard</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term:</label>
            <input
              type="text"
              value={newCardTerm}
              onChange={(e) => setNewCardTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', minHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <button
            onClick={addFlashcard}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Add Flashcard
          </button>
        </div>
        
        <p>No flashcards yet. Create your first flashcard using the form above!</p>
      </div>
    );
  }

  // Render single card view
  if (viewMode === 'single') {
    const currentCard = flashcards[currentCardIndex];
    
    return (
      <div style={{ padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Flashcards for {subjectName}</h2>
          
          <div>
            <button 
              onClick={toggleViewMode}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              Grid View
            </button>
            
            <button 
              onClick={() => {
                setNewCardTerm('');
                setNewCardDescription('');
                document.getElementById('addCardForm').style.display = 
                  document.getElementById('addCardForm').style.display === 'none' ? 'block' : 'none';
              }}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Add Flashcard
            </button>
          </div>
        </div>
        
        {/* Add flashcard form (hidden by default) */}
        <div id="addCardForm" style={{ display: 'none', marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>Add New Flashcard</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term:</label>
            <input
              type="text"
              value={newCardTerm}
              onChange={(e) => setNewCardTerm(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
            <textarea
              value={newCardDescription}
              onChange={(e) => setNewCardDescription(e.target.value)}
              style={{ width: '100%', padding: '0.5rem', minHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
            />
          </div>
          <button
            onClick={() => {
              addFlashcard();
              document.getElementById('addCardForm').style.display = 'none';
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Add Flashcard
          </button>
          <button
            onClick={() => {
              document.getElementById('addCardForm').style.display = 'none';
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px'
            }}
          >
            Cancel
          </button>
        </div>
        
        <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
          <span>Card {currentCardIndex + 1} of {flashcards.length}</span>
        </div>
        
        {/* Flashcard */}
        <div 
          onClick={flipCard}
          style={{ 
            width: '100%',
            height: '300px',
            perspective: '1000px',
            cursor: 'pointer',
            marginBottom: '1rem'
          }}
        >
          <div 
            style={{ 
              position: 'relative',
              width: '100%',
              height: '100%',
              transformStyle: 'preserve-3d',
              transition: 'transform 0.6s',
              transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
            }}
          >
            {/* Front of card (Term) */}
            <div 
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ marginBottom: '1rem' }}>Term</h3>
              <div style={{ fontSize: '1.5rem', textAlign: 'center' }}>{currentCard.term}</div>
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>Click to flip</div>
            </div>
            
            {/* Back of card (Description) */}
            <div 
              style={{ 
                position: 'absolute',
                width: '100%',
                height: '100%',
                backfaceVisibility: 'hidden',
                backgroundColor: '#f8f9fa',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '2rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                transform: 'rotateY(180deg)',
                boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
              }}
            >
              <h3 style={{ marginBottom: '1rem' }}>Definition</h3>
              <div style={{ fontSize: '1.2rem', textAlign: 'center' }}>{currentCard.description}</div>
              <div style={{ marginTop: '2rem', fontSize: '0.8rem', color: '#666' }}>Click to flip</div>
            </div>
          </div>
        </div>
        
        {/* Navigation controls */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button 
            onClick={prevCard}
            disabled={currentCardIndex === 0}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: currentCardIndex === 0 ? '#f5f5f5' : '#4285f4',
              color: currentCardIndex === 0 ? '#999' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentCardIndex === 0 ? 'not-allowed' : 'pointer'
            }}
          >
            Previous
          </button>
          
          <div>
            <button 
              onClick={() => startEditing(currentCard)}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              Edit
            </button>
            
            <button 
              onClick={() => deleteFlashcard(currentCard._id)}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#ffebee',
                color: '#d32f2f',
                border: '1px solid #ffcdd2',
                borderRadius: '4px'
              }}
            >
              Delete
            </button>
          </div>
          
          <button 
            onClick={nextCard}
            disabled={currentCardIndex === flashcards.length - 1}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: currentCardIndex === flashcards.length - 1 ? '#f5f5f5' : '#4285f4',
              color: currentCardIndex === flashcards.length - 1 ? '#999' : 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: currentCardIndex === flashcards.length - 1 ? 'not-allowed' : 'pointer'
            }}
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  
  // Render grid view
  return (
    <div style={{ padding: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Flashcards for {subjectName}</h2>
        
        <div>
          <button 
            onClick={toggleViewMode}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#f5f5f5',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            Single Card View
          </button>
          
          <button 
            onClick={() => {
              setNewCardTerm('');
              setNewCardDescription('');
              document.getElementById('gridAddCardForm').style.display = 
                document.getElementById('gridAddCardForm').style.display === 'none' ? 'block' : 'none';
            }}
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            Add Flashcard
          </button>
        </div>
      </div>
      
      {/* Add flashcard form (hidden by default) */}
      <div id="gridAddCardForm" style={{ display: 'none', marginBottom: '1rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>Add New Flashcard</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Term:</label>
          <input
            type="text"
            value={newCardTerm}
            onChange={(e) => setNewCardTerm(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description:</label>
          <textarea
            value={newCardDescription}
            onChange={(e) => setNewCardDescription(e.target.value)}
            style={{ width: '100%', padding: '0.5rem', minHeight: '100px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
        </div>
        <button
          onClick={() => {
            addFlashcard();
            document.getElementById('gridAddCardForm').style.display = 'none';
          }}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginRight: '0.5rem'
          }}
        >
          Add Flashcard
        </button>
        <button
          onClick={() => {
            document.getElementById('gridAddCardForm').style.display = 'none';
          }}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#f5f5f5',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}
        >
          Cancel
        </button>
      </div>
      
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '1rem'
      }}>
        {flashcards.map((card, index) => (
          <div 
            key={card._id}
            style={{ 
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '1rem',
              backgroundColor: 'white',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              height: '200px'
            }}
          >
            <div style={{ 
              fontWeight: 'bold', 
              marginBottom: '0.5rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              flex: '0 0 auto'
            }}>
              {card.term}
            </div>
            
            <div style={{ 
              fontSize: '0.9rem',
              color: '#666',
              marginBottom: '1rem',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              flex: '1 1 auto'
            }}>
              {card.description}
            </div>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 'auto' }}>
              <button 
                onClick={() => {
                  setCurrentCardIndex(index);
                  toggleViewMode();
                }}
                style={{ 
                  padding: '0.25rem 0.5rem',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}
              >
                View
              </button>
              
              <div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    startEditing(card);
                  }}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginRight: '0.5rem',
                    fontSize: '0.8rem'
                  }}
                >
                  Edit
                </button>
                
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFlashcard(card._id);
                  }}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    border: '1px solid #ffcdd2',
                    borderRadius: '4px',
                    fontSize: '0.8rem'
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Flashcard;