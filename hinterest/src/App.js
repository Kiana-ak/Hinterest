import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext.js';
import { ThemeProvider } from './ThemeContext';
import Signup from './components/Signup';
import Login from './components/Login';
import ProtectedRoute from './auth/ProtectedRoute';
import ForgotPassword from './components/ForgetPasword';
import UpdateProfile from './components/UpdateProfile';
import FlashCards from './components/Flashcards';
import LoginPage from './pages/LoginPage';
import Home from './pages/Home';
import CalendarLogin from './pages/CalendarLogin';
import CalendarPage from './pages/CalendarPage';

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="w-100" style={{ maxWidth: "400px", margin: "0 auto" }}>
            <Routes>
              <Route path="/" element={<LoginPage />} />
              <Route path="/home" element={
                <ProtectedRoute>
                  <Home />
                </ProtectedRoute>
              } />
              <Route path="/calendar-login" element={
                <ProtectedRoute>
                  <CalendarLogin />
                </ProtectedRoute>
              } />
              <Route path="/calendar" element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              } />
              <Route path="/update-profile" element={
                <ProtectedRoute>
                  <UpdateProfile />
                </ProtectedRoute>
              } />
              <Route path="/flashcards" element={
                <ProtectedRoute>
                  <FlashCards />
                </ProtectedRoute>
              } />
              <Route path="/signup" element={<Signup />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Routes>
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;