import { useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';

function CalendarLogin() {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      const token = tokenResponse.access_token;
      localStorage.setItem('google_token', token);
      alert('Login successful! Redirecting to calendar...');
      navigate('/calendar');
    },
    onError: () => {
      alert('Login failed');
    },
    scope: 'https://www.googleapis.com/auth/calendar.events', // 🔁 Changed from .readonly
    flow: 'implicit',
  });

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Sign in with Google to access your calendar</h2>
      <button onClick={() => login()}>Sign in with Google</button>
    </div>
  );
}

export default CalendarLogin;

