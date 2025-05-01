import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState({});  // Changed to object to store multiple quizzes
  const [currentQuizName, setCurrentQuizName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [correctAnswers, setCorrectAnswers] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [summary, setSummary] = useState({
    total: 0,
    correct: 0
  });
  const [selectedQuizKey, setSelectedQuizKey] = useState('');

  // Load quizzes from localStorage when component mounts or subject changes
  useEffect(() => {
    if (currentSubject) {
      const savedQuizzes = localStorage.getItem(`quizzes_${currentSubject}`);
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      } else {
        setQuizzes({});
      }
    }
  }, [currentSubject]);

  // Save quizzes to localStorage
  const saveQuizzes = (newQuizzes) => {
    localStorage.setItem(`quizzes_${currentSubject}`, JSON.stringify(newQuizzes));
    setQuizzes(newQuizzes);
  };

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = () => {
    if (options.length > 2) {
      setOptions(options.slice(0, -1));
      setCorrectAnswers(correctAnswers.filter(index => index < options.length - 1));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const toggleCorrectAnswer = (index) => {
    setCorrectAnswers(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      } else {
        return [...prev, index];
      }
    });
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (currentQuizName && question.trim() && options.every(opt => opt.trim()) && correctAnswers.length > 0) {
      const newQuiz = {
        id: Date.now(),
        question,
        options,
        correctAnswers
      };

      const updatedQuizzes = {
        ...quizzes,
        [currentQuizName]: quizzes[currentQuizName] 
          ? [...quizzes[currentQuizName], newQuiz]
          : [newQuiz]
      };

      saveQuizzes(updatedQuizzes);
      // Reset only the question form, keep the quiz name
      setQuestion('');
      setOptions(['', '']);
      setCorrectAnswers([]);
      // Don't clear currentQuizName here
      setShowForm(false);
    }
  };

  const handleDeleteQuiz = (quizId) => {
    if (selectedQuizKey) {
      const updatedQuizList = quizzes[selectedQuizKey].filter(quiz => quiz.id !== quizId);
      const updatedQuizzes = {
        ...quizzes,
        [selectedQuizKey]: updatedQuizList
      };
      
      if (updatedQuizList.length === 0) {
        delete updatedQuizzes[selectedQuizKey];
      }
      
      saveQuizzes(updatedQuizzes);
      if (updatedQuizList.length === 0) {
        setSelectedQuizKey('');
      }
    }
  };

  const handleAnswerSelect = (optionIndex) => {
    if (!showResults) {
      const newSelectedAnswers = selectedAnswers.includes(optionIndex)
        ? selectedAnswers.filter(i => i !== optionIndex)
        : [...selectedAnswers, optionIndex];
      setSelectedAnswers(newSelectedAnswers);
    }
  };

  const checkAnswers = () => {
    const currentQuizItem = quizzes[selectedQuizKey][currentQuiz];
    const isCorrect = selectedAnswers.length === currentQuizItem.correctAnswers.length &&
      selectedAnswers.every(answer => currentQuizItem.correctAnswers.includes(answer));
    
    if (isCorrect) {
      setScore(score + 1);
    }
    setShowResults(true);

    // Check if this is the last question
    if (currentQuiz === quizzes[selectedQuizKey].length - 1) {
      setQuizComplete(true);
      setSummary({
        total: quizzes[selectedQuizKey].length,
        correct: score + (isCorrect ? 1 : 0)
      });
    }
  };

  const nextQuiz = () => {
    if (currentQuiz < quizzes[selectedQuizKey].length - 1) {
      setCurrentQuiz(currentQuiz + 1);
      setSelectedAnswers([]);
      setShowResults(false);
    }
  };

  const resetQuiz = () => {
    setCurrentQuiz(0);
    setScore(0);
    setShowResults(false);
    setQuizComplete(false);
    setSelectedAnswers([]);
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Quiz</h2>

        {/* Subject Selection */}
        <div style={{ marginBottom: '20px' }}>
          <input
            type="text"
            value={currentSubject}
            onChange={(e) => setCurrentSubject(e.target.value)}
            placeholder="Enter subject name"
            style={{ padding: '8px', marginRight: '10px' }}
          />
        </div>

        {/* Quiz Selection */}
        {currentSubject && (
          <div style={{ marginBottom: '20px' }}>
            <select
              value={selectedQuizKey}
              onChange={(e) => {
                setSelectedQuizKey(e.target.value);
                setCurrentQuiz(0);
                setScore(0);
                setShowResults(false);
                setQuizComplete(false);
                setSelectedAnswers([]);
              }}
              style={{ padding: '8px', marginRight: '10px' }}
            >
              <option value="">Select a Quiz</option>
              {Object.keys(quizzes).map(quizName => (
                <option key={quizName} value={quizName}>
                  {quizName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Control Buttons */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              borderRadius: '4px'
            }}
          >
            {showForm ? 'Cancel' : 'Add Quiz'}
          </button>
        </div>

        {/* Quiz Form */}
        {showForm && (
          <form onSubmit={handleSubmitQuiz} style={{ marginBottom: '20px' }}>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={currentQuizName}
                onChange={(e) => setCurrentQuizName(e.target.value)}
                placeholder="Enter quiz name"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            <div style={{ marginBottom: '10px' }}>
              <input
                type="text"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Enter question"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginBottom: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ddd'
                }}
              />
            </div>
            
            {options.map((option, index) => (
              <div key={index} style={{ marginBottom: '10px', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  style={{
                    flex: 1,
                    padding: '8px',
                    marginRight: '10px',
                    borderRadius: '4px',
                    border: '1px solid #ddd'
                  }}
                />
                <input
                  type="checkbox"
                  checked={correctAnswers.includes(index)}
                  onChange={() => toggleCorrectAnswer(index)}
                  style={{ marginRight: '5px' }}
                />
                <label>Correct</label>
              </div>
            ))}

            <div style={{ marginBottom: '10px', display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={handleAddOption}
                disabled={options.length >= 4}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: options.length >= 4 ? 'not-allowed' : 'pointer',
                  opacity: options.length >= 4 ? 0.6 : 1
                }}
              >
                Add Option
              </button>
              <button
                type="button"
                onClick={handleRemoveOption}
                disabled={options.length <= 2}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: options.length <= 2 ? 'not-allowed' : 'pointer',
                  opacity: options.length <= 2 ? 0.6 : 1
                }}
              >
                Remove Option
              </button>
            </div>

            <button
              type="submit"
              style={{
                padding: '8px 16px',
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Save Quiz
            </button>
          </form>
        )}

        {/* Quiz Display */}
        {!showForm && selectedQuizKey && quizzes[selectedQuizKey]?.length > 0 && (
          <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            {/* Quiz Management */}
            {!showResults && (
              <div style={{ marginBottom: '20px' }}>
                <button
                  onClick={() => handleDeleteQuiz(quizzes[selectedQuizKey][currentQuiz].id)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    marginRight: '10px'
                  }}
                >
                  Delete Current Question
                </button>
                <button
                  onClick={resetQuiz}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Reset Quiz
                </button>
              </div>
            )}

            <div style={{ 
              border: '2px solid black',
              padding: '20px',
              marginBottom: '20px',
              backgroundColor: 'white'
            }}>
              <h3 style={{ marginBottom: '15px' }}>{quizzes[selectedQuizKey][currentQuiz].question}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {quizzes[selectedQuizKey][currentQuiz].options.map((option, index) => (
                  <div
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    style={{
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      backgroundColor: showResults
                        ? quizzes[selectedQuizKey][currentQuiz].correctAnswers.includes(index)
                          ? '#d4edda'
                          : selectedAnswers.includes(index)
                            ? '#f8d7da'
                            : 'white'
                        : selectedAnswers.includes(index)
                          ? '#e2e6ea'
                          : 'white'
                    }}
                  >
                    {option}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span>Question {currentQuiz + 1} of {quizzes[selectedQuizKey].length}</span>
              {!showResults ? (
                <button
                  onClick={checkAnswers}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                >
                  Check Answer
                </button>
              ) : (
                <button
                  onClick={nextQuiz}
                  disabled={currentQuiz === quizzes[selectedQuizKey].length - 1}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: currentQuiz === quizzes[selectedQuizKey].length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentQuiz === quizzes[selectedQuizKey].length - 1 ? 0.6 : 1
                  }}
                >
                  Next Question
                </button>
              )}
            </div>

            {/* Quiz Summary */}
            {(showResults || quizComplete) && (
              <div style={{ 
                marginTop: '20px', 
                padding: '20px', 
                backgroundColor: '#f8f9fa',
                border: '2px solid black',
                borderRadius: '4px'
              }}>
                <h3 style={{ marginBottom: '10px' }}>Quiz Progress</h3>
                <p>Current Score: {score} / {currentQuiz + 1}</p>
                {quizComplete && (
                  <>
                    <h4 style={{ marginTop: '15px', marginBottom: '10px' }}>Final Results</h4>
                    <p>You got {summary.correct} out of {summary.total} questions correct!</p>
                    <p>Final Score: {Math.round((summary.correct / summary.total) * 100)}%</p>
                    <button
                      onClick={resetQuiz}
                      style={{
                        marginTop: '15px',
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Try Again
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;