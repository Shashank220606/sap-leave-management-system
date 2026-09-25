import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function NotFound() {
  const { user } = useAuth();
  const homePath = user ? (user.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard') : '/login';

  return (
    <div className="notfound">
      <span className="notfound-icon"><Compass size={30} /></span>
      <h1>404</h1>
      <h2>Page not found</h2>
      <p>The page you are looking for does not exist or has been moved.</p>
      <Link to={homePath} className="btn btn-primary">
        {user ? 'Back to Dashboard' : 'Go to Login'}
      </Link>
    </div>
  );
}
