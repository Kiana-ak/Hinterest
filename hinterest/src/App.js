import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SubjectsPage from './pages/SubjectsPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import SubjectDashboard from './components/SubjectDashboard';
import Chatbot from './components/Chatbot';
import Flashcards from './components/Flashcards';
import Notes from './components/Notes';
import Quizzes from './components/Quizzes';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/subjects" element={<SubjectsPage />} />
        <Route path="/calendar-login" element={<CalendarLogin />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/subject/:subjectName" element={<SubjectDashboard />} />
        <Route path="/subject/:subjectName/chatbot" element={<Chatbot />} />
        <Route path="/subject/:subjectName/flashcards" element={<Flashcards />} />
        <Route path="/subject/:subjectName/notes" element={<Notes />} />
        <Route path="/subject/:subjectName/quizzes" element={<Quizzes />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
