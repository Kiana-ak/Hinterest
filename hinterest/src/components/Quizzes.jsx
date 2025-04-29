import React, { useState, useEffect } from 'react';

const Quizzes = ({ subject }) => {
  const [quizzes, setQuizzes] = useState([]);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [newQuizTitle, setNewQuizTitle] = useState('');
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [newQuestions, setNewQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // Load quizzes from localStorage on component mount
  useEffect(() => {
    const savedQuizzes = localStorage.getItem(`quizzes-${subject}`);
    if (savedQuizzes) {
      setQuizzes(JSON.parse(savedQuizzes));
    }
  }, [subject]);

  // Save quizzes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(`quizzes-${subject}`, JSON.stringify(quizzes));
  }, [quizzes, subject]);

  const startQuiz = (index) => {
    setCurrentQuiz(quizzes[index]);
    setCurrentQuestion(0);
    setScore(0);
    setShowResults(false);
  };

  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentQuiz.questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < currentQuiz.questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowResults(true);
    }
  };

  const addQuestion = () => {
    setNewQuestions([
      ...newQuestions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const updateQuestion = (index, field, value) => {
    const updatedQuestions = [...newQuestions];
    if (field === 'question') {
      updatedQuestions[index].question = value;
    } else if (field === 'correctAnswer') {
      updatedQuestions[index].correctAnswer = parseInt(value);
    } else {
      // Update an option
      const optionIndex = parseInt(field);
      updatedQuestions[index].options[optionIndex] = value;
    }
    setNewQuestions(updatedQuestions);
  };

  const saveQuiz = () => {
    if (newQuizTitle.trim() === '') {
      alert('Please provide a title for your quiz');
      return;
    }

    // Validate all questions
    for (const q of newQuestions) {
      if (q.question.trim() === '') {
        alert('All questions must have content');
        return;
      }
      for (const option of q.options) {
        if (option.trim() === '') {
          alert('All options must have content');
          return;
        }
      }
    }

    const newQuiz = {
      title: newQuizTitle,
      questions: newQuestions
    };

    setQuizzes([...quizzes, newQuiz]);
    setNewQuizTitle('');
    setNewQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
    setShowQuizCreator(false);
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Quizzes for {subject}</h2>

      {!currentQuiz && !showQuizCreator && (
        <>
          <button 
            onClick={() => setShowQuizCreator(true)}
            style={{ padding: '0.5rem 1rem', marginBottom: '1rem' }}
          >
            Create New Quiz
          </button>

          {quizzes.length === 0 ? (
            <p>No quizzes available. Create your first quiz!</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
              {quizzes.map((quiz, index) => (
                <div 
                  key={index} 
                  style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '1rem',
                    background: '#f9f9f9'
                  }}
                >
                  <h3>{quiz.title}</h3>
                  <p>{quiz.questions.length} questions</p>
                  <button 
                    onClick={() => startQuiz(index)}
                    style={{ padding: '0.5rem 1rem', marginTop: '0.5rem' }}
                  >
                    Start Quiz
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {showQuizCreator && (
        <div style={{ marginTop: '1rem' }}>
          <h3>Create New Quiz</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Quiz Title:</label>
            <input
              type="text"
              value={newQuizTitle}
              onChange={(e) => setNewQuizTitle(e.target.value)}
              style={{ width: '100%', padding: '0.5rem' }}
            />
          </div>

          {newQuestions.map((q, qIndex) => (
            <div key={qIndex} style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ddd', borderRadius: '8px' }}>
              <h4>Question {qIndex + 1}</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>Question:</label>
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem' }}
                />
              </div>

              {q.options.map((option, oIndex) => (
                <div key={oIndex} style={{ marginBottom: '0.5rem' }}>
                  <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctAnswer === oIndex}
                      onChange={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Option {oIndex + 1}:
                  </label>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => updateQuestion(qIndex, oIndex.toString(), e.target.value)}
                    style={{ width: '100%', padding: '0.5rem' }}
                  />
                </div>
              ))}
            </div>
          ))}

          <div style={{ marginBottom: '1rem' }}>
            <button 
              onClick={addQuestion}
              style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}
            >
              Add Question
            </button>
            <button 
              onClick={saveQuiz}
              style={{ padding: '0.5rem 1rem', marginRight: '0.5rem' }}
            >
              Save Quiz
            </button>
            <button 
              onClick={() => {
                setShowQuizCreator(false);
                setNewQuizTitle('');
                setNewQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
              }}
              style={{ padding: '0.5rem 1rem' }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {currentQuiz && !showResults && (
        <div style={{ marginTop: '1rem' }}>
          <h3>{currentQuiz.title}</h3>
          <div style={{ marginBottom: '1rem' }}>
            <p>Question {currentQuestion + 1} of {currentQuiz.questions.length}</p>
            <h4>{currentQuiz.questions[currentQuestion].question}</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
              {currentQuiz.questions[currentQuestion].options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index)}
                  style={{ padding: '0.5rem 1rem', textAlign: 'left' }}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {showResults && (
        <div style={{ marginTop: '1rem', textAlign: 'center' }}>
          <h3>Quiz Results</h3>
          <p>You scored {score} out of {currentQuiz.questions.length}</p>
          <p>({Math.round((score / currentQuiz.questions.length) * 100)}%)</p>
          <button 
            onClick={() => setCurrentQuiz(null)}
            style={{ padding: '0.5rem 1rem', marginTop: '1rem' }}
          >
            Back to Quizzes
          </button>
        </div>
      )}
    </div>
  );
};

export default Quizzes;