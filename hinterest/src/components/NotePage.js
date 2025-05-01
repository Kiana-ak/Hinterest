import React, { useState, useEffect } from 'react';

const NotePage = () => {
  const [notes, setNotes] = useState({});
  const [currentNote, setCurrentNote] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjects, setSubjects] = useState(['Math', 'Science', 'History', 'English']); // You can modify these default subjects
  const [newSubject, setNewSubject] = useState('');

  useEffect(() => {
    const savedNotes = localStorage.getItem('notes');
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  const saveToLocalStorage = (updatedNotes) => {
    localStorage.setItem('notes', JSON.stringify(updatedNotes));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentNote.trim() && selectedSubject) {
      const newNote = {
        id: Date.now(),
        text: currentNote,
        date: new Date().toLocaleString()
      };

      const updatedNotes = {
        ...notes,
        [selectedSubject]: [...(notes[selectedSubject] || []), newNote]
      };

      setNotes(updatedNotes);
      saveToLocalStorage(updatedNotes);
      setCurrentNote('');
    }
  };

  const handleAddSubject = (e) => {
    e.preventDefault();
    if (newSubject.trim() && !subjects.includes(newSubject)) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
    }
  };

  return (
    <div className="note-page">
      <div className="subjects-panel">
        <h2>Subjects</h2>
        <form onSubmit={handleAddSubject} className="add-subject-form">
          <input
            type="text"
            value={newSubject}
            onChange={(e) => setNewSubject(e.target.value)}
            placeholder="Add new subject"
          />
          <button type="submit">Add Subject</button>
        </form>
        <div className="subject-list">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => setSelectedSubject(subject)}
              className={`subject-button ${selectedSubject === subject ? 'active' : ''}`}
            >
              {subject}
            </button>
          ))}
        </div>
      </div>

      <div className="notes-section">
        {selectedSubject ? (
          <>
            <h2>Notes for {selectedSubject}</h2>
            <form onSubmit={handleSubmit} className="note-form">
              <textarea
                value={currentNote}
                onChange={(e) => setCurrentNote(e.target.value)}
                placeholder="Enter your note here"
                required
              />
              <button type="submit">Add Note</button>
            </form>

            <div className="notes-list">
              {(notes[selectedSubject] || []).map((note) => (
                <div key={note.id} className="note-card">
                  <p>{note.text}</p>
                  <small>{note.date}</small>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="select-subject-message">
            <h2>Please select a subject to view or add notes</h2>
          </div>
        )}
      </div>

      <style>{`
        .note-page {
          display: flex;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          gap: 20px;
        }
        
        .subjects-panel {
          width: 250px;
          padding: 20px;
          background: #f5f5f5;
          border-radius: 8px;
        }
        
        .notes-section {
          flex: 1;
          padding: 20px;
          background: #ffffff;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        
        .subject-list {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 20px;
        }
        
        .subject-button {
          padding: 10px;
          border: none;
          border-radius: 4px;
          background: #e0e0e0;
          cursor: pointer;
          text-align: left;
        }
        
        .subject-button.active {
          background: #007bff;
          color: white;
        }
        
        .add-subject-form {
          margin: 20px 0;
          display: flex;
          gap: 10px;
        }
        
        .note-form {
          margin: 20px 0;
        }
        
        textarea {
          width: 100%;
          height: 100px;
          padding: 10px;
          margin-bottom: 10px;
          border: 1px solid #ddd;
          border-radius: 4px;
        }
        
        button {
          padding: 8px 16px;
          background: #007bff;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        
        button:hover {
          background: #0056b3;
        }
        
        .notes-list {
          display: grid;
          gap: 15px;
        }
        
        .note-card {
          padding: 15px;
          border: 1px solid #ddd;
          border-radius: 4px;
          background: #f9f9f9;
        }
        
        .note-card small {
          color: #666;
        }
        
        .select-subject-message {
          text-align: center;
          color: #666;
          margin-top: 50px;
        }
      `}</style>
    </div>
  );
};

export default NotePage;