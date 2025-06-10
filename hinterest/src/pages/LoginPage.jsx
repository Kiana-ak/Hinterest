import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import background from '../assets/login-bg.jpg';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(''); // Add error state

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      // Handle login
      try {
        const response = await fetch('http://localhost:8080/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email); 
        navigate('/home');
      } catch (error) {
        setError(error.message);
      }
    } else {
      // Handle registration
      try {
        const response = await fetch('http://localhost:8080/api/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email,
            password
          })
        });
    
        const data = await response.json();
        if (!response.ok) {
          // Only set error message, not both error and message
          setError(data.message || 'Registration failed. Please try again.');
          return;
        }
    
        // Handle successful registration
        setError(''); // Clear any existing errors
        setMessage('Registration successful!');
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', email); 
        navigate('/home');
      } catch (error) {
        setError(error.message || 'Server error. Please try again later.');
        setMessage(''); // Clear any existing success message
      }
    }
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        padding: '2rem',
        borderRadius: '10px',
        width: '100%',
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        <h2>{isLogin ? 'Login to Hinterest' : 'Create an Account'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          /><br /><br />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
        {/* Display both error and message */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <p style={{ color: isLogin ? 'gray' : 'green' }}>{message}</p>
  
        <div style={{ marginTop: '1rem' }}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => setIsLogin(false)}
                style={{ color: 'blue', cursor: 'pointer' }}
              >
                Sign up here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setIsLogin(true)}
                style={{ color: 'blue', cursor: 'pointer' }}
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Login;