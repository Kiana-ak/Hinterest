import { useNavigate } from 'react-router-dom';
//import './Login.css';

function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    // Add real auth logic later
    navigate('/home');
  };

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Hinterest Login</h2>
      <input type="text" placeholder="Email" /><br /><br />
      <input type="password" placeholder="Password" /><br /><br />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default LoginPage;
