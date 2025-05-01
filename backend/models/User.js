const mongoose = require('mongoose');
const assert = require('assert');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  createdAt: { type: Date, default: Date.now }
});

// Add pre-save middleware for validation
userSchema.pre('save', function(next) {
  assert(this.username && this.username.length > 0, 'Username is required');
  assert(this.password && this.password.length >= 6, 'Password must be at least 6 characters');
  assert(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email), 'Invalid email format');
  next();
});

module.exports = mongoose.model('User', userSchema);