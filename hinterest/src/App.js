import './App.css';
import Flashcards from './components/Flashcards';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';

function App() {
  useEffect(() => {
    if (!process.env.REACT_APP_GEMINI_API_KEY) {
      console.error("Warning: Gemini API key not found. Flashcard generation will not work.");
    }
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/calendar-login" element={<CalendarLogin />} />
          <Route path="/calendar" element={<CalendarPage />} />
        </Routes>

        <main>
          <Flashcards />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;

