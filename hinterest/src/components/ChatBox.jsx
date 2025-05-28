import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const socket = io('http://localhost:5000');

function ChatBox() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({}); // keyed by chatId
  
  //example
  const [selectedChat, setSelectedChat] = useState('General > Alice');

  const oneOnOneChats = ['Alice', 'Bob'];
  const groupChats = ['Study Group', 'Math Team'];
  //examples

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
    if (!message.trim()) return;
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
