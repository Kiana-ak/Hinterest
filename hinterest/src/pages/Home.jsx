import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SubjectSelector from '../components/SubjectSelector';
import SubjectContent from '../components/SubjectContent';
import Chatbot from '../components/Chatbot';
import Flashcards from '../components/Flashcards';
import Notes from '../components/Notecard';
import Quizzes from '../components/Quizcard';
import HinterestRightBar from '../components/HinterestUI/HinterestRightBar';

function Home() {
  const [message, setMessage] = useState('Loading...');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTool, setSelectedTool] = useState('chatbot');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/test')
      .then((res) => res.text())
      .then((data) => setMessage(data))
      .catch((err) => {
        console.error('Error fetching API:', err);
        setMessage('Failed to connect to backend.');
      });
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        height: 'calc(100vh - 60px)',
        background: 'var(--bg-color)',
        color: 'var(--text-color)',
        transition: 'background 0.3s ease, color 0.3s ease',
      }}
    >
      {/* Left Sidebar */}
      {showLeftSidebar ? (
        <div
          style={{
            width: '220px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '1rem',
            borderRight: '1px solid #ccc',
          }}
        >
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
      ) : (
        <div
          style={{
            width: '40px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '1rem',
            borderRight: '1px solid #ccc',
          }}
        >
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
      {showRightSidebar ? (
        <div
          style={{
            width: '220px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '1rem',
            borderLeft: '1px solid #ccc',
          }}
        >
          <button onClick={() => setShowRightSidebar(false)} style={{ marginBottom: '0.5rem' }}>Hide →</button>
          <HinterestRightBar />
        </div>
      ) : (
        <div
          style={{
            width: '40px',
            background: 'var(--bg-color)',
            color: 'var(--text-color)',
            padding: '1rem',
            borderLeft: '1px solid #ccc',
          }}
        >
          <button onClick={() => setShowRightSidebar(true)}>←</button>
        </div>
      )}
    </div>
  );
}

export default Home;