// Flashcard System JavaScript
// This file implements a flashcard system that allows users to create and interact with flashcards


import React, { useState } from 'react';

function Flashcards({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  
  // If no flashcards are provided, show a message
  if (!flashcards || flashcards.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>No flashcards available. Generate some from your lecture notes!</p>
      </div>
    );
  }
  
  const handleFlip = () => {
    setFlipped(!flipped);
  };
  
  const handlePrevious = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex > 0 ? prevIndex - 1 : flashcards.length - 1
    );
  };
  
  const handleNext = () => {
    setFlipped(false);
    setCurrentIndex((prevIndex) => 
      prevIndex < flashcards.length - 1 ? prevIndex + 1 : 0
    );
  };
  
  return (
    <div className="flex flex-col items-center">
      <div 
        className="w-full max-w-md h-64 bg-white rounded-lg shadow-lg cursor-pointer transform transition-transform duration-300"
        style={{ 
          transformStyle: 'preserve-3d',
          transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
        }}
        onClick={handleFlip}
      >
        {/* Front side */}
        <div 
          className="absolute w-full h-full flex items-center justify-center p-8 backface-hidden"
          style={{ 
            backfaceVisibility: 'hidden',
          }}
        >
          <p className="text-xl text-center">{flashcards[currentIndex]?.question || 'Question'}</p>
        </div>
        
        {/* Back side */}
        <div 
          className="absolute w-full h-full flex items-center justify-center p-8 backface-hidden bg-blue-50"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <p className="text-xl text-center">{flashcards[currentIndex]?.answer || 'Answer'}</p>
        </div>
      </div>
      
      <div className="flex space-x-4 mt-4">
        <button 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={handlePrevious}
        >
          Previous
        </button>
        <div className="flex items-center">
          {currentIndex + 1} / {flashcards.length}
        </div>
        <button 
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={handleNext}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Flashcards;