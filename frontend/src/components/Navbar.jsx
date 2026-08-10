import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();
  const isAuthenticated = !!token;

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-inner">
        {/* Logo */}
        <Link to="/" className="navbar-logo">
          <span className="navbar-logo-icon">✦</span>
          BlogApp
        </Link>

        {/* Nav Links */}
        <ul className="navbar-nav">
          <li>
            <NavLink to="/" end>Home</NavLink>
          </li>
          {isAuthenticated && (
            <>
              <li>
                <NavLink to="/dashboard">My Blogs</NavLink>
              </li>
              <li>
                <NavLink to="/blog/create">Write</NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Actions */}
        <div className="navbar-actions">
          {isAuthenticated ? (
            <>
              <div className="user-chip">
                <span>👤</span>
                <span>{user?.name?.split(' ')[0] || 'User'}</span>
              </div>
              <button
                id="navbar-logout-btn"
                className="btn btn-ghost btn-sm"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm" id="navbar-login-btn">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm" id="navbar-register-btn">
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
