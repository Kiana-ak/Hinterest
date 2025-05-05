const express = require('express');
const cors = require('cors');
const genAI = require('./config/gemini');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('Hinterest backend is working!');
});

// Authentication routes
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  // TODO: Implement real authentication
  res.json({ success: true, message: 'Login successful' });
});

// Flashcard routes
app.post('/api/flashcards', (req, res) => {
  const { subject, flashcards } = req.body;
  // Store flashcards in memory for now
  // In a real app, you'd want to use a database
  if (!global.flashcardsStore) {
    global.flashcardsStore = {};
  }
  global.flashcardsStore[subject] = flashcards;
  res.json({ success: true, message: 'Flashcards saved' });
});

app.get('/api/flashcards/:subject', (req, res) => {
  const { subject } = req.params;
  // Retrieve flashcards from memory
  const flashcards = global.flashcardsStore?.[subject] || [];
  res.json({ flashcards });
});

// Notes routes
app.post('/api/notes', (req, res) => {
  const { subject, note } = req.body;
  if (!global.notesStore) {
    global.notesStore = {};
  }
  if (!global.notesStore[subject]) {
    global.notesStore[subject] = [];
  }
  global.notesStore[subject].push(note);
  res.json({ success: true, message: 'Note saved' });
});

app.get('/api/notes/:subject', (req, res) => {
  const { subject } = req.params;
  const notes = global.notesStore?.[subject] || [];
  res.json({ notes });
});

// Quiz routes
app.post('/api/quizzes', (req, res) => {
  const { subject, quiz } = req.body;
  if (!global.quizStore) {
    global.quizStore = {};
  }
  if (!global.quizStore[subject]) {
    global.quizStore[subject] = [];
  }
  global.quizStore[subject].push(quiz);
  res.json({ success: true, message: 'Quiz saved' });
});

app.get('/api/quizzes/:subject', (req, res) => {
  const { subject } = req.params;
  const quizzes = global.quizStore?.[subject] || [];
  res.json({ quizzes });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

// Gemini-powered flashcard generation endpoint
app.post('/api/generate-flashcards', async (req, res) => {
  try {
    const { subject, content } = req.body;
    
    // Initialize the model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // Create the prompt
    const prompt = `Create flashcards for studying ${subject}. 
    Use this content: ${content}
    Format the response as a JSON array of objects with 'question' and 'answer' properties.
    Each flashcard should focus on a key concept.
    Generate at least 5 flashcards.`;

    // Generate the response
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Parse the generated text as JSON
    const flashcards = JSON.parse(text);
    
    // Add IDs to the flashcards
    const flashcardsWithIds = flashcards.map(card => ({
      ...card,
      id: Date.now() + Math.random()
    }));

    res.json({ flashcards: flashcardsWithIds });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    res.status(500).json({ error: 'Failed to generate flashcards' });
  }
});
