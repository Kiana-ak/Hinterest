import Chatbot from './Chatbot';
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const SubjectContent = ({ subject }) => {
  return (
    <div>
      <h2>{subject}</h2>
      <Link 
        to="/notes" 
        style={{
          display: 'inline-block',
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '4px',
          marginBottom: '20px'
        }}
      >
        View Notes
      </Link>
      <Chatbot/>
    </div>
  );
};

export default SubjectContent;