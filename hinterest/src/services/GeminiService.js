import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`;

// Store chat histories by subject ID
const chatHistoriesBySubject = {};

export const getGeminiResponse = async (chatHistory, subjectId) => {
  // Store the chat history for this subject
  if (subjectId) {
    chatHistoriesBySubject[subjectId] = [...chatHistory]; // Make a copy to avoid reference issues
  }
  
  // Convert your messages to Gemini format
  const contents = chatHistory.map(msg => ({
    role: msg.sender === 'user' ? 'user' : 'model',
    parts: [{ text: msg.text }]
  }));

  try {
    const response = await axios.post(API_URL, { contents });
    console.log("Gemini full response:", response.data);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error);
    if (error.response?.data) {
      console.error("Full Gemini error response:", JSON.stringify(error.response.data, null, 2));
    }
    throw error;
  }
};

// Function to get chat history for a specific subject
export const getChatHistoryForSubject = (subjectId) => {
  return subjectId && chatHistoriesBySubject[subjectId] ? [...chatHistoriesBySubject[subjectId]] : [];
};

// Function to clear chat history for a specific subject
export const clearChatHistory = (subjectId) => {
  if (subjectId && chatHistoriesBySubject[subjectId]) {
    delete chatHistoriesBySubject[subjectId];
  }
};

// Function to save chat history to localStorage
export const saveChatHistoryToLocalStorage = (subjectId, chatHistory) => {
  if (subjectId && chatHistory) {
    localStorage.setItem(`chat_history_${subjectId}`, JSON.stringify(chatHistory));
  }
};

// Function to load chat history from localStorage
export const loadChatHistoryFromLocalStorage = (subjectId) => {
  if (!subjectId) return [];
  
  const savedHistory = localStorage.getItem(`chat_history_${subjectId}`);
  if (savedHistory) {
    try {
      const parsedHistory = JSON.parse(savedHistory);
      // Also update the in-memory history
      chatHistoriesBySubject[subjectId] = parsedHistory;
      return parsedHistory;
    } catch (e) {
      console.error('Error parsing chat history:', e);
      return [];
    }
  }
  return [];
};
