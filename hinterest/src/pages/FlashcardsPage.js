import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Flashcards from '../components/Flashcards';
import Navbar from '../components/Navbar';

function FlashcardsPage() {
  const navigate = useNavigate();
  
  // Check if user is authenticated
  useEffect(() => {
    // This is a simple authentication check
    // In a real application, you would use a more robust auth system
    const isLoggedIn = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn');
    
    if (!isLoggedIn) {
      // If not logged in, redirect to login page
      navigate('/', { replace: true });
      alert('Please login to access flashcards');
    }
  }, [navigate]);

  return (
    <div>
      <Navbar />
      <div style={{ padding: "1rem" }}>
        <h2>Your Flashcards</h2>
        <Flashcards />
      </div>
    </div>
  );
}

export default FlashcardsPage;