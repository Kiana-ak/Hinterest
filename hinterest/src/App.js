import './App.css';
import Flashcards from './components/Flashcards';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import { ThemeProvider } from './ThemeContext'; // for theme change 


function App() {
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

