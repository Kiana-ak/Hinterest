import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import FlashcardsPage from './pages/FlashcardsPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home />} />
        <Route path="/calendar-login" element={<CalendarLogin />} />
        <Route path="/calendar" element={<CalendarPage />} />
        <Route path="/flashcards" element={<FlashcardsPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;