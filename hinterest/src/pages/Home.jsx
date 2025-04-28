import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SubjectSelector from '../components/SubjectSelector';
import SubjectContent from '../components/SubjectContent';

function Home() {
  const [message, setMessage] = useState('Loading...');

  // Start with no subjects and no subject selected
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');

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
    <div>
      <Navbar />

      <div style={{ display: 'flex', height: 'calc(100vh - 60px)' }}>
        {/* Sidebar */}
        <div style={{ width: '220px', background: '#eee', padding: '1rem' }}>
          <h3>Menu</h3>
          <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
            <li><a href="/home">Home</a></li>
            <li><a href="/calendar">Calendar</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
          <hr />

          <SubjectSelector
            subjects={subjects}
            setSubjects={setSubjects}
            selectedSubject={selectedSubject}
            setSelectedSubject={setSelectedSubject}
          />
        </div>

        {/* Main Area */}
        <div style={{ flex: 1, padding: '1.5rem' }}>
          <h2>Welcome to Hinterest Dashboard</h2>
          <p>Backend says: {message}</p>

          {selectedSubject ? (
            <SubjectContent subject={selectedSubject} />
          ) : (
            <p style={{ color: 'gray' }}>Please select or add a subject to begin.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;