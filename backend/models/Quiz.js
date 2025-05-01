const mongoose = require('mongoose');
const assert = require('assert');

const quizSchema = new mongoose.Schema({
  name: { type: String, required: true },
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  questions: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswers: [{ type: Number, required: true }],
    lastModified: { type: Date, default: Date.now }  // Add this field
  }],
  createdAt: { type: Date, default: Date.now },
  lastAccessed: { type: Date, default: Date.now }    // Add this field
});

// Add pre-save middleware for validation
quizSchema.pre('save', function(next) {
  assert(this.name && this.name.length > 0, 'Quiz name is required');
  assert(this.questions && this.questions.length > 0, 'Quiz must have at least one question');
  
  this.questions.forEach((question, index) => {
    assert(question.options.length >= 2, `Question ${index + 1} must have at least 2 options`);
    assert(question.correctAnswers.length > 0, `Question ${index + 1} must have at least one correct answer`);
    question.correctAnswers.forEach(answer => {
      assert(answer >= 0 && answer < question.options.length, 
        `Question ${index + 1} has invalid correct answer index`);
    });
  });
  
  next();
});

// Add middleware to update lastAccessed
quizSchema.pre('find', function() {
  this.update({}, { $set: { lastAccessed: new Date() } });
});

module.exports = mongoose.model('Quiz', quizSchema);