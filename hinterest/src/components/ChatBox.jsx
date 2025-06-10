import React, { useEffect, useState, useRef, useCallback } from 'react';
import io from 'socket.io-client';
import '../styles/ChatBox.css';

const socket = io('http://localhost:5500');
const POLL_INTERVAL = 5000; // Check for new messages every 5 seconds

const ChatBox = () => {
  const userEmail = localStorage.getItem('userEmail');
  const [userChats, setUserChats] = useState([]);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [chatId, setChatId] = useState('');
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const pollIntervalRef = useRef(null);

  const generateChatId = (email1, email2) => {
    return [email1.toLowerCase(), email2.toLowerCase()].sort().join(':');
  };

  const fetchMessages = useCallback(async (id) => {
    if (!id) return;
    
    try {
      const res = await fetch(`http://localhost:5500/messages/${id}`);
      const data = await res.json();
      setMessages(data);
    } catch (err) {
      console.error('Error loading messages', err);
    }
  }, []);

  const loadChat = useCallback(async (id, recipient) => {
    setChatId(id);
    setActiveChat({ chatId: id, recipient });
    setRecipientEmail(recipient);
    await fetchMessages(id);

    // Reset polling when chat changes
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    pollIntervalRef.current = setInterval(() => {
      fetchMessages(id);
    }, POLL_INTERVAL);
  }, [fetchMessages]);

  const fetchUserChats = useCallback(async () => {
    if (!userEmail) return;
    
    try {
      const res = await fetch(`http://localhost:5500/chats/${userEmail}`);
      const data = await res.json();
      setUserChats(data);
      if (data.length > 0 && !activeChat) {
        const first = data[0];
        const other = first.participants.find(p => p !== userEmail);
        await loadChat(first.chatId, other);
      }
    } catch (err) {
      console.error('Error fetching chats', err);
    }
  }, [userEmail, activeChat, loadChat]);

  useEffect(() => {
    if (userEmail) {
      socket.emit('register_email', userEmail);
      fetchUserChats();

      // Set up initial polling
      if (chatId) {
        pollIntervalRef.current = setInterval(() => {
          fetchMessages(chatId);
        }, POLL_INTERVAL);
      }
    }

    socket.on('receive_message', (msg) => {
      const otherUser = msg.senderEmail === userEmail ? msg.recipientEmail : msg.senderEmail;

      setUserChats(prev => {
        const exists = prev.some(chat => chat.chatId === msg.chatId);
        if (!exists) {
          return [...prev, { chatId: msg.chatId, participants: [userEmail, otherUser] }];
        }
        return prev;
      });

      if (msg.chatId === chatId) {
        setMessages(prev => [...prev, msg]);
      }
    });

    return () => {
      socket.off('receive_message');
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [userEmail, chatId, fetchMessages, fetchUserChats]);

  const startChat = async () => {
    if (!recipientEmail || recipientEmail === userEmail) return;

    const id = generateChatId(userEmail, recipientEmail);
    const exists = userChats.find(c => c.chatId === id);

    if (!exists) {
      setUserChats(prev => [...prev, { chatId: id, participants: [userEmail, recipientEmail] }]);
    }

    await loadChat(id, recipientEmail);
  };

  const sendMessage = () => {
    if (!message.trim() || !chatId) return;

    const msgData = {
      chatId,
      senderEmail: userEmail,
      recipientEmail,
      text: message,
      timestamp: new Date().toISOString()
    };

    socket.emit('send_message', msgData);
    setMessages(prev => [...prev, msgData]);
    setMessage('');
  };

  if (!userEmail) return <p>You must be logged in to use the chat.</p>;

  return (
    <div className="chatbox-wrapper">
      <div className="chatbox-sidebar">
        <h4>Chats</h4>
        <ul>
          {userChats.map(chat => {
            const recipient = chat.participants.find(p => p !== userEmail);
            return (
              <li
                key={chat.chatId}
                onClick={() => loadChat(chat.chatId, recipient)}
                className={chat.chatId === activeChat?.chatId ? 'active' : ''}
              >
                {recipient}
              </li>
            );
          })}
        </ul>
        <div className="chat-new">
          <input
            type="email"
            placeholder="New recipient email"
            value={recipientEmail}
            onChange={e => setRecipientEmail(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && startChat()}
          />
          <button onClick={startChat}>Start</button>
        </div>
      </div>

      <div className="chatbox-container">
        {activeChat ? (
          <>
            <div className="chatbox-header">
              Chat with {activeChat.recipient}
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
                  <div className="message-meta">
                    <strong>{msg.senderEmail === userEmail ? 'You' : msg.senderEmail}</strong>
                    <span className="message-time">
                      {new Date(msg.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="message-text">{msg.text}</div>
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
          </>
        ) : (
          <div className="chatbox-empty">
            <p>Select a chat or start a new one to begin messaging.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatBox;