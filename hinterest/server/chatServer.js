const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Chat = require('./models/Chat');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('🟢 MongoDB connected'))
  .catch((err) => console.error('❌ MongoDB error:', err));

function generateChatId(email1, email2) {
  return [email1.toLowerCase(), email2.toLowerCase()].sort().join(':');
}

app.get('/chats/:email', async (req, res) => {
  try {
    const chats = await Chat.find({ participants: req.params.email });
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user chats' });
  }
});

app.get('/messages/:chatId', async (req, res) => {
  try {
    const messages = await Message.find({ chatId: req.params.chatId }).sort('timestamp');
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

  socket.on('register_email', (email) => {
    socket.join(email.toLowerCase());
    console.log(`Socket ${socket.id} joined room: ${email}`);
  });

  socket.on('send_message', async ({ senderEmail, recipientEmail, text }) => {
    const chatId = generateChatId(senderEmail, recipientEmail);
    let chat = await Chat.findOne({ chatId });
    if (!chat) {
      chat = new Chat({ chatId, participants: [senderEmail, recipientEmail] });
      await chat.save();
    }

    const newMsg = new Message({ chatId, sender: senderEmail, text });
    await newMsg.save();

    socket.to(recipientEmail).emit('receive_message', {
      chatId,
      sender: senderEmail,
      text,
      timestamp: newMsg.timestamp
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = 5500;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));