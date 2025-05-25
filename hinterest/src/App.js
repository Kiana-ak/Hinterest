import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import NotePage from './components/NotePage';
import FlashcardsPage from './pages/FlashcardsPage';
import QuizzesPage from './pages/QuizzesPage';
import WhiteboardPage from './pages/WhiteboardPage';  // Add this import

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar-login" element={<CalendarLogin />} />
          <Route path="/calendar" element={<CalendarPage />} />
          <Route path="/notes" element={<NotePage />} />
          <Route path="/flashcards" element={<FlashcardsPage />} />
          <Route path="/quizzes" element={<QuizzesPage />} />
          <Route path="/whiteboard" element={<WhiteboardPage />} />  {/* Add this route */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
