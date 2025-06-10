import React, { useState, useEffect } from 'react';
import { getNotes, deleteNote } from '../services/NotesService';
import { motion } from 'framer-motion';

function Notes({ subject }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (subject) {
      // Get the subject ID (handle both object and string cases)
      const subjectId = typeof subject === 'object' ? subject._id : subject;
      
      // Load notes for this subject
      const loadedNotes = getNotes(subjectId);
      setNotes(loadedNotes);
      setLoading(false);
    }
  }, [subject]);
  
  const handleDeleteNote = (noteId) => {
    const subjectId = typeof subject === 'object' ? subject._id : subject;
    if (deleteNote(subjectId, noteId)) {
      // Update the notes list after deletion
      setNotes(notes.filter(note => note.id !== noteId));
    }
  };
  
  if (loading) {
    return <div>Loading notes...</div>;
  }
  
  if (notes.length === 0) {
    return <div>No notes yet. Save chatbot responses as notes to see them here!</div>;
  }
  
  return (
    <div>
      <h2>Notes</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notes.map(note => (
          <motion.div 
            key={note.id} 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              padding: '1rem',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <small>
                {new Date(note.createdAt).toLocaleString()}
                {note.source === 'chatbot' && ' • Saved from chatbot'}
              </small>
              <button 
                onClick={() => handleDeleteNote(note.id)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: 'red', 
                  cursor: 'pointer' 
                }}
              >
                Delete
              </button>
            </div>
            <div style={{ whiteSpace: 'pre-wrap' }}>{note.content}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default Notes;