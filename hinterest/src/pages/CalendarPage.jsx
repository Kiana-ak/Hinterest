import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../styles/CalendarStyles.css';

function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState('13:00'); // Default to 1:00 PM
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [editingEvent, setEditingEvent] = useState(null); // for edit mode
  const [googleEvents, setGoogleEvents] = useState([]);

  // Fetch the upcoming events from the users Google Calendar
  const fetchEvents = () => {
  const token = localStorage.getItem('google_token');
  // If no token is found, stop the function
  if (!token) return;
  // make a GET request to Google Calendar API to fetch upcoming events
  fetch(
      'https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=100&orderBy=startTime&singleEvents=true&timeMin=' +
        new Date().toISOString(),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    )
      // Parse the response and store the events in state
      .then((res) => res.json())
      .then((data) => {
        if (data.items) {
          console.log('Fetched events:', data.items);
          setGoogleEvents(data.items);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch calendar events:', err);
      });
  };

  // Fetch events when the page first loads
  useEffect(() => {
    fetchEvents();
  }, []);
  
  // When a day is clicked, store it and show the form
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowForm(true);
  };
  // Adds a new event to Google Calendar with the selected date and time
  const handleAddEvent = async () => {
    // Make sure the user is logged in before adding an event
    const token = localStorage.getItem('google_token');
    if (!token) {
      alert('You must be logged in to Google first.');
      return;
    }
  
    //  Combine selectedDate and selectedTime in local timezone
    const [hour, minute] = selectedTime.split(':');
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(parseInt(hour));
    startDateTime.setMinutes(parseInt(minute));
    startDateTime.setSeconds(0);
    // Build full start and end date times based on selected date and time
    // Event lasts 1 hour by default
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000); // +1 hour
    // Create the event object with title, time, and a 30-minute email reminder
    const event = {
      summary: title,
      description: 'Study session added from Hinterest',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
        ],
      },
    };
    // Send the event to Google Calendar using a POST request
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
      // If request is successful, show confirmation and update UI
      // If failed, show error message
      if (response.ok) {
        alert(`Study session "${title}" was added to your Google Calendar with a reminder!`);
        console.log('Event added:', event);
        fetchEvents(); // Refresh event list
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
  // Deletes a calendar event using its ID
  // Uses DELETE request to Google Calendar API
  const handleDelete = async (eventId) => {
    const token = localStorage.getItem('google_token');
    if (!token) {
      alert('You must be logged in to Google.');
      return;
    }
  
    const confirmed = window.confirm('Are you sure you want to delete this event?');
    if (!confirmed) return;
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${eventId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
  
      if (response.status === 204) { //// Google returns 204 if the event was deleted successfully
        alert('Event deleted successfully.');
        fetchEvents(); // Refresh the list immediately
      } else {
        alert('Failed to delete the event.');
      }
    } catch (err) {
      console.error('Error deleting event:', err);
      alert('An error occurred while deleting the event.');
    }
  };
  
  const handleEdit = (event) => {
    setEditingEvent(event);
  
    // Set the title
    setTitle(event.summary || '');
  
    // Set the date
    const startDate = new Date(event.start.dateTime || event.start.date);
    setSelectedDate(startDate);
  
    // Set the time
    const hours = startDate.getHours().toString().padStart(2, '0');
    const minutes = startDate.getMinutes().toString().padStart(2, '0');
    setSelectedTime(`${hours}:${minutes}`);
  
    // Show the form
    setShowForm(true);
  };
  
  const handleUpdateEvent = async () => {
    const token = localStorage.getItem('google_token');
    if (!token || !editingEvent) return;
  
    const [hour, minute] = selectedTime.split(':');
    const startDateTime = new Date(selectedDate);
    startDateTime.setHours(parseInt(hour));
    startDateTime.setMinutes(parseInt(minute));
    startDateTime.setSeconds(0);
  
    const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);
  
    const updatedEvent = {
      summary: title,
      description: 'Updated study session from Hinterest',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: 'Pacific/Auckland',
      },
      reminders: {
        useDefault: false,
        overrides: [{ method: 'email', minutes: 30 }],
      },
    };
  
    try {
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/primary/events/${editingEvent.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedEvent),
        }
      );
  
      if (response.ok) {
        alert('Event updated successfully!');
        setEditingEvent(null);
        setTitle('');
        setShowForm(false);
        fetchEvents();
      } else {
        alert('Failed to update event.');
      }
    } catch (err) {
      console.error('Update error:', err);
      alert('Error updating event.');
    }
  };
  
  const getNextNDays = (n) => {
    const days = [];
    const today = new Date();
    for (let i = 0; i < n; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      days.push(date);
    }
    return days;
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
    <input
      type="time"
      value={selectedTime}
      onChange={(e) => setSelectedTime(e.target.value)}
      style={{ marginRight: '1rem' }}
    />
    {editingEvent ? (
  <button onClick={handleUpdateEvent}>Update</button>
) : (
  <button onClick={handleAddEvent}>Add Study Session</button>
)}

  </div>
)}

  
      <h3 style={{ marginTop: '2rem' }}>Your Upcoming Study Plan</h3>
      <ul>
  {getNextNDays(30).map((date) => {
    const eventsForDay = googleEvents.filter((e) => {
      const eventDate = new Date(e.start?.dateTime || e.start?.date);
      const eventLocalDate = new Date(
        eventDate.getFullYear(),
        eventDate.getMonth(),
        eventDate.getDate()
      );
    
      const timelineDate = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate()
      );
    
      return eventLocalDate.getTime() === timelineDate.getTime();
    });
    
    
    return (
      <li key={date.toISOString()}>
        <strong>
          {date.toLocaleDateString('en-NZ', {
            weekday: 'short',
            day: 'numeric',
            month: 'short',
          })}
        </strong>
        {eventsForDay.length > 0 && (
          <ul>
            {eventsForDay.map((event) => (
              <li key={event.id}>
            {new Date(event.start.dateTime || event.start.date).toLocaleTimeString('en-NZ', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            – {event.summary || '(No Title)'}{' '}
            <button onClick={() => handleEdit(event)} style={{ marginLeft: '0.5rem' }}>Edit</button>
            <button onClick={() => handleDelete(event.id)} style={{ marginLeft: '0.5rem' }}>Delete</button>
          </li>
        ))}

          </ul>
        )}
      </li>
    );
  })}
</ul>


    </div>
  );
  
}

export default CalendarPage;