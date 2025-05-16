import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SubjectSelector from '../components/SubjectSelector';
import SubjectContent from '../components/SubjectContent';
import Chatbot from '../components/Chatbot';
import Flashcards from '../components/Flashcards';
import Notes from '../components/Notecard'; // Use your actual Notes component name
import Quizzes from '../components/Quizcard'; // Use your actual Quizzes component name

function Home() {
  const [message, setMessage] = useState('Loading...');

  // Start with no subjects and no subject selected
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedTool, setSelectedTool] = useState('chatbot');
  const [showLeftSidebar, setShowLeftSidebar] = useState(true);
  const [showRightSidebar, setShowRightSidebar] = useState(true);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:5000/api/subjects', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
  
        if (!response.ok) {
          throw new Error('Failed to fetch subjects');
        }
  
        const data = await response.json();
        setSubjects(data); // stores full subject objects

      } catch (err) {
        console.error('Error fetching subjects:', err);
      }
    };
  
    fetchSubjects();
  }, []);

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
  {/* Left Sidebar */}
  {showLeftSidebar && (
  <div style={{ width: '200px', background: '#ffffcc', padding: '1rem' }}>
    <button onClick={() => setShowLeftSidebar(false)} style={{ marginBottom: '0.5rem' }}>☰</button>

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
    <div style={{ width: '40px', background: '#ffffff', padding: '1rem' }}>
      <button onClick={() => setShowLeftSidebar(true)}>☰</button>
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
      <p style={{ color: 'white' }}>Please select or add a subject to begin.</p>
    )}
  </div>

  {/* Right Sidebar */}
  {showRightSidebar && (
    <div style={{ width: '200px', background: '#ffffcc', padding: '1rem' }}>
      <button onClick={() => setShowRightSidebar(false)} style={{ marginBottom: '0.5rem' }}>☰</button>
      <div>
  <h3>Tools</h3>
  <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
    <li
      onClick={() => setSelectedTool('flashcards')}
      style={{
        padding: '8px',
        margin: '4px 0',
        backgroundColor: selectedTool === 'flashcards' ? '#fff' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#000'
      }}
    >
      📖 Flashcards
    </li>
    <li
      onClick={() => setSelectedTool('notes')}
      style={{
        padding: '8px',
        margin: '4px 0',
        backgroundColor: selectedTool === 'notes' ? '#fff' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#000'
      }}
    >
      🗒️ Notes
    </li>
    <li
      onClick={() => setSelectedTool('quizzes')}
      style={{
        padding: '8px',
        margin: '4px 0',
        backgroundColor: selectedTool === 'quizzes' ? '#fff' : 'transparent',
        borderRadius: '4px',
        cursor: 'pointer',
        color: '#000'
      }}
    >
      🧠 Quizzes
    </li>
  </ul>
</div>

    </div>
  )}
  {!showRightSidebar && (
    <div style={{ width: '40px', background: '#ffffff', padding: '1rem' }}>
      <button onClick={() => setShowRightSidebar(true)}>☰</button>
    </div>
  )}
</div>

  );
  
}

export default Home;