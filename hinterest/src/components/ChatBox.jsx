import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const socket = io('http://localhost:5500');

const ChatBox = () => {
  const userEmail = localStorage.getItem('userEmail');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [chatId, setChatId] = useState('');
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isChatting, setIsChatting] = useState(false);

  const generateChatId = (email1, email2) => {
    return [email1.toLowerCase(), email2.toLowerCase()].sort().join(':');
  };

  useEffect(() => {
    if (userEmail) {
      socket.emit('register_email', userEmail);
    }

    socket.on('receive_message', (msg) => {
      if (msg.chatId === chatId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => socket.off('receive_message');
  }, [chatId, userEmail]);

  const startChat = async () => {
    const id = generateChatId(userEmail, recipientEmail);
    setChatId(id);
    setIsChatting(true);

    try {
      const res = await fetch(`http://localhost:5500/messages/${id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  const sendMessage = () => {
    if (!message.trim()) return;

    const msgData = {
      senderEmail: userEmail,
      recipientEmail,
      text: message
    };

    socket.emit('send_message', msgData);
    setMessages(prev => [...prev, { ...msgData, timestamp: new Date() }]);
    setMessage('');
  };

  if (!userEmail) return <p>You must be logged in to use chat.</p>;

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-sidebar">
        <h4>Start New Chat</h4>
        <div className="chat-new">
          <input
            type="email"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={e => setRecipientEmail(e.target.value)}
          />
          <button onClick={startChat} disabled={!recipientEmail}>Start</button>
        </div>
      </div>

      {isChatting ? (
        <div className="chatbox-container">
          <div className="chatbox-header">
            Chat with {recipientEmail}
          </div>

          <div className="chatbox-messages">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className="chatbox-message"
                style={{
                  alignSelf: msg.senderEmail === userEmail ? 'flex-end' : 'flex-start',
                  backgroundColor: msg.senderEmail === userEmail ? '#c8e6c9' : '#e1f5fe'
                }}
              >
                <strong>{msg.senderEmail}:</strong> {msg.text}
              </div>
            ))}
          </div>

          <div className="chatbox-input">
            <input
              type="text"
              placeholder="Type your message..."
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      ) : (
        <div className="chatbox-container" style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
          <p style={{ fontSize: '1.2rem' }}>Start a chat to begin messaging.</p>
        </div>
      )}
    </div>
  );
};

export default ChatBox;