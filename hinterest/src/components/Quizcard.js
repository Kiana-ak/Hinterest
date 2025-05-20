import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGeminiResponse } from '../services/GeminiService';

function Quizcard({ subject }) {
  const navigate = useNavigate(); // Initialize navigate function
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQuizForm, setShowQuizForm] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [takingQuiz, setTakingQuiz] = useState(false);
  const [quizResults, setQuizResults] = useState(null);
  const [subjectName, setSubjectName] = useState('');
  
  // Function to navigate to chatbot
  const navigateToChatbot = () => {
    if (typeof subject === 'object' && subject._id) {
      navigate(`/chatbot/${subject._id}`);
    } else if (typeof subject === 'string') {
      navigate(`/chatbot/${subject}`);
    }
  };
  
  // Form states
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ 
    text: '', 
    options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
    explanation: '' 
  }]);
  
  // Quiz taking states
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  // Set subject name when component mounts or subject changes
  useEffect(() => {
    if (subject) {
      // If subject is an object with a name property, use that
      if (typeof subject === 'object' && subject.name) {
        setSubjectName(subject.name);
      } 
      // Otherwise use the subject directly (likely an ID string)
      else {
        // Try to fetch the subject name if we only have the ID
        const fetchSubjectName = async () => {
          try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:5000/api/subjects/${subject}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            });
            
            if (response.ok) {
              const data = await response.json();
              setSubjectName(data.name);
            } else {
              setSubjectName(subject); // Fallback to using the ID
            }
          } catch (err) {
            console.error('Error fetching subject name:', err);
            setSubjectName(subject); // Fallback to using the ID
          }
        };
        
        fetchSubjectName();
      }
    }
  }, [subject]);

  // Fetch quizzes for the selected subject
  useEffect(() => {
    const fetchQuizzes = async () => {
      if (!subject) return;
      
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`http://localhost:5000/api/quizzes/subject/${subject}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch quizzes');
        }

        const data = await response.json();
        setQuizzes(data);
      } catch (err) {
        console.error('Error fetching quizzes:', err);
        setError('Failed to load quizzes. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, [subject]);

  // Add a new question to the form
  const addQuestion = () => {
    setQuestions([
      ...questions, 
      { 
        text: '', 
        options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
        explanation: '' 
      }
    ]);
  };

  // Add a new option to a question
  const addOption = (questionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options.push({ text: '', isCorrect: false });
    setQuestions(updatedQuestions);
  };

  // Handle question text change
  const handleQuestionTextChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  // Handle option text change
  const handleOptionTextChange = (questionIndex, optionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].text = value;
    setQuestions(updatedQuestions);
  };

  // Handle option correctness toggle
  const handleOptionCorrectToggle = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex].isCorrect = 
      !updatedQuestions[questionIndex].options[optionIndex].isCorrect;
    setQuestions(updatedQuestions);
  };

  // Handle explanation change
  const handleExplanationChange = (questionIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].explanation = value;
    setQuestions(updatedQuestions);
  };

  // Remove a question
  const removeQuestion = (questionIndex) => {
    if (questions.length <= 1) {
      setError("You must have at least one question");
      return;
    }
    const updatedQuestions = questions.filter((_, index) => index !== questionIndex);
    setQuestions(updatedQuestions);
  };

  // Remove an option
  const removeOption = (questionIndex, optionIndex) => {
    const updatedQuestions = [...questions];
    if (updatedQuestions[questionIndex].options.length <= 2) {
      setError("Each question must have at least two options");
      return;
    }
    updatedQuestions[questionIndex].options = 
      updatedQuestions[questionIndex].options.filter((_, index) => index !== optionIndex);
    setQuestions(updatedQuestions);
  };

  // Reset the form
  const resetForm = () => {
    setTitle('');
    setDescription('');
    setQuestions([{ 
      text: '', 
      options: [{ text: '', isCorrect: false }, { text: '', isCorrect: false }],
      explanation: '' 
    }]);
    setCurrentQuiz(null);
  };

  // Handle form submission for creating/updating quizzes
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!title.trim()) {
      setError('Quiz title is required');
      return;
    }

    // Validate questions
    for (let i = 0; i < questions.length; i++) {
      if (!questions[i].text.trim()) {
        setError(`Question ${i + 1} text is required`);
        return;
      }
      
      // Check if at least one option is marked as correct
      const hasCorrectOption = questions[i].options.some(option => option.isCorrect);
      if (!hasCorrectOption) {
        setError(`Question ${i + 1} must have at least one correct option`);
        return;
      }
      
      // Validate options
      for (let j = 0; j < questions[i].options.length; j++) {
        if (!questions[i].options[j].text.trim()) {
          setError(`Option ${j + 1} for Question ${i + 1} is required`);
          return;
        }
      }
    }

    try {
      const token = localStorage.getItem('token');
      const url = currentQuiz 
        ? `http://localhost:5000/api/quizzes/${currentQuiz._id}`
        : 'http://localhost:5000/api/quizzes';
      
      const method = currentQuiz ? 'PUT' : 'POST';
      
      const body = currentQuiz 
        ? JSON.stringify({ title, description, questions })
        : JSON.stringify({ title, description, questions, subjectId: subject });

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body
      });

      if (!response.ok) {
        throw new Error(currentQuiz ? 'Failed to update quiz' : 'Failed to create quiz');
      }

      const data = await response.json();
      
      if (currentQuiz) {
        // Update the quiz in the list
        setQuizzes(quizzes.map(quiz => quiz._id === currentQuiz._id ? data : quiz));
      } else {
        // Add the new quiz to the list
        setQuizzes([data, ...quizzes]);
      }
      
      // Reset form and hide it
      resetForm();
      setShowQuizForm(false);
      setError('');
    } catch (err) {
      console.error('Error saving quiz:', err);
      setError(err.message);
    }
  };

  // Edit a quiz
  const handleEdit = (quiz) => {
    setTitle(quiz.title);
    setDescription(quiz.description || '');
    setQuestions(quiz.questions);
    setCurrentQuiz(quiz);
    setShowQuizForm(true);
    setTakingQuiz(false);
    setQuizResults(null);
  };

  // Delete a quiz
  const handleDelete = async (quizId) => {
    if (!window.confirm('Are you sure you want to delete this quiz?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/quizzes/${quizId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete quiz');
      }

      // Remove the deleted quiz from the list
      setQuizzes(quizzes.filter(quiz => quiz._id !== quizId));
    } catch (err) {
      console.error('Error deleting quiz:', err);
      setError(err.message);
    }
  };

  // Start taking a quiz
  const startQuiz = (quiz) => {
    setCurrentQuiz(quiz);
    setTakingQuiz(true);
    setQuizResults(null);
    
    // Initialize user answers
    const initialAnswers = quiz.questions.map(question => ({
      questionId: question._id,
      selectedOptions: []
    }));
    
    setUserAnswers(initialAnswers);
  };


  // Handle option selection during quiz
  const handleOptionSelect = (optionIndex) => {
    const updatedAnswers = [...userAnswers];
    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    
    // For multiple choice questions, toggle the selection
    const selectedOptionIndex = updatedAnswers[currentQuestionIndex].selectedOptions.indexOf(optionIndex);
    
    if (selectedOptionIndex === -1) {
      // Add option if not already selected
      updatedAnswers[currentQuestionIndex].selectedOptions.push(optionIndex);
    } else {
      // Remove option if already selected
      updatedAnswers[currentQuestionIndex].selectedOptions = 
        updatedAnswers[currentQuestionIndex].selectedOptions.filter(index => index !== optionIndex);
    }
    
    setUserAnswers(updatedAnswers);
  };

  // Navigate to next question
  const nextQuestion = () => {
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  // Navigate to previous question
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Submit quiz answers
  const submitQuiz = () => {
    // Calculate results
    const results = {
      totalQuestions: currentQuiz.questions.length,
      correctAnswers: 0,
      incorrectAnswers: 0,
      questionResults: []
    };
    
    currentQuiz.questions.forEach((question, index) => {
      const userSelectedIndices = userAnswers[index].selectedOptions;
      const correctIndices = question.options
        .map((option, idx) => option.isCorrect ? idx : -1)
        .filter(idx => idx !== -1);
      
      // Check if arrays have the same elements (regardless of order)
      const isCorrect = 
        userSelectedIndices.length === correctIndices.length && 
        userSelectedIndices.every(idx => correctIndices.includes(idx));
      
      results.questionResults.push({
        question: question.text,
        isCorrect,
        userSelected: userSelectedIndices.map(idx => question.options[idx].text),
        correctAnswers: correctIndices.map(idx => question.options[idx].text),
        explanation: question.explanation
      });
      
      if (isCorrect) {
        results.correctAnswers++;
      } else {
        results.incorrectAnswers++;
      }
    });
    
    results.score = Math.round((results.correctAnswers / results.totalQuestions) * 100);
    
    setQuizResults(results);
    setTakingQuiz(false);
  };

  //AI generated quizz
  const handleGenerateQuizWithAI = async () => {
  try {
    const aiText = await getGeminiResponse([
      { sender: 'user', text: `Generate a quiz based on this topic: ${description}. Return only a JSON object with this format:
{
  "title": "Your Quiz Title",
  "questions": [
    {
      "text": "Question text",
      "options": [
        { "text": "Option 1", "isCorrect": false },
        { "text": "Option 2", "isCorrect": true }
      ],
      "explanation": "Explanation text"
    }
  ]
}` }
    ], subject);

    //  Strip backticks and parse clean JSON
    const cleanJSON = aiText.replace(/```json|```/g, '').trim();
    const quizJSON = JSON.parse(cleanJSON);

    // Set fields with AI-generated data
    setTitle(quizJSON.title || '');
    setQuestions(quizJSON.questions || []);
    setShowQuizForm(true); // Show the form with prefilled values
    setError('');
  } catch (err) {
    console.error('Error generating quiz with AI:', err);
    setError('AI could not generate the quiz. Please try a simpler description.');
  }
};


  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2>Quizzes for {subjectName}</h2>
        
        {/* Navigation button to Chatbot */}
        <button 
          onClick={navigateToChatbot}
          style={{ 
            padding: '0.5rem 1rem',
            backgroundColor: '#4285f4',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Switch to Chatbot
        </button>
      </div>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      {/* Quiz List or Quiz Form or Taking Quiz */}
      {takingQuiz ? (
        // Taking Quiz UI
        <div>
          <div style={{ marginBottom: '1rem' }}>
            <h3>{currentQuiz.title}</h3>
            <p>Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}</p>
          </div>
          
          <div style={{ 
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <h4>{currentQuiz.questions[currentQuestionIndex].text}</h4>
            
            <div style={{ marginTop: '1rem' }}>
              {currentQuiz.questions[currentQuestionIndex].options.map((option, optionIndex) => (
                <div key={optionIndex} style={{ marginBottom: '0.5rem' }}>
                  <label style={{ 
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.5rem',
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    backgroundColor: userAnswers[currentQuestionIndex].selectedOptions.includes(optionIndex) 
                      ? '#e3f2fd' 
                      : 'transparent'
                  }}>
                    <input 
                      type="checkbox"
                      checked={userAnswers[currentQuestionIndex].selectedOptions.includes(optionIndex)}
                      onChange={() => handleOptionSelect(optionIndex)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    {option.text}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <button 
              onClick={prevQuestion}
              disabled={currentQuestionIndex === 0}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: currentQuestionIndex === 0 ? '#f5f5f5' : '#e0e0e0',
                border: '1px solid #ddd',
                borderRadius: '4px',
                cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer'
              }}
            >
              Previous
            </button>
            
            {currentQuestionIndex < currentQuiz.questions.length - 1 ? (
              <button 
                onClick={nextQuestion}
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: '#e0e0e0',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
              >
                Next
              </button>
            ) : (
              <button 
                onClick={submitQuiz}
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Submit Quiz
              </button>
            )}
          </div>
        </div>
      ) : showQuizForm ? (
        // Quiz Form UI
        <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Quiz Title:
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px'
                }}
                required
              />
            </label>
          </div>
          
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>
              Description(Required):
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ 
                  width: '100%', 
                  padding: '0.5rem',
                  marginTop: '0.25rem',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  minHeight: '80px'
                }}
              />
            </label>
          </div>

          {/* AI Button for quiz generation */}
<button 
  type="button"
  onClick={handleGenerateQuizWithAI}
  style={{ 
    padding: '0.5rem 1rem',
    backgroundColor: '#34a853',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    marginBottom: '1rem'
  }}
>
  Generate Quiz with AI
</button>

          
          <h3>Questions</h3>
          
          {questions.map((question, questionIndex) => (
            <div 
              key={questionIndex} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <h4 style={{ margin: 0 }}>Question {questionIndex + 1}</h4>
                <button 
                  type="button" 
                  onClick={() => removeQuestion(questionIndex)}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#ffebee',
                    color: '#d32f2f',
                    border: '1px solid #ffcdd2',
                    borderRadius: '4px'
                  }}
                >
                  Remove
                </button>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Question Text:
                  <input
                    type="text"
                    value={question.text}
                    onChange={(e) => handleQuestionTextChange(questionIndex, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem',
                      marginTop: '0.25rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px'
                    }}
                    required
                  />
                </label>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem' }}>
                  Explanation (optional):
                  <textarea
                    value={question.explanation}
                    onChange={(e) => handleExplanationChange(questionIndex, e.target.value)}
                    style={{ 
                      width: '100%', 
                      padding: '0.5rem',
                      marginTop: '0.25rem',
                      border: '1px solid #ddd',
                      borderRadius: '4px',
                      minHeight: '60px'
                    }}
                  />
                </label>
              </div>
              
              <div style={{ marginBottom: '1rem' }}>
                <h5>Options (check the correct ones)</h5>
                
                {question.options.map((option, optionIndex) => (
                  <div 
                    key={optionIndex} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={option.isCorrect}
                      onChange={() => handleOptionCorrectToggle(questionIndex, optionIndex)}
                      style={{ marginRight: '0.5rem' }}
                    />
                    <input
                      type="text"
                      value={option.text}
                      onChange={(e) => handleOptionTextChange(questionIndex, optionIndex, e.target.value)}
                      style={{ 
                        flex: 1,
                        padding: '0.5rem',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                      required
                    />
                    <button 
                      type="button" 
                      onClick={() => removeOption(questionIndex, optionIndex)}
                      style={{ 
                        marginLeft: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px'
                      }}
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                <button 
                  type="button" 
                  onClick={() => addOption(questionIndex)}
                  style={{ 
                    padding: '0.25rem 0.5rem',
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ddd',
                    borderRadius: '4px'
                  }}
                >
                  Add Option
                </button>
              </div>
            </div>
          ))}
          
          <div style={{ marginBottom: '1.5rem' }}>
            <button 
              type="button" 
              onClick={addQuestion}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              Add Question
            </button>
          </div>
          
          <div>
            <button 
              type="submit"
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginRight: '0.5rem'
              }}
            >
              {currentQuiz ? 'Update Quiz' : 'Create Quiz'}
            </button>
            
            <button 
              type="button"
              onClick={() => {
                resetForm();
                setShowQuizForm(false);
              }}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#f5f5f5',
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : quizResults ? (
        // Quiz Results UI
        <div>
          <h3>Quiz Results: {currentQuiz.title}</h3>
          
          <div style={{ 
            border: '1px solid #ddd',
            borderRadius: '4px',
            padding: '1rem',
            marginBottom: '1rem',
            backgroundColor: quizResults.score >= 70 ? '#e8f5e9' : '#ffebee'
          }}>
            <h4>Score: {quizResults.score}%</h4>
            <p>Correct Answers: {quizResults.correctAnswers} out of {quizResults.totalQuestions}</p>
          </div>
          
          <h4>Question Review:</h4>
          
          {quizResults.questionResults.map((result, index) => (
            <div 
              key={index} 
              style={{ 
                border: '1px solid #ddd',
                borderRadius: '4px',
                padding: '1rem',
                marginBottom: '1rem',
                backgroundColor: result.isCorrect ? '#e8f5e9' : '#ffebee'
              }}
            >
              <h5>{index + 1}. {result.question}</h5>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Your Answer:</strong> {result.userSelected.join(', ') || 'None selected'}
              </div>
              
              <div style={{ marginBottom: '0.5rem' }}>
                <strong>Correct Answer:</strong> {result.correctAnswers.join(', ')}
              </div>
              
              {result.explanation && (
                <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <strong>Explanation:</strong> {result.explanation}
                </div>
              )}
            </div>
          ))}
          
          <div style={{ marginTop: '1rem' }}>
            <button 
              onClick={() => {
                setQuizResults(null);
                setCurrentQuiz(null);
              }}
              style={{ 
                padding: '0.5rem 1rem',
                backgroundColor: '#4285f4',
                color: 'white',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              Back to Quizzes
            </button>
          </div>
        </div>
      ) : (
        // Quiz List UI
        <div>
          {!loading && (
            <div style={{ marginBottom: '1rem' }}>
              <button 
                onClick={() => {
                  resetForm();
                  setShowQuizForm(true);
                }}
                style={{ 
                  padding: '0.5rem 1rem',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px'
                }}
              >
                Create New Quiz
              </button>
            </div>
          )}

              <button 
      onClick={handleGenerateQuizWithAI}
      style={{ 
        padding: '0.5rem 1rem',
        backgroundColor: '#34a853',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        marginLeft: '0.5rem'
      }}
    >
      Generate Quiz with AI
    </button>

          
          {loading ? (
            <p>Loading quizzes...</p>
          ) : quizzes.length === 0 ? (
            <p>No quizzes yet. Create your first quiz!</p>
          ) : (
            <div>
              {quizzes.map(quiz => (
                <div 
                  key={quiz._id} 
                  style={{ 
                    border: '1px solid #ddd',
                    borderRadius: '4px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}
                >
                  <h3>{quiz.title}</h3>
                  {quiz.description && <p>{quiz.description}</p>}
                  <p>{quiz.questions.length} question{quiz.questions.length !== 1 ? 's' : ''}</p>
                  
                  <div style={{ marginTop: '1rem' }}>
                    <button 
                      onClick={() => startQuiz(quiz)}
                      style={{ 
                        padding: '0.5rem 1rem',
                        backgroundColor: '#4285f4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginRight: '0.5rem'
                      }}
                    >
                      Take Quiz
                    </button>
                    
                    <button 
                      onClick={() => handleEdit(quiz)}
                      style={{ 
                        padding: '0.5rem 1rem',
                        backgroundColor: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginRight: '0.5rem'
                      }}
                    >
                      Edit
                    </button>
                    
                    <button 
                      onClick={() => handleDelete(quiz._id)}
                      style={{ 
                        padding: '0.5rem 1rem',
                        backgroundColor: '#ffebee',
                        color: '#d32f2f',
                        border: '1px solid #ffcdd2',
                        borderRadius: '4px'
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Quizcard;