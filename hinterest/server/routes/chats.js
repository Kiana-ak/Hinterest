const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const chatSchema = new mongoose.Schema({
  name: String,
  type: String 
});

const Chat = mongoose.model('Chat', chatSchema);

router.get('/', async (req, res) => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
});

router.post('/', async (req, res) => {
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

module.exports = router;
