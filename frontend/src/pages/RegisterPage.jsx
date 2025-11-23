import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    contactNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to register');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-secondary/5 via-base-200 to-base-100 p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body grid gap-8 md:grid-cols-2">
          <div>
            <p className="text-sm uppercase tracking-wide text-base-content/60">Students Portal</p>
            <h2 className="text-3xl font-bold">Create account</h2>
            <p className="text-base-content/70">
              Customers can browse and book experiences, while staff/admin manage services, bookings, and payments.
            </p>
          </div>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="form-control">
              <span className="label-text">Full name</span>
              <input
                className="input input-bordered"
                value={form.name}
                onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                required
              />
            </label>
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
            <label className="form-control">
              <span className="label-text">Contact number</span>
              <input
                className="input input-bordered"
                value={form.contactNumber}
                onChange={(e) => setForm((prev) => ({ ...prev, contactNumber: e.target.value }))}
              />
            </label>
            {error && <p className="text-sm text-error">{error}</p>}
            <button className="btn btn-primary w-full" type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Register'}
            </button>
            <p className="text-center text-sm text-base-content/70">
              Already have an account?{' '}
              <Link className="link link-primary" to="/login">
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
