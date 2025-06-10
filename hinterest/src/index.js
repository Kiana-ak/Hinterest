import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { ThemeProvider } from './Themes/ThemeContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = '328485909923-lma8urgooh0t9o2ldl2lqueh8kg34al9.apps.googleusercontent.com';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <GoogleOAuthProvider clientId={clientId}>
    <ThemeProvider>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ThemeProvider>
  </GoogleOAuthProvider>
);