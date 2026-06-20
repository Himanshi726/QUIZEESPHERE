import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">Welcome Back</h2>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            placeholder="you@example.com"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            placeholder="••••••••"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-accent-light dark:bg-accent-dark text-white dark:text-black rounded-md font-bold hover:opacity-90 transition-opacity"
        >
          Sign In
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-secondary-light dark:text-secondary-dark">
        Don't have an account? <Link to="/register" className="text-accent-light dark:text-accent-dark font-medium underline">Register here</Link>
      </p>
    </div>
  );
};

export default Login;
