import React, { useState, useEffect } from 'react';

const NotesPage = () => {
  const [notes, setNotes] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [currentNote, setCurrentNote] = useState('');
  const [currentSubject, setCurrentSubject] = useState('');

  // Load notes and subject when component mounts
  useEffect(() => {
    const savedSubject = sessionStorage.getItem('currentNoteSubject');
    if (savedSubject) {
      setCurrentSubject(savedSubject);
      const savedNotes = sessionStorage.getItem(`notes_${savedSubject}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      }
    }
  }, []);

  // Update sessionStorage when subject changes
  useEffect(() => {
    if (currentSubject) {
      sessionStorage.setItem('currentNoteSubject', currentSubject);
      const savedNotes = sessionStorage.getItem(`notes_${currentSubject}`);
      if (savedNotes) {
        setNotes(JSON.parse(savedNotes));
      } else {
        setNotes([]);
      }
    }
  }, [currentSubject]);

  // Save notes to sessionStorage
  const saveNotes = (newNotes) => {
    if (currentSubject) {
      sessionStorage.setItem(`notes_${currentSubject}`, JSON.stringify(newNotes));
      setNotes(newNotes);
    }
  };

  const handleAddNote = (e) => {
    e.preventDefault();
    if (currentNote.trim()) {
      const newNote = {
        id: Date.now(),
        content: currentNote
      };
      saveNotes([...notes, newNote]);
      setCurrentNote('');
      setShowForm(false);
    }
  };

  const handleDeleteNote = (noteId) => {
    const updatedNotes = notes.filter(note => note.id !== noteId);
    saveNotes(updatedNotes);
  };

  return (
    <div>
      {/* Remove the Navbar component */}
      <div style={{ padding: '2rem' }}>
        <h2>Notes</h2>
        
        {/* Subject Selection */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={currentSubject}
            onChange={(e) => setCurrentSubject(e.target.value)}
            placeholder="Enter subject name"
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>

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