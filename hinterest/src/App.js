import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import SubjectsPage from './pages/SubjectsPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';
import SubjectDashboard from './components/SubjectDashboard';

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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
