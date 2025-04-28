import axios from 'axios';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
console.log("GEMINI API KEY:", API_KEY); //temp debug
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;

export const getGeminiResponse = async (userInput) => {
  try {
    const response = await axios.post(API_URL, {
      contents: [{ parts: [{ text: userInput }] }]
    });

    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Gemini API error:", error.response?.data || error.message);
    throw error;
  }
};
