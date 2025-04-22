import { useState } from 'react';
import GeminiService from '../../services/GeminiService';

export default function HinterestContent() {
  const [noteCreated] = useState(false);
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [showSummaryOptions, setShowSummaryOptions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [questionInput, setQuestionInput] = useState('');
  
  const handleSummarizeClick = async () => {
    setShowSummaryOptions(true);
    // This would typically use actual lecture content
    // For now, we'll use placeholder text
    const lectureContent = "Sample lecture content about artificial intelligence and machine learning...";
    setIsLoading(true);
    try {
      const summary = await GeminiService.summarizeLecture(lectureContent);
      setCurrentNoteContent(summary);
    } catch (error) {
      console.error("Error getting summary:", error);
      setCurrentNoteContent("Failed to generate summary. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOptionClick = async (option) => {
    // This would typically use actual lecture content
    const lectureContent = "Sample lecture content about artificial intelligence and machine learning...";
    setIsLoading(true);
    try {
      let content = '';
      
      switch(option) {
        case 'notes':
          content = await GeminiService.generateNotes(lectureContent);
          break;
        case 'flashcards':
          const flashcards = await GeminiService.createFlashcards(lectureContent);
          content = JSON.stringify(flashcards, null, 2);
          break;
        case 'quiz':
          const quiz = await GeminiService.generateQuiz(lectureContent);
          content = JSON.stringify(quiz, null, 2);
          break;
        case 'videos':
          const videos = await GeminiService.suggestVideos(lectureContent);
          content = JSON.stringify(videos, null, 2);
          break;
        default:
          content = 'Option not recognized';
      }
      
      setCurrentNoteContent(content);
      setShowSummaryOptions(false);
    } catch (error) {
      console.error(`Error processing ${option}:`, error);
      setCurrentNoteContent(`Failed to generate ${option}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleQuestionSubmit = async (e) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    
    // This would typically use actual lecture content
    const lectureContent = "Sample lecture content about artificial intelligence and machine learning...";
    setIsLoading(true);
    try {
      const answer = await GeminiService.answerQuestion(lectureContent, questionInput);
      setCurrentNoteContent(answer);
      setQuestionInput('');
    } catch (error) {
      console.error("Error answering question:", error);
      setCurrentNoteContent("Failed to answer your question. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="bg-white p-2 border-b border-gray-300 flex justify-between items-center">
        <div className="border border-gray-400 px-2 py-1 text-sm">
          {noteCreated ? "Note created ✓" : "Note created"}
        </div>
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
          <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Summarize Button */}
        <div className="inline-block mb-4">
          <div 
            className="border-2 border-black rounded-lg px-4 py-2 cursor-pointer"
            onClick={handleSummarizeClick}
          >
            Summarize my lecture
          </div>
        </div>

        {/* Right-click Menu and Content */}
        <div className="relative flex-1">
          {showSummaryOptions && (
            <div className="absolute left-16 top-4 z-10">
              <div className="bg-white border border-gray-300 rounded shadow-md">
                <div className="flex justify-end p-1">
                  <div className="flex">
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-0.5"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-0.5"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full mx-0.5"></div>
                  </div>
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                  onClick={() => handleOptionClick('notes')}
                >
                  Make notes
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                  onClick={() => handleOptionClick('flashcards')}
                >
                  Make flashcards
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                  onClick={() => handleOptionClick('quiz')}
                >
                  Make quiz
                </div>
                <div 
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                  onClick={() => handleOptionClick('videos')}
                >
                  Suggest videos
                </div>
              </div>
            </div>
          )}

          {/* Note Content */}
          <div className="border-2 border-black rounded-lg p-4 h-64 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-gray-500">Loading...</div>
              </div>
            ) : (
              <div className="whitespace-pre-wrap">{currentNoteContent}</div>
            )}
          </div>
        </div>

        {/* Input Area */}
        <form className="mt-4 flex items-center" onSubmit={handleQuestionSubmit}>
          <input 
            type="text" 
            placeholder="Type your question here..." 
            className="flex-1 p-2 border border-gray-300"
            value={questionInput}
            onChange={(e) => setQuestionInput(e.target.value)}
          />
          <button 
            type="submit" 
            className="ml-2 border border-gray-300 px-2 py-1"
            disabled={isLoading}
          >
            Ask
          </button>
          <button 
            type="button" 
            className="ml-2 border border-gray-300 px-2 py-1"
            disabled={isLoading}
          >
            Attach
          </button>
        </form>
      </div>
    </div>
  );
}