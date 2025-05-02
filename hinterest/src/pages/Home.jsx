import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SubjectSelector from '../components/SubjectSelector';
import SubjectContent from '../components/SubjectContent';
import Chatbot from '../components/Chatbot';
import Flashcards from '../components/Flashcards';
import Notes from './NotesPage';
import Quizzes from './QuizzesPage';

function Home() {
  // Initialize states with localStorage values
  const [message, setMessage] = useState('Loading...');
  const [subjects, setSubjects] = useState(() => {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  });
  
  const [selectedSubject, setSelectedSubject] = useState(() => {
    const savedSubject = localStorage.getItem('selectedSubject');
    return savedSubject || '';
  });

  const [selectedTool, setSelectedTool] = useState(() => {
    const savedTool = localStorage.getItem('selectedTool');
    return savedTool || 'chatbot';
  });

  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  // API connection check
  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error('Error fetching API:', err);
        setMessage('Failed to connect to backend.');
      });
  }, []);

  // Persist data to localStorage
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('selectedSubject', selectedSubject);
  }, [selectedSubject]);

  useEffect(() => {
    localStorage.setItem('selectedTool', selectedTool);
  }, [selectedTool]);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
  {/* Left Sidebar */}
  {showLeftSidebar && (
  <div style={{ width: '220px', background: '#eee', padding: '1rem' }}>
    <button onClick={() => setShowLeftSidebar(false)} style={{ marginBottom: '0.5rem' }}>← Hide</button>

    <h3>Menu</h3>
    <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
      <li><Link to="/home">Home</Link></li>
      <li><Link to="/calendar-login">Calendar</Link></li>
      <li><Link to="/">Logout</Link></li>
    </ul>
    <hr />

    <SubjectSelector
      subjects={subjects}
      setSubjects={setSubjects}
      selectedSubject={selectedSubject}
      setSelectedSubject={setSelectedSubject}
      setSelectedTool={setSelectedTool}
    />
  </div>
)}

  {!showLeftSidebar && (
    <div style={{ width: '40px', background: '#eee', padding: '1rem' }}>
      <button onClick={() => setShowLeftSidebar(true)}>→</button>
    </div>
  )}

  {/* Main Content */}
  <div style={{ flex: 1, padding: '1.5rem' }}>
    {selectedSubject ? (
      <>
        {selectedTool === 'chatbot' && <Chatbot subject={selectedSubject} />}
        {selectedTool === 'flashcards' && <Flashcards subject={selectedSubject} />}
        {selectedTool === 'notes' && <Notes subject={selectedSubject} />}
        {selectedTool === 'quizzes' && <Quizzes subject={selectedSubject} />}
      </>
    ) : (
      <p style={{ color: 'gray' }}>Please select or add a subject to begin.</p>
    )}
  </div>

  {/* Right Sidebar */}
  {showRightSidebar && (
    <div style={{ width: '200px', background: '#f5f5f5', padding: '1rem' }}>
      <button onClick={() => setShowRightSidebar(false)} style={{ marginBottom: '0.5rem' }}>Hide →</button>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <button onClick={() => setSelectedTool('flashcards')}>📚 Flashcards</button>
        <button onClick={() => setSelectedTool('notes')}>📝 Notes</button>
        <button onClick={() => setSelectedTool('quizzes')}>🧠 Quizzes</button>
      </div>
    </div>
  )}
  {!showRightSidebar && (
    <div style={{ width: '40px', background: '#f5f5f5', padding: '1rem' }}>
      <button onClick={() => setShowRightSidebar(true)}>←</button>
    </div>
  )}
</div>

  );
  
}

export default Home;