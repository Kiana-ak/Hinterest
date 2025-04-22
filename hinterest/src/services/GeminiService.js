import { GoogleGenerativeAI } from "@google/generative-ai";

class GeminiService {
  constructor() {
    // Initialize the Google Generative AI with your API key
    // You should store this in an environment variable in production
    this.apiKey = process.env.REACT_APP_GEMINI_API_KEY;
    this.genAI = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
  }

  /**
   * Generate flashcards for a specific topic
   * @param {string} topic - The topic to generate flashcards for
   * @param {number} count - Number of flashcards to generate (default: 5)
   * @returns {Promise<Array>} Array of generated flashcard objects
   */
  async generateFlashcards(topic, count = 5) {
    try {
      // Create a prompt for the Gemini model
      const prompt = `Generate ${count} flashcards about "${topic}". 
      Each flashcard should have a term and its definition.
      Format the output as a JSON array with objects containing "term", "definition", and "topic" fields.
      The "topic" field should be set to "${topic}" for all cards.
      Make the cards educational, accurate, and focused on key concepts.`;

      // Generate content with Gemini
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      // We need to handle potential formatting issues in the response
      try {
        // Find JSON content between brackets if there's text before/after the JSON
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        const parsedCards = JSON.parse(jsonString);
        
        // Validate the structure of each card
        const validCards = parsedCards.filter(card => 
          card.term && card.definition && typeof card.term === 'string' && typeof card.definition === 'string'
        ).map(card => ({
          term: card.term,
          definition: card.definition,
          topic: topic // Ensure the topic is correctly set
        }));
        
        return validCards;
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        throw new Error('Could not parse the AI response. Please try again.');
      }
    } catch (error) {
      console.error('Error generating flashcards with Gemini:', error);
      throw error;
    }
  }

  /**
   * Get suggestions for flashcard topics
   * @returns {Promise<Array>} Array of suggested topics
   */
  async getSuggestedTopics() {
    try {
      const prompt = "Generate 10 popular educational topics for flashcards. Return as a JSON array of strings.";
      
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response
      try {
        const jsonMatch = text.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        return JSON.parse(jsonString);
      } catch (parseError) {
        console.error('Error parsing topics response:', parseError);
        return [
          "Biology", "Chemistry", "Physics", "History", 
          "Mathematics", "Geography", "Literature", "Programming",
          "Foreign Languages", "Economics"
        ];
      }
    } catch (error) {
      console.error('Error fetching suggested topics:', error);
      // Return fallback topics
      return [
        "Biology", "Chemistry", "Physics", "History", 
        "Mathematics", "Geography", "Literature", "Programming",
        "Foreign Languages", "Economics"
      ];
    }
  }
}

export default new GeminiService();