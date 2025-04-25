import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';

function Navigation() {
  const { currentUser } = useAuth();

  return (
    <nav>
      {/* ... existing code ... */}
      {currentUser && (
        <Link to="/flashcards">Flash Cards</Link>
      )}
      {/* ... existing code ... */}
    </nav>
  );
}

export default Navigation;