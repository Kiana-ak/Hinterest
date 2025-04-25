import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // real auth logic later
    sessionStorage.setItem('isLoggedIn', 'true')
    navigate('/home');
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
