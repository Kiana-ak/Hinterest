const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // your frontend
    methods: ['GET', 'POST']
  }
});

app.use(cors());
app.use(express.json());

const messages = {}; // store messages per chatId
const chats = [];    // store chats

// GET all chats
app.get('/chats', (req, res) => {
  res.json(chats);
});

// POST a new chat
app.post('/chats', (req, res) => {
  const { email1, email2, isGroup } = req.body;
  const chatId = `General > ${[email1, email2].sort().join(',')}`;
  const exists = chats.find(c => c.chatId === chatId);
  if (exists) return res.status(409).send('Chat already exists');

  const newChat = { chatId, participants: [email1, email2], isGroup };
  chats.push(newChat);
  res.json(newChat);
});

// GET messages for a chat
app.get('/messages/:chatId', (req, res) => {
  const chatId = req.params.chatId;
  res.json(messages[chatId] || []);
});

// WebSocket handling
io.on('connection', (socket) => {
  console.log('✅ New socket connection');

  socket.on('send_message', ({ chatId, text }) => {
    if (!messages[chatId]) messages[chatId] = [];
    messages[chatId].push({ text });
    socket.broadcast.emit('receive_message', { chatId, text });
  });

  socket.on('disconnect', () => {
    console.log('❌ Socket disconnected');
  });
});

server.listen(5500, () => {
  console.log('🚀 Server running on http://localhost:5500');
});
