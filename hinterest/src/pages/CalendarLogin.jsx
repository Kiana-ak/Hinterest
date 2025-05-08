import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const clientId = '328485909923-lma8urgooh0t9o2ldl2lqueh8kg34al9.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

function CalendarLogin() {
  const navigate = useNavigate();

  useEffect(() => {
    if (window.google) {
      const tokenClient = window.google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: SCOPES,
        callback: (tokenResponse) => {
          if (tokenResponse.access_token) {
            localStorage.setItem('google_token', tokenResponse.access_token);
            alert('Google login successful!');
            navigate('/calendar');
          } else {
            alert('Failed to get access token.');
          }
        },
      });

      // Trigger login immediately
      tokenClient.requestAccessToken();
    } else {
      alert('Google client not loaded.');
    }
  }, []);

  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h2>Logging in with Google...</h2>
    </div>
  );
}

export default CalendarLogin;