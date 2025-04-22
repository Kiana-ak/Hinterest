import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Flashcards from '../components/Flashcards';
import GeminiService from '../services/GeminiService';

function FlashcardsPage() {
  const [flashcards, setFlashcards] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // For demo purposes, we'll create some example flashcards
    setFlashcards([
      { question: "What is React?", answer: "A JavaScript library for building user interfaces" },
      { question: "What is JSX?", answer: "A syntax extension for JavaScript that looks similar to HTML" },
      { question: "What is a Component?", answer: "The building blocks of React applications" },
      { question: "What is the Virtual DOM?", answer: "A lightweight representation of the DOM in memory" },
    ]);
  }, []);
  
  const handleGenerateFlashcards = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // This would typically use actual lecture content from user input or notes
      const lectureContent = "React is a JavaScript library for building user interfaces. It was developed by Facebook. React allows developers to create large web applications that can change data without reloading the page. The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application. React uses a virtual DOM to improve performance. JSX is a syntax extension for JavaScript that looks similar to HTML and makes it easier to write React components.";
      
      const result = await GeminiService.createFlashcards(lectureContent);
      
      if (result.error) {
        setError(result.error);
      } else {
        setFlashcards(result);
      }
    } catch (error) {
      console.error("Error generating flashcards:", error);
      setError("Failed to generate flashcards. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Flashcards</h1>
        
        <div className="mb-6">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleGenerateFlashcards}
            disabled={isLoading}
          >
            {isLoading ? "Generating..." : "Generate New Flashcards"}
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <Flashcards flashcards={flashcards} />
      </div>
    </div>
  );
}

export default FlashcardsPage;