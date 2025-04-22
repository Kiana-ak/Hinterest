import { useState } from 'react';

export default function HinterestContent() {
  const [noteCreated] = useState(false); // Removed unused setter
  const [currentNoteContent, setCurrentNoteContent] = useState('');
  const [showSummaryOptions, setShowSummaryOptions] = useState(false);

  const handleSummarizeClick = () => {
    setShowSummaryOptions(true);
    setCurrentNoteContent('Here is the summarization of lecture ......');
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
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">Make notes</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">make flashcards</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">Make quiz</div>
                <div className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200">Suggest videos</div>
              </div>
            </div>
          )}

          {/* Note Content */}
          <div className="border-2 border-black rounded-lg p-4 h-64">
            {currentNoteContent}
          </div>
        </div>

        {/* Input Area */}
        <div className="mt-4 flex items-center">
          <input 
            type="text" 
            placeholder="Type your question here..." 
            className="flex-1 p-2 border border-gray-300"
          />
          <button className="ml-2 border border-gray-300 px-2 py-1">Attach</button>
        </div>
      </div>
    </div>
  );
}