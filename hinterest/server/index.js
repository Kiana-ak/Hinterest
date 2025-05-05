// Load modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('./user');
const subjectRoutes = require('./subjects'); // ✅ This already handles all /api/subjects routes

const app = express();
const PORT = 5000;
const JWT_SECRET = "supersecretkey";

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
const uri = "mongodb+srv://hinterest1:M1DxqiRIpYyt4KLJ@hinterest-cluster.5eafkyj.mongodb.net/?retryWrites=true&w=majority&appName=hinterest-cluster";
mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Register route
app.post('/api/register', async (req, res) => {
  console.log("Register request received with body:", req.body);
  const { email, password } = req.body;

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Registration failed" });
  }
});

// ✅ Login route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ error: "Incorrect password" });

    const token = jwt.sign({ userId: user._id, email: user.email }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
});

// ✅ Mount subject routes (includes /api/subjects GET and POST)
app.use(subjectRoutes);

// ✅ Test routes
app.get('/', (req, res) => res.send('Hinterest backend is working!'));
app.get('/api/test', (req, res) => res.send('API test works!'));

// ✅ Start server (only once)
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});