import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';

const QuizPage = () => {
  const [quizzes, setQuizzes] = useState({});
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
  const [summary, setSummary] = useState({ total: 0, correct: 0 });
  const [selectedQuizKey, setSelectedQuizKey] = useState('');
  const [flashcards, setFlashcards] = useState({});
  const [notes, setNotes] = useState({});
  const [showFlashcardForm, setShowFlashcardForm] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [currentFlashcard, setCurrentFlashcard] = useState({ front: '', back: '' });
  const [currentNote, setCurrentNote] = useState('');

  // Add these two functions to handle quiz interactions
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

  useEffect(() => {
    if (currentSubject) {
      const savedQuizzes = localStorage.getItem(`quizzes_${currentSubject}`);
      setQuizzes(savedQuizzes ? JSON.parse(savedQuizzes) : {});

      const savedFlashcards = localStorage.getItem(`flashcards_${currentSubject}`);
      if (savedFlashcards) setFlashcards(JSON.parse(savedFlashcards));

      const savedNotes = localStorage.getItem(`notes_${currentSubject}`);
      if (savedNotes) setNotes(JSON.parse(savedNotes));

      localStorage.setItem('currentSubject', currentSubject);
      localStorage.setItem('lastActive', Date.now().toString());
    }
  }, [currentSubject]);

  useEffect(() => {
    const lastSubject = localStorage.getItem('currentSubject');
    const lastActive = localStorage.getItem('lastActive');
    if (lastSubject && lastActive) {
      const hoursSinceLastActive = (Date.now() - parseInt(lastActive)) / (1000 * 60 * 60);
      if (hoursSinceLastActive < 24) setCurrentSubject(lastSubject);
    }
  }, []);

  const saveQuizzes = (newQuizzes) => {
    localStorage.setItem(`quizzes_${currentSubject}`, JSON.stringify(newQuizzes));
    setQuizzes(newQuizzes);
    localStorage.setItem(`lastModified_${currentSubject}`, Date.now().toString());
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
      setQuestion('');
      setOptions(['', '']);
      setCorrectAnswers([]);
      setShowForm(false);
    }
  };

  const handleSubmitFlashcard = (e) => {
    e.preventDefault();
    if (currentFlashcard.front.trim() && currentFlashcard.back.trim()) {
      const newFlashcards = {
        ...flashcards,
        [currentSubject]: [...(flashcards[currentSubject] || []), {
          id: Date.now(),
          ...currentFlashcard
        }]
      };
      setFlashcards(newFlashcards);
      localStorage.setItem(`flashcards_${currentSubject}`, JSON.stringify(newFlashcards));
      setCurrentFlashcard({ front: '', back: '' });
      setShowFlashcardForm(false);
    }
  };

  const handleSubmitNote = (e) => {
    e.preventDefault();
    if (currentNote.trim()) {
      const newNotes = {
        ...notes,
        [currentSubject]: [...(notes[currentSubject] || []), {
          id: Date.now(),
          content: currentNote
        }]
      };
      setNotes(newNotes);
      localStorage.setItem(`notes_${currentSubject}`, JSON.stringify(newNotes));
      setCurrentNote('');
      setShowNoteForm(false);
    }
  };

  return (
    <div>
      <Navbar />
      <div style={{ padding: '2rem' }}>
        <h2>Study Materials</h2>
        
        {/* Subject Selection */}
        <input
          type="text"
          value={currentSubject}
          onChange={(e) => setCurrentSubject(e.target.value)}
          placeholder="Enter subject name"
          style={{ marginBottom: '1rem', padding: '0.5rem' }}
        />

        {/* Control Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Cancel Quiz' : 'Add Quiz'}
          </button>
          <button onClick={() => setShowFlashcardForm(!showFlashcardForm)}>
            {showFlashcardForm ? 'Cancel Flashcard' : 'Add Flashcard'}
          </button>
          <button onClick={() => setShowNoteForm(!showNoteForm)}>
            {showNoteForm ? 'Cancel Note' : 'Add Note'}
          </button>
        </div>

        {/* Quiz Form */}
        {showForm && (
          <form onSubmit={handleSubmitQuiz}>
            <input
              type="text"
              value={currentQuizName}
              onChange={(e) => setCurrentQuizName(e.target.value)}
              placeholder="Quiz Name"
            />
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
            />
            {options.map((option, index) => (
              <div key={index}>
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                />
                <input
                  type="checkbox"
                  checked={correctAnswers.includes(index)}
                  onChange={() => setCorrectAnswers(prev => 
                    prev.includes(index) 
                      ? prev.filter(i => i !== index)
                      : [...prev, index]
                  )}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddOption}>Add Option</button>
            <button type="button" onClick={handleRemoveOption}>Remove Option</button>
            <button type="submit">Save Quiz</button>
          </form>
        )}

        {/* Flashcard Form */}
        {showFlashcardForm && (
          <form onSubmit={handleSubmitFlashcard}>
            <input
              type="text"
              value={currentFlashcard.front}
              onChange={(e) => setCurrentFlashcard({...currentFlashcard, front: e.target.value})}
              placeholder="Front of flashcard"
            />
            <textarea
              value={currentFlashcard.back}
              onChange={(e) => setCurrentFlashcard({...currentFlashcard, back: e.target.value})}
              placeholder="Back of flashcard"
            />
            <button type="submit">Save Flashcard</button>
          </form>
        )}

        {/* Note Form */}
        {showNoteForm && (
          <form onSubmit={handleSubmitNote}>
            <textarea
              value={currentNote}
              onChange={(e) => setCurrentNote(e.target.value)}
              placeholder="Enter your note"
            />
            <button type="submit">Save Note</button>
          </form>
        )}

        {/* Display Section */}
        {currentSubject && (
          <div>
            {/* Quiz Display */}
            {quizzes[currentSubject]?.length > 0 && (
              <div>
                <h3>Quizzes</h3>
                <select onChange={(e) => setSelectedQuizKey(e.target.value)}>
                  <option value="">Select a quiz</option>
                  {Object.keys(quizzes).map(key => (
                    <option key={key} value={key}>{key}</option>
                  ))}
                </select>
                {selectedQuizKey && !quizComplete && (
                  <div>
                    <h4>{quizzes[selectedQuizKey][currentQuiz].question}</h4>
                    {quizzes[selectedQuizKey][currentQuiz].options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        style={{
                          backgroundColor: selectedAnswers.includes(index) ? '#ddd' : '#fff'
                        }}
                      >
                        {option}
                      </button>
                    ))}
                    <button onClick={checkAnswers}>Submit Answer</button>
                  </div>
                )}
                {showResults && (
                  <div>
                    <p>Score: {score}</p>
                    <button onClick={() => {
                      setShowResults(false);
                      setSelectedAnswers([]);
                      if (currentQuiz < quizzes[selectedQuizKey].length - 1) {
                        setCurrentQuiz(currentQuiz + 1);
                      } else {
                        setQuizComplete(true);
                        setSummary({ total: quizzes[selectedQuizKey].length, correct: score });
                      }
                    }}>Next Question</button>
                  </div>
                )}
              </div>
            )}

            {/* Flashcards Display */}
            {flashcards[currentSubject]?.length > 0 && (
              <div>
                <h3>Flashcards</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                  {flashcards[currentSubject].map(card => (
                    <div key={card.id} style={{ border: '1px solid #ddd', padding: '1rem' }}>
                      <p><strong>Front:</strong> {card.front}</p>
                      <p><strong>Back:</strong> {card.back}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Notes Display */}
            {notes[currentSubject]?.length > 0 && (
              <div>
                <h3>Notes</h3>
                {notes[currentSubject].map(note => (
                  <div key={note.id} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1rem' }}>
                    {note.content}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizPage;
