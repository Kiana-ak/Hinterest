import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const socket = io('http://localhost:5500');

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({});
  const [selectedChat, setSelectedChat] = useState('');
  const [chatList, setChatList] = useState([]);
  const [newChatEmail, setNewChatEmail] = useState('');
  const myEmail = localStorage.getItem('email');

  useEffect(() => {
    const loadChats = async () => {
      try {
        const res = await fetch('http://localhost:5500/chats');
        const data = await res.json();
        const myChats = data.filter(chat => chat.participants.includes(myEmail));
        setChatList(myChats);
        if (myChats.length > 0) {
          setSelectedChat(myChats[0].chatId);
        }
      } catch (err) {
        console.error('Failed to load chats:', err);
      }
    };
    loadChats();
  }, [myEmail]);

  useEffect(() => {
    if (!selectedChat) return;
    const loadHistory = async () => {
      try {
        const res = await fetch(`http://localhost:5500/messages/${encodeURIComponent(selectedChat)}`);
        const data = await res.json();
        setMessages(prev => ({
          ...prev,
          [selectedChat]: data.map(entry => entry.text)
        }));
      } catch (err) {
        console.error('Failed to load chat history:', err);
      }
    };
    loadHistory();
  }, [selectedChat]);

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

  const handleSend = () => {
    if (!message.trim() || !selectedChat) return;
    socket.emit('send_message', { chatId: selectedChat, text: `${myEmail}: ${message}` });
    setMessages(prev => ({
      ...prev,
      [selectedChat]: [...(prev[selectedChat] || []), `${myEmail}: ${message}`]
    }));
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  const handleCreateChat = async () => {
    if (!newChatEmail || newChatEmail === myEmail) return;
    const chatId = `General > ${[myEmail, newChatEmail].sort().join(',')}`;
    try {
      const res = await fetch('http://localhost:5500/chats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email1: myEmail,
          email2: newChatEmail,
          isGroup: false
        })
      });
      if (res.status === 409) {
        alert('Chat already exists');
        return;
      }
      const newChat = await res.json();
      setChatList(prev => [...prev, newChat]);
      setSelectedChat(newChat.chatId);
      setNewChatEmail('');
    } catch (err) {
      console.error('Failed to create chat:', err);
    }
  };

  const getChatDisplayName = (chat) => {
    if (chat.isGroup) {
      return chat.chatId.split(' > ')[1];
    } else {
      const [, ids] = chat.chatId.split(' > ');
      const [a, b] = ids.split(',');
      return a === myEmail ? b : a;
    }
  };

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-sidebar">
        <h4>Chats</h4>
        <ul>
          {chatList.map((chat) => (
            <li
              key={chat.chatId}
              className={selectedChat === chat.chatId ? 'active' : ''}
              onClick={() => setSelectedChat(chat.chatId)}
            >
              {getChatDisplayName(chat)}
            </li>
          ))}
        </ul>
        <div className="chat-new">
          <input
            type="email"
            placeholder="Start chat with email"
            value={newChatEmail}
            onChange={(e) => setNewChatEmail(e.target.value)}
          />
          <button onClick={handleCreateChat}>Start</button>
        </div>
      </div>

      <div className="chatbox-container">
        <div className="chatbox-header">{selectedChat || 'No chat selected'}</div>
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
