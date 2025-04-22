// GeminiService.js - Service for generating flashcards with Gemini AI API
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API with your key
// Note: In production, you should store this key in environment variables
const API_KEY = "AIzaSyB5K8sEqjGMG1n3-gGT3FxyOUDVyXf3nNg"; // Replace with actual API key
const genAI = new GoogleGenerativeAI(API_KEY);

// Get the model
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Function to generate AI responses for summarizing lectures
const summarizeLecture = async (lectureContent) => {
  try {
    const prompt = `Please summarize the following lecture: ${lectureContent}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error summarizing lecture:", error);
    return "Failed to summarize lecture. Please try again.";
  }
};

// Function to generate notes from a lecture
const generateNotes = async (lectureContent) => {
  try {
    const prompt = `Create organized study notes from this lecture: ${lectureContent}`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error generating notes:", error);
    return "Failed to generate notes. Please try again.";
  }
};

// Function to create flashcards from lecture content
const createFlashcards = async (lectureContent) => {
  try {
    const prompt = `Create a set of flashcards with question on one side and answer on the other from this lecture content. Format as JSON with 'question' and 'answer' fields: ${lectureContent}`;
    const result = await model.generateContent(prompt);
    const flashcardsText = result.response.text();
    
    // Attempt to parse the response as JSON
    try {
      return JSON.parse(flashcardsText);
    } catch (parseError) {
      console.error("Error parsing flashcards JSON:", parseError);
      return { error: "Failed to parse flashcards data" };
    }
  } catch (error) {
    console.error("Error creating flashcards:", error);
    return { error: "Failed to create flashcards. Please try again." };
  }
};

// Function to generate a quiz from lecture content
const generateQuiz = async (lectureContent) => {
  try {
    const prompt = `Create a quiz with 5 multiple-choice questions based on this lecture. Format as JSON with 'question', 'options' (array), and 'correctAnswer' (index) fields: ${lectureContent}`;
    const result = await model.generateContent(prompt);
    const quizText = result.response.text();
    
    // Attempt to parse the response as JSON
    try {
      return JSON.parse(quizText);
    } catch (parseError) {
      console.error("Error parsing quiz JSON:", parseError);
      return { error: "Failed to parse quiz data" };
    }
  } catch (error) {
    console.error("Error generating quiz:", error);
    return { error: "Failed to generate quiz. Please try again." };
  }
};

// Function to suggest related videos
const suggestVideos = async (lectureContent) => {
  try {
    const prompt = `Based on this lecture content, suggest 3-5 topics for educational videos that would complement the material. Format as JSON with an array of objects containing 'title' and 'description' fields: ${lectureContent}`;
    const result = await model.generateContent(prompt);
    const suggestionsText = result.response.text();
    
    // Attempt to parse the response as JSON
    try {
      return JSON.parse(suggestionsText);
    } catch (parseError) {
      console.error("Error parsing video suggestions JSON:", parseError);
      return { error: "Failed to parse video suggestions data" };
    }
  } catch (error) {
    console.error("Error suggesting videos:", error);
    return { error: "Failed to suggest videos. Please try again." };
  }
};

// Function to answer student questions
const answerQuestion = async (lectureContent, question) => {
  try {
    const prompt = `Based on this lecture content: "${lectureContent}", please answer the following question: "${question}"`;
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("Error answering question:", error);
    return "I couldn't answer your question at this time. Please try rephrasing or ask something else.";
  }
};

// Export all the functions
export default {
  summarizeLecture,
  generateNotes,
  createFlashcards,
  generateQuiz,
  suggestVideos,
  answerQuestion
};