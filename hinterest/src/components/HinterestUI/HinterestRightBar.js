import { useNavigate } from 'react-router-dom';
import { ThemeContext } from '../../Themes/ThemeContext';

export default function HinterestRightBar() {
  const navigate = useNavigate();
  
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  const handleFlashcardsClick = () => {
    navigate('/flashcards');
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
      
      <button
      onClick={toggleTheme}
      className="mt-4 w-full px-2 py-1 text-sm border rounded hover:bg-gray-200"
    >
      {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
    </button>
    </div>
      


  );
}
