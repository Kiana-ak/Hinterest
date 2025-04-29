import React, { useState, useEffect } from 'react';

const Notes = ({ subject }) => {
  const [notes, setNotes] = useState([]);
  const [currentNote, setCurrentNote] = useState({ title: '', content: '' });
  const [editing, setEditing] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  // Load notes from localStorage on component mount
  useEffect(() => {
    const savedNotes = localStorage.getItem(`notes-${subject}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [subject]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`notes-${subject}`, JSON.stringify(notes));
  }, [notes, subject]);

  const handleSaveNote = () => {
    if (currentNote.title.trim() === '' || currentNote.content.trim() === '') {
      alert('Please provide both a title and content for your note');
      return;
    }

    if (editing) {
      // Update existing note
      const updatedNotes = [...notes];
      updatedNotes[editIndex] = { ...currentNote };
      setNotes(updatedNotes);
      setEditing(false);
      setEditIndex(null);
    } else {
      // Add new note
      setNotes([...notes, { ...currentNote }]);
    }

    // Clear the form
    setCurrentNote({ title: '', content: '' });
  };

  const handleEditNote = (index) => {
    setCurrentNote(notes[index]);
    setEditing(true);
    setEditIndex(index);
  };

  const handleDeleteNote = (index) => {
    const updatedNotes = notes.filter((_, i) => i !== index);
    setNotes(updatedNotes);
  };

  const handleCancelEdit = () => {
    setCurrentNote({ title: '', content: '' });
    setEditing(false);
    setEditIndex(null);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Notes for {subject}</h2>

      {/* Note editor */}
      <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h3>{editing ? 'Edit Note' : 'Create New Note'}</h3>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Title:</label>
          <input
            type="text"
            value={currentNote.title}
            onChange={(e) => setCurrentNote({ ...currentNote, title: e.target.value })}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Content:</label>
          <textarea
            value={currentNote.content}
            onChange={(e) => setCurrentNote({ ...currentNote, content: e.target.value })}
            style={{ width: '100%', padding: '0.5rem', minHeight: '150px' }}
          />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={handleSaveNote}
            style={{ padding: '0.5rem 1rem' }}
          >
            {editing ? 'Update Note' : 'Save Note'}
          </button>
          {editing && (
            <button 
              onClick={handleCancelEdit}
              style={{ padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      {/* Notes list */}
      <div>
        <h3>Your Notes</h3>
        {notes.length === 0 ? (
          <p>No notes yet. Create your first note above!</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {notes.map((note, index) => (
              <div 
                key={index} 
                style={{ 
                  border: '1px solid #ddd', 
                  borderRadius: '8px', 
                  padding: '1rem',
                  background: '#f9f9f9'
                }}
              >
                <h4>{note.title}</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button 
                    onClick={() => handleEditNote(index)}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteNote(index)}
                    style={{ padding: '0.25rem 0.5rem' }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Notes;