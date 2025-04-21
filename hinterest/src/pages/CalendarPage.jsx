import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarStyles.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [googleEvents, setGoogleEvents] = useState([]);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('google_token');
    if (!tokenFromStorage) return;

    fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&orderBy=startTime&singleEvents=true&timeMin=' + new Date().toISOString(),
      {
        headers: {
          Authorization: `Bearer ${tokenFromStorage}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          setGoogleEvents(data.items);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch calendar events:', err);
      });
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };

  const handleAddEvent = async () => {
    const token = localStorage.getItem('google_token');
    if (!token) {
      alert('You must be logged in to Google first.');
      return;
    }

    const event = {
      summary: title,
      description: 'Study session added from Hinterest',
      start: {
        dateTime: selectedDate.toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      end: {
        dateTime: new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
        ],
      },
    };

    try {
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/primary/events',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(event),
        }
      );

      if (response.ok) {
        alert(`Study session "${title}" was added to your Google Calendar with a reminder!`);
        setTitle('');
        setShowForm(false);
      } else {
        const data = await response.json();
        console.error('Google Calendar API error:', data);
        alert('Failed to add event. Check console for details.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      alert('Failed to connect to Google Calendar.');
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Study Planner</h2>
      <Calendar
  onClickDay={handleDateClick}
  value={selectedDate}
  tileClassName={({ date, view }) => {
    if (
      view === 'month' &&
      googleEvents.find((e) => {
        const eventDate = new Date(e.start?.dateTime || e.start?.date);
        return (
          eventDate.getFullYear() === date.getFullYear() &&
          eventDate.getMonth() === date.getMonth() &&
          eventDate.getDate() === date.getDate()
        );
      })
    ) {
      return 'has-event';
    }
    return null;
  }}
/>


      {showForm && (
        <div style={{ marginTop: '1rem' }}>
          <input
            type="text"
            placeholder="Study session title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{ marginRight: '1rem' }}
          />
          <button onClick={handleAddEvent}>Add Study Session</button>
        </div>
      )}
    </div>
  );
}

export default CalendarPage;