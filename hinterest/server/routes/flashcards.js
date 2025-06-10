const express = require('express');
const router = express.Router();
const Flashcard = require('../models/Flashcard');
const auth = require('../middleware/auth');

// Get all flashcards for a specific subject
router.get('/subject/:subjectId', auth, async (req, res) => {
  try {
    const flashcards = await Flashcard.find({ 
      subject: req.params.subjectId,
      user: req.user.userId
    }).sort({ createdAt: -1 });
    
    res.json(flashcards);
  } catch (err) {
    console.error('Error fetching flashcards:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific flashcard
router.get('/:id', auth, async (req, res) => {
  try {
    const flashcard = await Flashcard.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!flashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    res.json(flashcard);
  } catch (err) {
    console.error('Error fetching flashcard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new flashcard
router.post('/', auth, async (req, res) => {
  try {
    const { term, description, subjectId } = req.body;
    console.log('🟡 Creating flashcard:', req.body);

    // Create new flashcard
    const newFlashcard = new Flashcard({
      term,
      description,
      subject: subjectId,
      user: req.user.userId
    });
    
    const savedFlashcard = await newFlashcard.save();
    res.status(201).json(savedFlashcard);
  } catch (err) {
    console.error('Error creating flashcard:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a flashcard
router.put('/:id', auth, async (req, res) => {
  try {
    const { term, description } = req.body;
    
    // Find and update flashcard
    const updatedFlashcard = await Flashcard.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { 
        term, 
        description,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    res.json(updatedFlashcard);
  } catch (err) {
    console.error('Error updating flashcard:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a flashcard
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedFlashcard = await Flashcard.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!deletedFlashcard) {
      return res.status(404).json({ message: 'Flashcard not found' });
    }
    
    res.json({ message: 'Flashcard deleted' });
  } catch (err) {
    console.error('Error deleting flashcard:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;