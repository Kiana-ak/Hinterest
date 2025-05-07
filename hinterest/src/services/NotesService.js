// NotesService.js - Handles saving and retrieving notes
const NOTES_PREFIX = 'subject_notes_';

// Save a note for a specific subject
export const saveNote = (subjectId, note) => {
  if (!subjectId || !note) return false;
  
  // Get existing notes for this subject
  const existingNotes = getNotes(subjectId);
  
  // Create a new note with timestamp and content
  const newNote = {
    id: Date.now(), // Use timestamp as unique ID
    content: note,
    createdAt: new Date().toISOString(),
    source: 'chatbot' // To identify notes created from chatbot responses
  };
  
  // Add the new note to existing notes
  const updatedNotes = [...existingNotes, newNote];
  
  // Save to localStorage
  localStorage.setItem(`${NOTES_PREFIX}${subjectId}`, JSON.stringify(updatedNotes));
  
  return true;
};

// Get all notes for a specific subject
export const getNotes = (subjectId) => {
  if (!subjectId) return [];
  
  const savedNotes = localStorage.getItem(`${NOTES_PREFIX}${subjectId}`);
  if (savedNotes) {
    try {
      return JSON.parse(savedNotes);
    } catch (e) {
      console.error('Error parsing saved notes:', e);
      return [];
    }
  }
  return [];
};

// Delete a specific note
export const deleteNote = (subjectId, noteId) => {
  if (!subjectId || !noteId) return false;
  
  const existingNotes = getNotes(subjectId);
  const updatedNotes = existingNotes.filter(note => note.id !== noteId);
  
  localStorage.setItem(`${NOTES_PREFIX}${subjectId}`, JSON.stringify(updatedNotes));
  
  return true;
};