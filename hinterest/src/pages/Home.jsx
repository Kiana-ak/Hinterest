import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';

function Home() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // Call Express backend at /api/test
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
      <h2 style={{ padding: "1rem" }}>Welcome to Hinterest Dashboard</h2>
      <p style={{ padding: "1rem" }}>Backend says: {message}</p>
    </div>
  );
}

export default Home;

