import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import background from '../assets/loginbg.jpg';
import logo from '../assets/logo-h.png';
import './Login.css';

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin
      ? 'http://localhost:8080/api/login'
      : 'http://localhost:8080/api/register';

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error occurred');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userEmail', email);
      
      setError('');
      if (!isLogin) setMessage('Registration successful!');
      navigate('/home');
    } catch (err) {
      setError(err.message);
      setMessage('');
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
        fontFamily: 'Poppins, sans-serif'
      }}
    >
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: [0, -10, 0], opacity: 1 }}
        transition={{
          duration: 2,
          ease: 'easeInOut',
          repeat: Infinity,
          repeatType: 'loop',
          opacity: { duration: 0.8, ease: 'easeOut', delay: 0.1 }
        }}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.3)',
          padding: '2rem',
          borderRadius: '1rem',
          width: '100%',
          maxWidth: '400px',
          textAlign: 'center',
          backdropFilter: 'blur(15px)',
          WebkitBackdropFilter: 'blur(15px)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: '#000',
          fontFamily: 'Poppins, sans-serif' 
        }}
      >
        <img
          src={logo}
          alt="Hinterest Logo"
          style={{
            width: '80px',
            height: '80px',
            objectFit: 'contain',
            display: 'block',
            margin: '0 auto',
            filter: 'drop-shadow(0 0 5px rgba(0,0,0,0.2))',
            borderRadius: '50%'
          }}
        />
        <h2 style={{ marginBottom: '1rem' }}>
          {isLogin ? 'Login to Hinterest' : 'Create an Account'}
        </h2>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="login-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="login-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength="6"
          />
          <button type="submit" className="login-button">
            {isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '0.5rem' }}>{error}</p>}
        {message && <p style={{ color: 'green', marginTop: '0.5rem' }}>{message}</p>}

        <div style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
          {isLogin ? (
            <p>
              Don't have an account?{' '}
              <span
                onClick={() => setIsLogin(false)}
                style={{ color: '#4b6cb7', cursor: 'pointer' }}
              >
                Sign up here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <span
                onClick={() => setIsLogin(true)}
                style={{ color: '#4b6cb7', cursor: 'pointer' }}
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}

export default Login;