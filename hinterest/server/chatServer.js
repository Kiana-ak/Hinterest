const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

// ✅ MongoDB connection
const uri = "mongodb+srv://hinterest1:M1DxqiRIpYyt4KLJ@hinterest-cluster.5eafkyj.mongodb.net/?retryWrites=true&w=majority&appName=hinterest-cluster";

mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🟢 Chat MongoDB connected'))
  .catch((err) => console.error('❌ Chat MongoDB connection error:', err));

// ✅ Message schema
const chatMessageSchema = new mongoose.Schema({
  chatId: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

// ✅ Chat metadata schema (added)
const chatSchema = new mongoose.Schema({
  name: String,
  type: String
});

const Chat = mongoose.model('Chat', chatSchema);

// ✅ Fetch messages
app.get('/messages/:chatId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ chatId: req.params.chatId }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// ✅ Fetch saved chats (new)
app.get('/chats', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

// ✅ Save new chat (new)
app.post('/chats', async (req, res) => {
  const { name, type } = req.body;
  if (!name || !type) return res.status(400).json({ error: 'Missing name or type' });

  try {
    const existing = await Chat.findOne({ name, type });
    if (existing) return res.status(200).json({ message: 'Chat already exists' });

    const newChat = new Chat({ name, type });
    await newChat.save();
    res.status(201).json({ message: 'Chat saved' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save chat' });
  }
});

// ✅ WebSocket setup
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('send_message', async ({ chatId, text }) => {
    const newMessage = new ChatMessage({ chatId, text });
    await newMessage.save();

    io.emit('receive_message', { chatId, text });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// ✅ Start chat server
const PORT = 5500;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on http://localhost:${PORT}`);
});
