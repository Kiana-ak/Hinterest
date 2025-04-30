import axios from 'axios';

// Get API key from environment variables
const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Better debugging
console.log("GEMINI API KEY exists:", !!API_KEY); // Logs true/false instead of exposing the key

// Check if API key exists
if (!API_KEY) {
  console.error("Gemini API key is missing. Please check your .env file and restart the server.");
}

// Updated API URL with the correct endpoint
const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${API_KEY}`;

export const getGeminiResponse = async (userInput) => {
  try {
    // Log request (without exposing full content)
    console.log("Sending request to Gemini API...");
    
    const response = await axios.post(API_URL, {
      contents: [{ 
        role: "user",
        parts: [{ text: userInput }] 
      }]
    });
    
    console.log("Received response from Gemini API");
    
    // Check if response has the expected structure
    if (!response.data || !response.data.candidates || !response.data.candidates[0]) {
      console.error("Unexpected response format:", response.data);
      throw new Error("Unexpected response format from Gemini API");
    }
    
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    // Enhanced error logging
    console.error("Gemini API error:", error.response?.data || error.message);
    
    if (error.response) {
      console.error("Response status:", error.response.status);
      console.error("Response data:", JSON.stringify(error.response.data));
    }
    
    throw error;
  }
};
