import React, { useState, useEffect } from 'react';
// Remove the Navbar import since it doesn't exist
// import Navbar from '../components/Navbar';

const QuizzesPage = () => {
  const [quizzes, setQuizzes] = useState({});
  const [currentQuizName, setCurrentQuizName] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [currentSubject, setCurrentSubject] = useState('');
  const [questions, setQuestions] = useState([{
    id: Date.now(),
    question: '',
    options: ['', ''],
    correctAnswers: []
  }]);
  const [selectedQuizKey, setSelectedQuizKey] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [summary, setSummary] = useState({ total: 0, correct: 0 });

  // Add this new useEffect to load last used subject
  useEffect(() => {
    const savedSubject = sessionStorage.getItem('currentQuizSubject');
    if (savedSubject) {
      setCurrentSubject(savedSubject);
    }
  }, []);

  // Update the existing useEffect to save current subject
  useEffect(() => {
    if (currentSubject) {
      sessionStorage.setItem('currentQuizSubject', currentSubject);
      const savedQuizzes = localStorage.getItem(`quizzes_${currentSubject}`);
      if (savedQuizzes) {
        setQuizzes(JSON.parse(savedQuizzes));
      } else {
        setQuizzes({});
      }
    }
  }, [currentSubject]);

  const saveQuizzes = (newQuizzes) => {
    localStorage.setItem(`quizzes_${currentSubject}`, JSON.stringify(newQuizzes));
    setQuizzes(newQuizzes);
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, {
      id: Date.now(),
      question: '',
      options: ['', ''],
      correctAnswers: []
    }]);
  };

  const handleRemoveQuestion = (questionId) => {
    if (questions.length > 1) {
      setQuestions(questions.filter(q => q.id !== questionId));
    }
  };

  const handleQuestionChange = (questionId, field, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        return { ...q, [field]: value };
      }
      return q;
    }));
  };

  const handleOptionChange = (questionId, index, value) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[index] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleAddOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length < 4) {
        return { ...q, options: [...q.options, ''] };
      }
      return q;
    }));
  };

  const handleRemoveOption = (questionId) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId && q.options.length > 2) {
        const newOptions = q.options.slice(0, -1);
        const newCorrectAnswers = q.correctAnswers.filter(index => index < newOptions.length);
        return { ...q, options: newOptions, correctAnswers: newCorrectAnswers };
      }
      return q;
    }));
  };

  const handleCorrectAnswerChange = (questionId, optionIndex, isChecked) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newCorrectAnswers = isChecked
          ? [...q.correctAnswers, optionIndex]
          : q.correctAnswers.filter(i => i !== optionIndex);
        return { ...q, correctAnswers: newCorrectAnswers };
      }
      return q;
    }));
  };

  const handleSubmitQuiz = (e) => {
    e.preventDefault();
    if (currentQuizName && questions.every(q => 
      q.question.trim() && 
      q.options.every(opt => opt.trim()) && 
      q.correctAnswers.length > 0
    )) {
      const updatedQuizzes = {
        ...quizzes,
        [currentQuizName]: quizzes[currentQuizName] 
          ? [...quizzes[currentQuizName], ...questions]
          : questions
      };

      saveQuizzes(updatedQuizzes);
      setQuestions([{
        id: Date.now(),
        question: '',
        options: ['', ''],
        correctAnswers: []
      }]);
      setCurrentQuizName('');
      setShowForm(false);
    }
  };

  const handleAnswerSelect = (questionIndex, optionIndex) => {
    const newSelectedAnswers = [...selectedAnswers];
    newSelectedAnswers[questionIndex] = optionIndex;
    setSelectedAnswers(newSelectedAnswers);
  };

  const checkAnswers = () => {
    if (!selectedQuizKey || !quizzes[selectedQuizKey]) return;
    
    let correct = 0;
    const total = quizzes[selectedQuizKey].length;
    
    quizzes[selectedQuizKey].forEach((question, index) => {
      if (question.correctAnswers.includes(selectedAnswers[index])) {
        correct++;
      }
    });

    setSummary({ total, correct });
    setQuizComplete(true);
    setShowResults(true);
  };

  return (
    <div>
      {/* Remove the Navbar component */}
      <div style={{ padding: '2rem' }}>
        <h2>Quizzes</h2>
        
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

        {/* Display Available Subjects */}
        <div style={{ marginBottom: '20px' }}>
          <h3>Available Subjects</h3>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {Object.keys(localStorage)
              .filter(key => key.startsWith('quizzes_'))
              .map(key => {
                const subject = key.replace('quizzes_', '');
                return (
                  <button
                    key={subject}
                    onClick={() => setCurrentSubject(subject)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: currentSubject === subject ? '#007bff' : '#6c757d',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    {subject}
                  </button>
                );
              })}
          </div>
        </div>

        {/* Create Quiz Button */}
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            marginBottom: '20px'
          }}
        >
          {showForm ? 'Cancel' : 'Create Quiz'}
        </button>

        {showForm && (
          <form onSubmit={handleSubmitQuiz} style={{ marginBottom: '20px' }}>
            <input
              type="text"
              value={currentQuizName}
              onChange={(e) => setCurrentQuizName(e.target.value)}
              placeholder="Quiz name"
              style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
            />
            
            {questions.map((q, qIndex) => (
              <div key={q.id} style={{ border: '1px solid #ddd', padding: '15px', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <h4 style={{ margin: 0 }}>Question {qIndex + 1}</h4>
                  {questions.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveQuestion(q.id)}
                      style={{ color: 'red', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                      Remove Question
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  value={q.question}
                  onChange={(e) => handleQuestionChange(q.id, 'question', e.target.value)}
                  placeholder="Question"
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                
                {q.options.map((option, index) => (
                  <div key={index} style={{ marginBottom: '10px' }}>
                    <input
                      type="text"
                      value={option}
                      onChange={(e) => handleOptionChange(q.id, index, e.target.value)}
                      placeholder={`Option ${index + 1}`}
                      style={{ width: '80%', padding: '8px' }}
                    />
                    <input
                      type="checkbox"
                      checked={q.correctAnswers.includes(index)}
                      onChange={(e) => handleCorrectAnswerChange(q.id, index, e.target.checked)}
                      style={{ marginLeft: '10px' }}
                    />
                    <label style={{ marginLeft: '5px' }}>Correct</label>
                  </div>
                ))}
                
                <div style={{ marginBottom: '10px' }}>
                  <button type="button" onClick={() => handleAddOption(q.id)} style={{ marginRight: '10px' }}>
                    Add Option
                  </button>
                  <button type="button" onClick={() => handleRemoveOption(q.id)}>
                    Remove Option
                  </button>
                </div>
              </div>
            ))}
            
            <button 
              type="button" 
              onClick={handleAddQuestion}
              style={{ marginBottom: '20px', padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Add Another Question
            </button>
            
            <button 
              type="submit"
              style={{ display: 'block', width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Save Quiz
            </button>
          </form>
        )}

        {/* Display Quizzes */}
        <div style={{ marginTop: '20px' }}>
          {Object.keys(quizzes).map(quizName => (
            <div key={quizName} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd' }}>
              <h3>{quizName}</h3>
              <button onClick={() => setSelectedQuizKey(quizName)}>Take Quiz</button>
            </div>
          ))}
        </div>

        {/* Quiz Taking Interface */}
        {selectedQuizKey && quizzes[selectedQuizKey] && !quizComplete && (
          <div style={{ marginTop: '20px' }}>
            <h3>Taking Quiz: {selectedQuizKey}</h3>
            {quizzes[selectedQuizKey].map((quiz, questionIndex) => (
              <div key={quiz.id} style={{ marginBottom: '20px' }}>
                <p>{quiz.question}</p>
                {quiz.options.map((option, optionIndex) => (
                  <div key={optionIndex}>
                    <input
                      type="radio"
                      name={`question-${questionIndex}`}
                      checked={selectedAnswers[questionIndex] === optionIndex}
                      onChange={() => handleAnswerSelect(questionIndex, optionIndex)}
                    />
                    <label style={{ marginLeft: '10px' }}>{option}</label>
                  </div>
                ))}
              </div>
            ))}
            <button onClick={checkAnswers}>Submit Answers</button>
          </div>
        )}

        {/* Results Display */}
        {showResults && (
          <div style={{ marginTop: '20px', padding: '15px', border: '1px solid #ddd' }}>
            <h3>Quiz Results</h3>
            <p>Score: {summary.correct} out of {summary.total}</p>
            <button onClick={() => {
              setSelectedQuizKey('');
              setShowResults(false);
              setQuizComplete(false);
              setSelectedAnswers([]);
            }}>Take Another Quiz</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizzesPage;