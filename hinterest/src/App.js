import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import SubjectPage from './pages/SubjectPage';
import AddSubjectPage from './pages/AddSubjectPage';
import FlashcardsPage from './pages/FlashcardsPage';
import ChatbotPage from './pages/ChatbotPage';
import Whiteboard from './pages/Whiteboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar-login" element={<CalendarLogin />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/subject/:subjectId" element={<SubjectPage />} />
        <Route path="/add-subject" element={<AddSubjectPage />} />
        <Route path="/flashcards/:subjectId" element={<FlashcardsPage />} />
        <Route path="/chatbot/:subjectId" element={<ChatbotPage />} />
        <Route path="/whiteboard" element={<Whiteboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
