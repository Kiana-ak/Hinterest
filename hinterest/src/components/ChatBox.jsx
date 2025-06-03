import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const socket = io('http://localhost:5500');

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState('');
  const [oneOnOneChats, setOneOnOneChats] = useState([]);
  const [groupChats, setGroupChats] = useState([]);
  const [newChatName, setNewChatName] = useState('');
  const [newChatType, setNewChatType] = useState('General'); // or 'Group'

  // ✅ Load chat list from backend
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await fetch('http://localhost:5000/api/chats');
        const data = await res.json();
        const oneOnOne = data.filter(chat => chat.type === 'General').map(chat => chat.name);
        const group = data.filter(chat => chat.type === 'Group').map(chat => chat.name);
        setOneOnOneChats(oneOnOne);
        setGroupChats(group);
      } catch (err) {
        console.error('Failed to fetch chat list:', err);
      }
    };

    fetchChats();
  }, []);

  useEffect(() => {
    socket.on('receive_message', ({ chatId, text }) => {
      setMessages(prev => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), text]
      }));
    });

    return () => {
      socket.off('receive_message');
    };
  }, []);

  useEffect(() => {
    const loadHistory = async () => {
      if (!selectedChat) return;
      try {
        const res = await fetch(`http://localhost:5500/messages/${encodeURIComponent(selectedChat)}`);
        const data = await res.json();

        if (Array.isArray(data)) {
          setMessages(prev => ({
            ...prev,
            [selectedChat]: data.map(entry => entry.text)
          }));
        } else {
          console.error('Unexpected response (not an array):', data);
          setMessages(prev => ({
            ...prev,
            [selectedChat]: []
          }));
        }
      } catch (err) {
        console.error('Failed to load chat history:', err);
        setMessages(prev => ({
          ...prev,
          [selectedChat]: []
        }));
      }
    };

    loadHistory();
  }, [selectedChat]);

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    socket.emit('send_message', { chatId: selectedChat, text: `You: ${message}` });
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), `You: ${message}`]
    }));
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleAddChat = async () => {
    if (!newChatName.trim()) return;

    const formattedChatId = `${newChatType} > ${newChatName}`;

    try {
      // ✅ Save chat to MongoDB
      await fetch('http://localhost:5000/api/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newChatName, type: newChatType })
      });

      // ✅ Update local state
      if (newChatType === 'General') {
        setOneOnOneChats(prev => [...new Set([...prev, newChatName])]);
      } else {
        setGroupChats(prev => [...new Set([...prev, newChatName])]);
      }

      setSelectedChat(formattedChatId);
      setNewChatName('');
    } catch (err) {
      console.error('Failed to save new chat:', err);
    }
  };

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-sidebar">
        <h4>Chats</h4>

        <div className="chat-category">
          <strong>General</strong>
          <ul>
            {oneOnOneChats.map((chat) => (
              <li
                key={chat}
                className={selectedChat === `General > ${chat}` ? 'active' : ''}
                onClick={() => setSelectedChat(`General > ${chat}`)}
              >
                {chat}
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-category">
          <strong>Group</strong>
          <ul>
            {groupChats.map((chat) => (
              <li
                key={chat}
                className={selectedChat === `Group > ${chat}` ? 'active' : ''}
                onClick={() => setSelectedChat(`Group > ${chat}`)}
              >
                {chat}
              </li>
            ))}
          </ul>
        </div>

        <div className="chat-new">
          <select value={newChatType} onChange={(e) => setNewChatType(e.target.value)}>
            <option value="General">General (1-on-1)</option>
            <option value="Group">Group</option>
          </select>
          <input
            type="text"
            placeholder="New chat name"
            value={newChatName}
            onChange={(e) => setNewChatName(e.target.value)}
          />
          <button onClick={handleAddChat}>Add Chat</button>
        </div>
      </div>

      <div className="chatbox-container">
        <div className="chatbox-header">{selectedChat}</div>
        <div className="chatbox-messages">
          {(messages[selectedChat] || []).map((msg, i) => (
            <div key={i} className="chatbox-message">{msg}</div>
          ))}
        </div>
        <div className="chatbox-input">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={`Message in ${selectedChat}...`}
          />
          <button onClick={handleSend}>Send</button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;
