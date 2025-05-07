const express = require('express');
const router = express.Router();
const Note = require('../models/Note');
const auth = require('../middleware/auth');

// Get all notes for a specific subject
router.get('/subject/:subjectId', auth, async (req, res) => {
  try {
    const notes = await Note.find({ 
      subject: req.params.subjectId,
      user: req.user.userId
    }).sort({ updatedAt: -1 });
    
    res.json(notes);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific note
router.get('/:id', auth, async (req, res) => {
  try {
    const note = await Note.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(note);
  } catch (err) {
    console.error('Error fetching note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new note
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, subjectId } = req.body;
    
    // Create new note
    const newNote = new Note({
      title,
      content,
      subject: subjectId,
      user: req.user.userId
    });
    
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a note
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Find and update note
    const updatedNote = await Note.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { 
        title, 
        content,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json(updatedNote);
  } catch (err) {
    console.error('Error updating note:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a note
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedNote = await Note.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!deletedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    res.json({ message: 'Note deleted' });
  } catch (err) {
    console.error('Error deleting note:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;