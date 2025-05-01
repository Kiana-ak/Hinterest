const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Add assertions for environment variables
const assert = require('assert');
assert(process.env.MONGODB_URI, 'MONGODB_URI is required');
assert(process.env.JWT_SECRET, 'JWT_SECRET is required');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hinterest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

// Routes will be added here
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subjects', require('./routes/subjects'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/flashcards', require('./routes/flashcards'));
app.use('/api/quizzes', require('./routes/quizzes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});