// Flashcard System JavaScript
// This file implements a flashcard system that allows users to create and interact with flashcards

// Flashcard class representing a single flashcard
class Flashcard {
    constructor(term, definition) {
      this.term = term;
      this.definition = definition;
    }
  }
  
  // FlashcardSystem class to manage the collection of flashcards and UI
  class FlashcardSystem {
    constructor() {
      this.flashcards = [];
      this.currentIndex = 0;
      this.isFlipped = false;
      
      // DOM elements
      this.cardContainer = null;
      this.flashcardElement = null;
      this.frontContent = null;
      this.backContent = null;
      this.currentCardElement = null;
      this.totalCardsElement = null;
      this.termInput = null;
      this.definitionInput = null;
      
      // Navigation buttons
      this.prevBtn = null;
      this.nextBtn = null;
      this.flipBtn = null;
      this.shuffleBtn = null;
      this.resetBtn = null;
      
      // Initialize the system
      this.init();
    }
    
    // Initialize the flashcard system
    init() {
      // Create the UI elements
      this.createUI();
      
      // Load cards from localStorage or add example cards
      this.loadCards();
      
      // Set up event listeners
      this.setupEventListeners();
      
      // Update button states
      this.updateButtonState();
    }
    
    // Create the UI elements for the flashcard system
    createUI() {
      // Create container
      this.cardContainer = document.createElement('div');
      this.cardContainer.className = 'flashcard-container';
      
      // Create heading
      const heading = document.createElement('h1');
      heading.textContent = 'Flashcard System';
      this.cardContainer.appendChild(heading);
      
      // Create progress counter
      const progressDiv = document.createElement('div');
      progressDiv.className = 'progress';
      progressDiv.innerHTML = 'Card <span id="current-card">0</span> of <span id="total-cards">0</span>';
      this.cardContainer.appendChild(progressDiv);
      
      // Create flashcard element
      const flashcardDiv = document.createElement('div');
      flashcardDiv.className = 'flashcard';
      
      this.flashcardElement = document.createElement('div');
      this.flashcardElement.className = 'card';
      
      // Create front face
      this.frontContent = document.createElement('div');
      this.frontContent.className = 'card-face front';
      this.frontContent.innerHTML = '<div class="no-cards">Add flashcards to get started!</div>';
      
      // Create back face
      this.backContent = document.createElement('div');
      this.backContent.className = 'card-face back';
      this.backContent.innerHTML = '<div class="no-cards">Add flashcards to get started!</div>';
      
      // Assemble flashcard
      this.flashcardElement.appendChild(this.frontContent);
      this.flashcardElement.appendChild(this.backContent);
      flashcardDiv.appendChild(this.flashcardElement);
      this.cardContainer.appendChild(flashcardDiv);
      
      // Create controls
      const controlsDiv = document.createElement('div');
      controlsDiv.className = 'controls';
      
      this.prevBtn = document.createElement('button');
      this.prevBtn.textContent = 'Previous';
      this.prevBtn.id = 'prev-btn';
      
      this.flipBtn = document.createElement('button');
      this.flipBtn.textContent = 'Flip';
      this.flipBtn.id = 'flip-btn';
      
      this.nextBtn = document.createElement('button');
      this.nextBtn.textContent = 'Next';
      this.nextBtn.id = 'next-btn';
      
      controlsDiv.appendChild(this.prevBtn);
      controlsDiv.appendChild(this.flipBtn);
      controlsDiv.appendChild(this.nextBtn);
      this.cardContainer.appendChild(controlsDiv);
      
      // Create input area
      const inputDiv = document.createElement('div');
      inputDiv.className = 'card-input';
      
      this.termInput = document.createElement('input');
      this.termInput.type = 'text';
      this.termInput.placeholder = 'Enter a term';
      
      this.definitionInput = document.createElement('input');
      this.definitionInput.type = 'text';
      this.definitionInput.placeholder = 'Enter the definition';
      
      const addBtn = document.createElement('button');
      addBtn.textContent = 'Add Flashcard';
      addBtn.id = 'add-btn';
      
      inputDiv.appendChild(this.termInput);
      inputDiv.appendChild(this.definitionInput);
      inputDiv.appendChild(addBtn);
      this.cardContainer.appendChild(inputDiv);
      
      // Create management controls
      const managementDiv = document.createElement('div');
      managementDiv.className = 'controls management';
      
      this.shuffleBtn = document.createElement('button');
      this.shuffleBtn.textContent = 'Shuffle Cards';
      this.shuffleBtn.id = 'shuffle-btn';
      
      this.resetBtn = document.createElement('button');
      this.resetBtn.textContent = 'Reset All';
      this.resetBtn.id = 'reset-btn';
      
      managementDiv.appendChild(this.shuffleBtn);
      managementDiv.appendChild(this.resetBtn);
      this.cardContainer.appendChild(managementDiv);
      
      // Add styles
      this.addStyles();
      
      // Cache references to counter elements
      this.currentCardElement = document.getElementById('current-card');
      this.totalCardsElement = document.getElementById('total-cards');
      
      // Append the entire container to the body
      document.body.appendChild(this.cardContainer);
    }
    
    // Add CSS styles
    addStyles() {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        .flashcard-container {
          font-family: Arial, sans-serif;
          max-width: 600px;
          margin: 20px auto;
          padding: 20px;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
          border-radius: 10px;
          background-color: #fff;
        }
        
        .flashcard {
          perspective: 1000px;
          height: 300px;
          margin-bottom: 20px;
          cursor: pointer;
        }
        
        .card {
          position: relative;
          width: 100%;
          height: 100%;
          transform-style: preserve-3d;
          transition: transform 0.5s;
        }
        
        .card.flipped {
          transform: rotateY(180deg);
        }
        
        .card-face {
          position: absolute;
          width: 100%;
          height: 100%;
          backface-visibility: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          box-sizing: border-box;
          font-size: 24px;
          text-align: center;
        }
        
        .front {
          background-color: #ffffff;
          color: #333;
        }
        
        .back {
          background-color: #4b6cb7;
          color: white;
          transform: rotateY(180deg);
        }
        
        .controls {
          display: flex;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        
        .management {
          margin-top: 20px;
        }
        
        button {
          padding: 10px 20px;
          background-color: #4b6cb7;
          color: white;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 16px;
        }
        
        button:hover {
          background-color: #3a5b9f;
        }
        
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .progress {
          text-align: center;
          margin-bottom: 10px;
          font-size: 18px;
        }
        
        .card-input {
          margin-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        
        .card-input input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ddd;
          border-radius: 5px;
          font-size: 16px;
          box-sizing: border-box;
        }
        
        .no-cards {
          font-style: italic;
          color: #666;
        }
      `;
      document.head.appendChild(styleElement);
    }
    
    // Set up event listeners
    setupEventListeners() {
      // Card flip on click
      this.flashcardElement.addEventListener('click', () => this.flipCard());
      
      // Button actions
      this.prevBtn.addEventListener('click', () => this.prevCard());
      this.nextBtn.addEventListener('click', () => this.nextCard());
      this.flipBtn.addEventListener('click', () => this.flipCard());
      document.getElementById('add-btn').addEventListener('click', () => this.addCard());
      this.shuffleBtn.addEventListener('click', () => this.shuffleCards());
      this.resetBtn.addEventListener('click', () => this.resetCards());
      
      // Keyboard navigation
      document.addEventListener('keydown', (event) => {
        if (this.flashcards.length === 0) return;
        
        switch (event.key) {
          case 'ArrowLeft':
            this.prevCard();
            break;
          case 'ArrowRight':
            this.nextCard();
            break;
          case ' ':  // Spacebar
          case 'Enter':
            this.flipCard();
            event.preventDefault();  // Prevent scrolling with spacebar
            break;
        }
      });
    }
    
    // Load cards from localStorage
    loadCards() {
      const savedCards = localStorage.getItem('flashcards');
      if (savedCards) {
        try {
          const parsedCards = JSON.parse(savedCards);
          this.flashcards = parsedCards.map(card => new Flashcard(card.term, card.definition));
          this.updateCardCount();
          
          if (this.flashcards.length > 0) {
            this.showCurrentCard();
          } else {
            this.showNoCardsState();
          }
        } catch (e) {
          console.error("Error loading saved cards:", e);
          this.flashcards = [];
          this.showNoCardsState();
        }
      } else {
        // Add example cards if no saved cards
        this.addExampleCards();
      }
    }
    
    // Add example cards
    addExampleCards() {
      this.flashcards = [
        new Flashcard("JavaScript", "A programming language that enables interactive web pages"),
        new Flashcard("HTML", "HyperText Markup Language, the standard markup language for web pages"),
        new Flashcard("CSS", "Cascading Style Sheets, used for describing the presentation of a document")
      ];
      this.saveCards();
      this.updateCardCount();
      this.showCurrentCard();
    }
    
    // Save cards to localStorage
    saveCards() {
      try {
        localStorage.setItem('flashcards', JSON.stringify(this.flashcards));
      } catch (e) {
        console.error("Error saving cards:", e);
      }
    }
    
    // Add a new flashcard
    addCard() {
      const term = this.termInput.value.trim();
      const definition = this.definitionInput.value.trim();
      
      if (term && definition) {
        this.flashcards.push(new Flashcard(term, definition));
        this.termInput.value = '';
        this.definitionInput.value = '';
        
        this.saveCards();
        this.updateCardCount();
        
        // If this is the first card, show it
        if (this.flashcards.length === 1) {
          this.currentIndex = 0;
          this.showCurrentCard();
        }
        
        this.updateButtonState();
        alert('Flashcard added successfully!');
      } else {
        alert('Please enter both a term and a definition!');
      }
    }
    
    // Show a message when there are no cards
    showNoCardsState() {
      this.frontContent.innerHTML = '<div class="no-cards">Add flashcards to get started!</div>';
      this.backContent.innerHTML = '<div class="no-cards">Add flashcards to get started!</div>';
      this.currentCardElement.textContent = "0";
      this.flashcardElement.classList.remove('flipped');
      this.isFlipped = false;
    }
    
    // Display the current card
    showCurrentCard() {
      if (this.flashcards.length === 0) {
        this.showNoCardsState();
        return;
      }
      
      const card = this.flashcards[this.currentIndex];
      this.frontContent.textContent = card.term;
      this.backContent.textContent = card.definition;
      this.currentCardElement.textContent = this.currentIndex + 1;
      
      // Reset the card to show the term side
      this.flashcardElement.classList.remove('flipped');
      this.isFlipped = false;
    }
    
    // Flip the card
    flipCard() {
      if (this.flashcards.length === 0) return;
      
      this.flashcardElement.classList.toggle('flipped');
      this.isFlipped = !this.isFlipped;
    }
    
    // Navigate to the next card
    nextCard() {
      if (this.flashcards.length <= 1) return;
      
      this.currentIndex = (this.currentIndex + 1) % this.flashcards.length;
      this.showCurrentCard();
    }
    
    // Navigate to the previous card
    prevCard() {
      if (this.flashcards.length <= 1) return;
      
      this.currentIndex = (this.currentIndex - 1 + this.flashcards.length) % this.flashcards.length;
      this.showCurrentCard();
    }
    
    // Shuffle the flashcards
    shuffleCards() {
      if (this.flashcards.length <= 1) {
        alert('Need at least two cards to shuffle!');
        return;
      }
      
      for (let i = this.flashcards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [this.flashcards[i], this.flashcards[j]] = [this.flashcards[j], this.flashcards[i]];
      }
      
      this.currentIndex = 0;
      this.saveCards();
      this.showCurrentCard();
      alert('Cards shuffled!');
    }
    
    // Reset all flashcards
    resetCards() {
      if (confirm('Are you sure you want to delete all flashcards?')) {
        this.flashcards = [];
        this.currentIndex = 0;
        this.saveCards();
        this.updateCardCount();
        this.showNoCardsState();
        this.updateButtonState();
      }
    }
    
    // Update the card count display
    updateCardCount() {
      this.totalCardsElement.textContent = this.flashcards.length;
      this.currentCardElement.textContent = this.flashcards.length > 0 ? this.currentIndex + 1 : 0;
    }
    
    // Update button states based on card availability
    updateButtonState() {
      const hasCards = this.flashcards.length > 0;
      const hasMultipleCards = this.flashcards.length > 1;
      
      this.prevBtn.disabled = !hasMultipleCards;
      this.nextBtn.disabled = !hasMultipleCards;
      this.flipBtn.disabled = !hasCards;
      this.shuffleBtn.disabled = !hasMultipleCards;
      this.resetBtn.disabled = !hasCards;
    }
  }
  
  // Initialize the flashcard system when the DOM is loaded
  document.addEventListener('DOMContentLoaded', () => {
    const flashcardSystem = new FlashcardSystem();
  });