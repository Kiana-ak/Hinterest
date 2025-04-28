import React, { useState } from 'react';

const Quizzes = ({ subject }) => {
  const [quizStarted, setQuizStarted] = useState(false);
  
  // Placeholder quiz data - in a real app, this would come from a database or API
  const quizQuestions = [
    {
      question: `Sample question 1 about ${subject}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 0
    },
    {
      question: `Sample question 2 about ${subject}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 1
    },
    {
      question: `Sample question 3 about ${subject}?`,
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
      correctAnswer: 2
    }
  ];
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const handleStartQuiz = () => {
    setQuizStarted(true);
    setCurrentQuestion(0);
    setScore(0);
    setQuizCompleted(false);
  };
  
  const handleOptionSelect = (optionIndex) => {
    setSelectedOption(optionIndex);
  };
  
  const handleNextQuestion = () => {
    // Check if answer is correct and update score
    if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }
    
    // Move to next question or end quiz
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
    }
  };
  
  return (
    <div style={{ padding: '1rem' }}>
      <h2>Quizzes for {subject}</h2>
      
      {!quizStarted ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p>Ready to test your knowledge of {subject}?</p>
          <button 
            onClick={handleStartQuiz}
            style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            Start Quiz
          </button>
        </div>
      ) : quizCompleted ? (
        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <h3>Quiz Completed!</h3>
          <p>Your score: {score} out of {quizQuestions.length}</p>
          <button 
            onClick={handleStartQuiz}
            style={{ padding: '0.5rem 1rem', fontSize: '1rem', marginTop: '1rem' }}
          >
            Restart Quiz
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ 
            padding: '1rem', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            <h3>Question {currentQuestion + 1} of {quizQuestions.length}</h3>
            <p>{quizQuestions[currentQuestion].question}</p>
            
            <div style={{ marginTop: '1rem' }}>
              {quizQuestions[currentQuestion].options.map((option, index) => (
                <div 
                  key={index}
                  style={{ marginBottom: '0.5rem' }}
                >
                  <label style={{ 
                    display: 'block', 
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    background: selectedOption === index ? '#e6f7ff' : 'transparent'
                  }}>
                    <input 
                      type="radio"
                      name="quizOption"
                      checked={selectedOption === index}
                      onChange={() => handleOptionSelect(index)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <button 
            onClick={handleNextQuestion}
            disabled={selectedOption === null}
            style={{ 
              padding: '0.5rem 1rem', 
              fontSize: '1rem',
              opacity: selectedOption === null ? 0.5 : 1
            }}
          >
            {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
          </button>
        </div>
      )}
    </div>
  );
};

export default Quizzes;