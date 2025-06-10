const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Add index for user and name combination to allow same subject names for different users
subjectSchema.index({ user: 1, name: 1 }, { unique: true });

const Subject = mongoose.model('Subject', subjectSchema);
module.exports = Subject;