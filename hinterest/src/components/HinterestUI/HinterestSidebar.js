import React, { useContext } from 'react';
import { ThemeContext } from '../../Themes/ThemeContext';

export default function HinterestSidebar() {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div className="w-32 bg-white border-r border-gray-300">
      <div className="p-4 font-bold border-b border-gray-300">Hinterest</div>
      <div className="p-4 border-b border-gray-300">Calendar</div>
      <div className="p-4 border-b border-gray-300">Collaborate</div>

      {/* Subjects Dropdown */}
      <div className="p-4">
        <div className="font-semibold">Subjects</div>
        <div className="pl-2 mt-1">
          <div className="font-medium">Math</div>
          <div className="pl-2 text-sm">AI</div>
          <div className="pl-2 text-sm">Java</div>
          <div className="pl-2 text-sm">Physics</div>
          <div className="pl-2 text-sm">Science</div>
          <div className="text-sm">...</div>
        </div>
      </div>

      {/* Dark/Light Toggle Button */}
      <div className="p-4 mt-auto">
        <button
          onClick={toggleTheme}
          className="w-full px-2 py-1 text-sm border rounded hover:bg-gray-100"
        >
          {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </button>
      </div>
    </div>
  );
}