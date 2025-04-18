import './App.css';
import Flashcards from './components/Flashcards'; /* import from flash cards.js or css */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/LoginPage';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />

        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
        </Routes>

        <main>
          <Flashcards />
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;
