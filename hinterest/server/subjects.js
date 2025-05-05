const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Subject = require('./Subject');

const JWT_SECRET = 'supersecretkey';

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

router.get('/api/subjects', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  try {
    const subjects = await Subject.find({ userId });
    res.json(subjects);
  } catch (err) {
    console.error('❌ Error loading subjects:', err);
    res.status(500).json({ error: 'Failed to load subjects' });
  }
});

router.post('/api/subjects', authenticateToken, async (req, res) => {
  const { name } = req.body;
  const userId = req.user.userId;

  console.log('📩 Incoming subject POST:', { name, userId });

  if (!name) return res.status(400).json({ error: 'Subject name is required' });

  try {
    const newSubject = new Subject({ name, userId });
    await newSubject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    console.error('❌ Failed to save subject:', err);
    res.status(500).json({ error: 'Failed to create subject' });
  }
});

router.delete('/api/subjects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const userId = req.user.userId;
  
    try {
      const deleted = await Subject.findOneAndDelete({ _id: id, userId });
      if (!deleted) {
        return res.status(404).json({ error: 'Subject not found or not owned by user' });
      }
      res.json({ message: 'Subject deleted' });
    } catch (err) {
      console.error('❌ Error deleting subject:', err);
      res.status(500).json({ error: 'Failed to delete subject' });
    }
  });
  
  router.put('/api/subjects/:id', authenticateToken, async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const userId = req.user.userId;
  
    if (!name) return res.status(400).json({ error: 'New subject name is required' });
  
    try {
      const updated = await Subject.findOneAndUpdate(
        { _id: id, userId },
        { name },
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({ error: 'Subject not found or not owned by user' });
      }
  
      res.json(updated);
    } catch (err) {
      console.error('❌ Error renaming subject:', err);
      res.status(500).json({ error: 'Failed to rename subject' });
    }
  });
  

module.exports = router;
