import { render, screen } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// Mock components used in App to avoid rendering issues in tests
jest.mock('./pages/LoginPage', () => () => <div>Login Page</div>);
jest.mock('./pages/Home', () => () => <div>Home Page</div>);
jest.mock('./pages/CalendarLogin', () => () => <div>Calendar Login</div>);
jest.mock('./pages/CalendarPage', () => () => <div>Calendar Page</div>);
jest.mock('./components/NotePage', () => () => <div>Note Page</div>);
jest.mock('./pages/FlashcardsPage', () => () => <div>Flashcards Page</div>);
jest.mock('./pages/QuizzesPage', () => () => <div>Quizzes Page</div>);
jest.mock('./pages/WhiteboardPage', () => () => <div>Whiteboard Page</div>);

test('renders login page by default', () => {
  render(<App />);
  const loginElement = screen.getByText(/Login Page/i);
  expect(loginElement).toBeInTheDocument();
});

// Remove or update this test as it's looking for text that doesn't exist
// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
