import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function HinterestRightBar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    // Check authentication status
    const authStatus = sessionStorage.getItem('isLoggedIn') || localStorage.getItem('isLoggedIn');
    setIsLoggedIn(!!authStatus);
  }, []);
  
  const handleFlashcardsClick = () => {
    if (isLoggedIn) {
      navigate('/flashcards');
    } else {
      alert('Please login to access flashcards');
      navigate('/');
    }
  };
  
  return (
    <div className="w-40 bg-white border-l border-gray-300">
      <div className="p-4 border-b border-gray-300">Study plan</div>
      <div className="p-4 border-b border-gray-300">
        <button 
          className="block text-left w-full"
          onClick={handleFlashcardsClick}
        >
          Flash cards
        </button>
      </div>
      <div className="p-4 border-b border-gray-300">Notes</div>
      <div className="p-4 border-b border-gray-300">Videos</div>
      <div className="p-4 border-b border-gray-300">Quizzes</div>
      <div className="p-4 border-b border-gray-300">Performance</div>
    </div>
  );
}