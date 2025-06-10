const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');

// Get all subjects for the logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const subjects = await Subject.find({ user: req.user.userId });
    res.json(subjects);
  } catch (err) {
    console.error('Error fetching subjects:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a specific subject
router.get('/:id', auth, async (req, res) => {
  try {
    const subject = await Subject.findOne({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(subject);
  } catch (err) {
    console.error('Error fetching subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new subject
router.post('/', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Create new subject
    const newSubject = new Subject({
      name,
      description,
      user: req.user.userId
    });
    
    const savedSubject = await newSubject.save();
    res.status(201).json(savedSubject);
  } catch (err) {
    console.error('Error creating subject:', err);
    res.status(400).json({ message: err.message });
  }
});

// Update a subject
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, description } = req.body;
    
    // Find and update subject
    const updatedSubject = await Subject.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      { name, description },
      { new: true }
    );
    
    if (!updatedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json(updatedSubject);
  } catch (err) {
    console.error('Error updating subject:', err);
    res.status(400).json({ message: err.message });
  }
});

// Delete a subject
router.delete('/:id', auth, async (req, res) => {
  try {
    const deletedSubject = await Subject.findOneAndDelete({ 
      _id: req.params.id,
      user: req.user.userId
    });
    
    if (!deletedSubject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    
    res.json({ message: 'Subject deleted' });
  } catch (err) {
    console.error('Error deleting subject:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;