// NotesService.js - Handles saving and retrieving notes
const NOTES_PREFIX = 'subject_notes_';

// Save a note for a specific subject
export const saveNote = (subjectId, noteContent) => {
  if (!subjectId || !noteContent) {
    console.error('Missing required parameters for saveNote:', { subjectId, noteContent });
    return false;
  }
  
  console.log('Saving note for subject:', subjectId);
  
  // Get existing notes for this subject
  const existingNotes = getNotes(subjectId);
  console.log('Existing notes:', existingNotes);
  
  // Create a new note with timestamp and content
  const newNote = {
    _id: Date.now().toString(), // Use timestamp as unique ID
    title: `Note from ${new Date().toLocaleDateString()}`,
    content: noteContent,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    subjectId: subjectId,
    source: 'chatbot' // To identify notes created from chatbot responses
  };
  
  // Add the new note to existing notes
  const updatedNotes = [...existingNotes, newNote];
  console.log('Updated notes:', updatedNotes);
  
  // Save to localStorage
  try {
    localStorage.setItem(`${NOTES_PREFIX}${subjectId}`, JSON.stringify(updatedNotes));
    console.log('Notes saved successfully to localStorage');
    return true;
  } catch (error) {
    console.error('Error saving notes to localStorage:', error);
    return false;
  }
};

// Get all notes for a specific subject
export const getNotes = (subjectId) => {
  if (!subjectId) {
    console.error('Missing subjectId in getNotes');
    return [];
  }
  
  console.log('Getting notes for subject:', subjectId);
  const key = `${NOTES_PREFIX}${subjectId}`;
  console.log('Looking for localStorage key:', key);
  
  const savedNotes = localStorage.getItem(key);
  console.log('Raw saved notes from localStorage:', savedNotes);
  
  if (savedNotes) {
    try {
      const parsedNotes = JSON.parse(savedNotes);
      console.log('Parsed notes:', parsedNotes);
      return parsedNotes;
    } catch (e) {
      console.error('Error parsing saved notes:', e);
      return [];
    }
  }
  console.log('No notes found for this subject');
  return [];
};

// Delete a specific note
export const deleteNote = (subjectId, noteId) => {
  if (!subjectId || !noteId) return false;
  
  const existingNotes = getNotes(subjectId);
  const updatedNotes = existingNotes.filter(note => note._id !== noteId);
  
  localStorage.setItem(`${NOTES_PREFIX}${subjectId}`, JSON.stringify(updatedNotes));
  
  return true;
};