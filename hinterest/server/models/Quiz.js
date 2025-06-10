const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Option schema for quiz questions
const OptionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  isCorrect: {
    type: Boolean,
    default: false
  }
});

// Question schema for quizzes
const QuestionSchema = new Schema({
  text: {
    type: String,
    required: true
  },
  options: [OptionSchema],
  explanation: {
    type: String,
    default: ''
  }
});

// Main Quiz schema
const QuizSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  questions: [QuestionSchema],
  subject: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Quiz', QuizSchema);