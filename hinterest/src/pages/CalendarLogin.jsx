import { useNavigate } from 'react-router-dom';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

// Replace this with your real client ID
const clientId = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

function CalendarLogin() {
  const navigate = useNavigate();

  const handleLoginSuccess = (credentialResponse) => {
    const token = credentialResponse.credential;
    localStorage.setItem('google_token', token);
    alert('Login successful! Redirecting to calendar...');
    navigate('/calendar');
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Sign in with Google to access your calendar</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log('Login Failed');
            alert('Login failed');
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
}

export default CalendarLogin;

