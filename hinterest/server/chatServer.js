const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:5000/chatapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🟢 MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const chatMessageSchema = new mongoose.Schema({
  chatId: String,
  text: String,
  timestamp: { type: Date, default: Date.now }
});

const ChatMessage = mongoose.model('ChatMessage', chatMessageSchema);

app.get('/messages/:chatId', async (req, res) => {
  try {
    const messages = await ChatMessage.find({ chatId: req.params.chatId }).sort('timestamp');
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

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

const PORT = 5500;
server.listen(PORT, () => {
  console.log(`🚀 Chat server running on http://localhost:${PORT}`);
});
