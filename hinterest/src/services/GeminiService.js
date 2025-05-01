import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent?key=${API_KEY}`;

export const getGeminiResponse = async (chatHistory) => {
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
