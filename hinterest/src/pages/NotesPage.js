import React from 'react';
import { useParams } from 'react-router-dom';
import Notecard from '../components/Notecard';

export default function NotesPage() {
  const { subjectId } = useParams();

  return (
    <div style={{ padding: '2rem' }}>
      <Notecard subject={subjectId} />
    </div>
  );
}