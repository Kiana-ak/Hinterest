import React, { useState, useEffect } from 'react';

const NotesPage = ({ subject }) => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentTitle, setCurrentTitle] = useState('');

  // Load notes when component mounts or subject changes
  useEffect(() => {
    if (subject) {
      const savedNotes = localStorage.getItem(`notes_${subject}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    }
  }, [subject]);

  // Save notes to localStorage
  const saveNotes = (newNotes) => {
    if (subject) {
      localStorage.setItem(`notes_${subject}`, JSON.stringify(newNotes));
      setNotes(newNotes);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (currentNote.trim() && currentTitle.trim()) {
      const newNote = {
        id: Date.now(),
        title: currentTitle,
        content: currentNote
      };
      saveNotes([...notes, newNote]);
      setCurrentNote('');
      setCurrentTitle('');
      setShowForm(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  return (
    <div>
      <div style={{ padding: '2rem' }}>
        <h2>Notes for {subject}</h2>
        
        {/* Control Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          {showForm ? 'Cancel' : 'Add Note'}
        </button>

        {/* Note Form */}
        {showForm && (
          <form onSubmit={handleAddNote} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={currentTitle}
              onChange={(e) => setCurrentTitle(e.target.value)}
              placeholder="Enter note title"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd'
              }}
            />
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Enter your note"
              style={{
                width: '100%',
                padding: '8px',
                marginBottom: '8px',
                borderRadius: '4px',
                border: '1px solid #ddd',
                minHeight: '100px'
              }}
            />
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Note
            </button>
          </form>
        )}

        {/* Notes Display */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {notes.map(note => (
            <div
              key={note.id}
              style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                position: 'relative'
              }}
            >
              <h3 style={{ margin: '0 0 10px 0' }}>{note.title}</h3>
              <p style={{ margin: 0 }}>{note.content}</p>
              <button
                onClick={() => handleDeleteNote(note.id)}
                style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  padding: '4px 8px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NotesPage;