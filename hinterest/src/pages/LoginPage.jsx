import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: document.querySelector('input[type="text"]').value,
          password: document.querySelector('input[type="password"]').value,
        }),
      });

      const data = await response.json();
      if (data.success) {
        navigate('/home');
      } else {
        alert('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Login failed');
    }
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Hinterest Login</h2>
      <input type="text" placeholder="Username" /><br /><br />
      <input type="password" placeholder="Password" /><br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default Login;
