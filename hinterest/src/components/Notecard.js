import React, { useState, useEffect } from 'react';

function Notecard({ subject }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [editingNote, setEditingNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectName, setSubjectName] = useState('');

  // Set subject name when component mounts or subject changes
  useEffect(() => {
    if (subject) {
      // If subject is an object with a name property, use that
      if (typeof subject === 'object' && subject.name) {
        setSubjectName(subject.name);
      } 
      // Otherwise use the subject directly (likely an ID string)
      else {
        // Try to fetch the subject name if we only have the ID
        const fetchSubjectName = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:8080/api/subjects/${subject}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setSubjectName(data.name);
            } else {
              setSubjectName(subject); // Fallback to using the ID
            }
          } catch (err) {
            console.error('Error fetching subject name:', err);
            setSubjectName(subject); // Fallback to using the ID
          }
        };
        
        fetchSubjectName();
      }
    }
  }, [subject]);

  // Fetch notes for the selected subject
  useEffect(() => {
    const fetchNotes = async () => {
      if (!subject) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:8080/api/notes/subject/${subject}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch notes');
        }

        const data = await response.json();
        setNotes(data);
      } catch (err) {
        console.error('Error fetching notes:', err);
        setError('Failed to load notes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, [subject]);

  // Handle form submission for creating/updating notes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const url = editingNote 
        ? `http://localhost:8080/api/notes/${editingNote._id}`
        : 'http://localhost:8080/api/notes';
      
      const method = editingNote ? 'PUT' : 'POST';
      
      const body = editingNote 
        ? JSON.stringify({ title, content })
        : JSON.stringify({ title, content, subjectId: subject });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });

      if (!response.ok) {
        throw new Error(editingNote ? 'Failed to update note' : 'Failed to create note');
      }

      const data = await response.json();
      
      if (editingNote) {
        // Update the note in the list
        setNotes(notes.map(note => note._id === editingNote._id ? data : note));
      } else {
        // Add the new note to the list
        setNotes([data, ...notes]);
      }
      
      // Reset form
      setTitle('');
      setContent('');
      setEditingNote(null);
      setError('');
    } catch (err) {
      console.error('Error saving note:', err);
      setError(err.message);
    }
  };

  // Handle editing a note
  const handleEdit = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setEditingNote(note);
  };

  // Handle deleting a note
  const handleDelete = async (noteId) => {
    if (!window.confirm('Are you sure you want to delete this note?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8080/api/notes/${noteId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      // Remove the deleted note from the list
      setNotes(notes.filter(note => note._id !== noteId));
    } catch (err) {
      console.error('Error deleting note:', err);
      setError(err.message);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setTitle('');
    setContent('');
    setEditingNote(null);
    setError('');
  };

  return (
    <div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Note Form */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Title:
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              required
            />
          </label>
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>
            Content:
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              style={{ 
                width: '100%', 
                padding: '0.5rem',
                marginTop: '0.25rem',
                border: '1px solid #ddd',
                borderRadius: '4px',
                minHeight: '150px'
              }}
              required
            />
          </label>
        </div>
        
        <div>
          <button 
            type="submit"
            style={{ 
              padding: '0.5rem 1rem',
              backgroundColor: '#4285f4',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              marginRight: '0.5rem'
            }}
          >
            {editingNote ? 'Update Note' : 'Add Note'}
          </button>
          
          {editingNote && (
            <button 
              type="button"
              onClick={handleCancel}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
      
      {/* Notes List */}
      {loading ? (
        <p>Loading notes...</p>
      ) : notes.length === 0 ? (
        <p>No notes yet. Create your first note above!</p>
      ) : (
        <div>
          {notes.map(note => (
            <div 
              key={note._id} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <h3>{note.title}</h3>
              <p style={{ whiteSpace: 'pre-wrap' }}>{note.content}</p>
              <div style={{ marginTop: '1rem' }}>
                <button 
                  onClick={() => handleEdit(note)}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    marginRight: '0.5rem'
                  }}
                >
                  Edit
                </button>
                <button 
                  onClick={() => handleDelete(note._id)}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    border: '1px solid #ffcdd2',
                    borderRadius: '4px'
                  }}
                >
                  Delete
                </button>
              </div>
              <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.5rem' }}>
                Last updated: {new Date(note.updatedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Notecard;