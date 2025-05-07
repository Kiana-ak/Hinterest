const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const auth = require('../middleware/auth');

// Get all quizzes for a specific subject
router.get('/subject/:subjectId', auth, async (req, res) => {
  try {
    const quizzes = await Quiz.find({ 
      subject: req.params.subjectId,
      user: req.user.userId
    }).sort({ createdAt: -1 });
    
    res.json(quizzes);
  } catch (err) {
    console.error('Error fetching quizzes:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific quiz
router.get('/:id', auth, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(quiz);
  } catch (err) {
    console.error('Error fetching quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new quiz
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, questions, subjectId } = req.body;
    
    // Create new quiz
    const newQuiz = new Quiz({
      title,
      description,
      questions,
      subject: subjectId,
      user: req.user.userId
    });
    
    const savedQuiz = await newQuiz.save();
    res.status(201).json(savedQuiz);
  } catch (err) {
    console.error('Error creating quiz:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a quiz
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, questions } = req.body;
    
    // Find and update quiz
    const updatedQuiz = await Quiz.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { 
        title, 
        description,
        questions,
        updatedAt: Date.now()
      },
      { new: true }
    );
    
    if (!updatedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json(updatedQuiz);
  } catch (err) {
    console.error('Error updating quiz:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a quiz
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedQuiz = await Quiz.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!deletedQuiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    
    res.json({ message: 'Quiz deleted' });
  } catch (err) {
    console.error('Error deleting quiz:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;