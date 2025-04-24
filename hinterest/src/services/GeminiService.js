// GeminiService.js - Service for generating flashcards with Gemini AI API
import { GoogleGenerativeAI } from '@google/generative-ai';

class GeminiService {
  constructor() {
    // You would need to replace this with your actual API key
    this.API_KEY = 'AIzaSyB5K8sEqjGMG1n3-gGT3FxyOUDVyXf3nNg';
    this.genAI = new GoogleGenerativeAI(this.API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-pro' });
  }

  /**
   * Generates flashcards for a given topic using Gemini AI
   * @param {string} topic - The topic to generate flashcards for
   * @param {number} count - Number of flashcards to generate
   * @returns {Promise<Array>} - Array of generated flashcard objects
   */
  static async generateFlashcards(topic, count) {
    try {
      const service = new GeminiService();
      
      const prompt = `Generate ${count} educational flashcards about "${topic}". 
      Each flashcard should have a term and its definition. 
      Format the response as a JSON array with objects containing "term" and "definition" properties.`;
      
      const result = await service.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      // Note: This might need adjustment based on the actual response format
      let cards;
      try {
        // Find JSON content in the response (handles cases where there might be extra text)
        const jsonMatch = text.match(/\[.*\]/s);
        if (jsonMatch) {
          cards = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error("Could not find JSON array in response");
        }
      } catch (parseError) {
        console.error("Error parsing JSON response:", parseError);
        throw new Error("Failed to parse AI response");
      }
      
      // Add the topic to each card
      return cards.map(card => ({
        ...card,
        topic: topic
      }));
    } catch (error) {
      console.error("Error generating flashcards:", error);
      throw new Error("Failed to generate flashcards");
    }
  }
}

export default GeminiService;