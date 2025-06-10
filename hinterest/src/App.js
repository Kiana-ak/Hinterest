import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import SubjectPage from './pages/SubjectPage';
import AddSubjectPage from './pages/AddSubjectPage';
import { SubjectProvider } from './context/SubjectContext';
import FlashcardsPage from './pages/FlashcardsPage';
import NotesPage from './pages/NotesPage'; 
import QuizPage from './pages/QuizPage';
import ChatbotPage from './pages/ChatbotPage';
import ChatBox from './components/ChatBox'; // Import your ChatBox component
import Whiteboard from './pages/Whiteboard';
import Workspace from './pages/Workspace';
import Layout from './components/Layout';
import Home from './pages/Home';

function App() {
  return (
    <SubjectProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/" element={<Layout />}>
            <Route path="home" element={<Home />} />
            <Route path="workspace" element={<Workspace />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="chatbox" element={<ChatBox />} /> {/* Now points to ChatBox component */}
            <Route path="subject/:subjectId" element={<SubjectPage />} />
            <Route path="add-subject" element={<AddSubjectPage />} />
            <Route path="flashcards/:subjectId" element={<FlashcardsPage />} />
            <Route path="notes/:subjectId" element={<NotesPage />} />
            <Route path="chatbot/:subjectId" element={<ChatbotPage />} /> {/* Subject-specific chat remains */}
            <Route path="quizzes/:subjectId" element={<QuizPage />} />
            <Route path="whiteboard" element={<Whiteboard />} />
          </Route>
          <Route path="/calendar-login" element={<CalendarLogin />} />
        </Routes>
      </BrowserRouter>
    </SubjectProvider>
  );
}

export default App;