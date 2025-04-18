import { useEffect, useState } from 'react';

function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const token = localStorage.getItem('google_token');
      if (!token) {
        setError('No token found. Please log in first.');
        return;
      }

      try {
        const response = await fetch(
          'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(),
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await response.json();
        if (data.error) {
          setError(data.error.message);
        } else {
          setEvents(data.items || []);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load events.');
      }
    };

    fetchEvents();
  }, []);

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Your Upcoming Google Calendar Events</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {events.length === 0 && !error && <p>No upcoming events found.</p>}
      <ul>
        {events.map((event) => (
          <li key={event.id}>
            <strong>{event.summary || 'No Title'}</strong><br />
            {event.start?.dateTime || event.start?.date || 'No Start Time'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default CalendarPage;

  