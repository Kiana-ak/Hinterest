import React from 'react';
import { useSubject } from '../context/SubjectContext';
import Quizcard from '../components/Quizcard';

export default function QuizPage() {
  const { selectedSubject } = useSubject();

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Quizzes</h2>
      {selectedSubject ? (
        <Quizcard subject={selectedSubject._id} />
      ) : (
        <p>Please select a subject from the Workspace first.</p>
      )}
    </div>
  );
}