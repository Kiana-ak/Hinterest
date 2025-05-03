import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';
import background from '../assets/login-bg.jpg';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async () => {
    const endpoint = isLogin ? '/api/login' : '/api/register';

    try {
      const response = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Success!');
        if (isLogin) {
          localStorage.setItem('token', data.token);
          navigate('/home');
        } else {
          setIsLogin(true); // After signup, go to login
        }
      } else {
        setMessage(data.error || 'Something went wrong.');
      }
    } catch (err) {
      console.error(err);
      setMessage('Server error.');
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
        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          /><br /><br />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          /><br /><br />
          <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
        </form>
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
