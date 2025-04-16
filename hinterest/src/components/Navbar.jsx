import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav style={{ padding: "1rem", background: "#ddd" }}>
      <Link to="/home" style={{ marginRight: "1rem" }}>Home</Link>
      <Link to="/">Logout</Link>
    </nav>
  );
}

export default Navbar;
