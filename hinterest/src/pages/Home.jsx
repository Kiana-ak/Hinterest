import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import SubjectSelector from '../components/SubjectSelector';
import SubjectContent from '../components/SubjectContent';

function Home() {
  const [message, setMessage] = useState('Loading...');

  // Load subjects from localStorage on initial render
  const [subjects, setSubjects] = useState(() => {
    const savedSubjects = localStorage.getItem('subjects');
    return savedSubjects ? JSON.parse(savedSubjects) : [];
  });
  
  const [selectedSubject, setSelectedSubject] = useState(() => {
    const savedSubject = localStorage.getItem('selectedSubject');
    return savedSubject || '';
  });

  // Save subjects to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subjects', JSON.stringify(subjects));
  }, [subjects]);

  // Save selected subject to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('selectedSubject', selectedSubject);
  }, [selectedSubject]);

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