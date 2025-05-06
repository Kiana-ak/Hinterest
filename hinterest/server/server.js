const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// Add this line to handle the deprecation warning
mongoose.set('strictQuery', false);

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hinterest', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
  console.log('MongoDB database connection established successfully');
});

// Routes
app.use('/api/subjects', require('./subjects')); 
app.use('/api', require('./routes/auth')); // Add this line for auth routes

// Add error handling for port in use
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
}).on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Port ${port} is already in use. Please try these solutions:`);
    console.error('1. Kill the process using the port:');
    console.error('   - Windows: netstat -ano | findstr :5000');
    console.error('   - Then: taskkill /PID <PID> /F');
    console.error('2. Or use a different port in .env file');
  } else {
    console.error('Server error:', err);
  }
});