import { useNavigate } from 'react-router-dom';

export default function HinterestRightBar() {
  const navigate = useNavigate();
  
  const handleFlashcardsClick = () => {
    navigate('/flashcards');
  };
  
  return (
    <div className="w-40 bg-white border-l border-gray-300">
      <div className="p-4 border-b border-gray-300">Study plan</div>
      <div className="p-4 border-b border-gray-300">
        <a 
          href="#" 
          className="block" 
          onClick={(e) => {
            e.preventDefault();
            handleFlashcardsClick();
          }}
        >
          Flash cards
        </a>
      </div>
      <div className="p-4 border-b border-gray-300">Notes</div>
      <div className="p-4 border-b border-gray-300">Videos</div>
      <div className="p-4 border-b border-gray-300">Quizzes</div>
      <div className="p-4 border-b border-gray-300">Performance</div>
    </div>
  );
}