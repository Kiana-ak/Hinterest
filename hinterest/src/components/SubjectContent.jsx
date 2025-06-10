import React from 'react';
import Chatbot from './Chatbot';

const SubjectContent = ({ subject }) => {
  return (
    <div>
      <h2>{subject}</h2>
      <Chatbot/>
    </div>
  );
};

export default SubjectContent;