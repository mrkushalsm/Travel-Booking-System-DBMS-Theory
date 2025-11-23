import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-base-200 to-base-100 p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <div>
            <p className="text-sm uppercase tracking-wide text-base-content/60">Travel Agency</p>
            <h2 className="text-3xl font-bold">Sign in</h2>
            <p className="text-base-content/70">Book flights, hotels, and packages effortlessly.</p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="form-control">
              <span className="label-text">Email</span>
              <input
                type="email"
                className="input input-bordered"
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </label>
            <label className="form-control">
              <span className="label-text">Password</span>
              <input
                type="password"
                className="input input-bordered"
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                required
              />
            </label>
            {error && <p className="text-sm text-error">{error}</p>}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Login'}
            </button>
          </form>
          <p className="text-center text-sm text-base-content/70">
            New to the portal?{' '}
            <Link className="link link-primary" to="/register">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
