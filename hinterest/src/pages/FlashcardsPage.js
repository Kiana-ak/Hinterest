import React from 'react';
import { useParams } from 'react-router-dom';
import Flashcards from '../components/Flashcards';

export default function FlashcardsPage() {
  const { subjectId } = useParams();
  console.log('📘 FlashcardsPage subjectId:', subjectId); // DEBUG
  return <Flashcards subject={subjectId} />;
}