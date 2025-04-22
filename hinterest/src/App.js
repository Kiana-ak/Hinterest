import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import HinterestUI from './components/HinterestUI';
import FlashcardsPage from './pages/FlashcardsPage';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("Warning: Gemini API key not found. Flashcard generation will not work.");
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar-login" element={<CalendarLogin />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
        <Route path="/hinterest" element={<HinterestUI />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
