import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-base-200 bg-base-100 px-6 py-4">
      <div>
        <p className="text-xs uppercase text-base-content/60">Welcome back</p>
        <h2 className="text-2xl font-semibold">{user?.name || 'Explorer'}</h2>
      </div>
      <div className="flex items-center gap-3">
        <Link to="/profile" className="btn btn-ghost btn-sm">
          Profile
        </Link>
        <button className="btn btn-outline btn-sm" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
