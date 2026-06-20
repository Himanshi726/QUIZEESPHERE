import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
    adminSecret: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await register(formData);
      setSuccess('Registration successful! Please check your email to verify your account.');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center tracking-tight">Create Account</h2>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">{success}</div>}
      
      {!success && (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              minLength="6"
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {formData.role === 'admin' && (
            <div>
              <label className="block text-sm font-medium mb-1">Admin Secret Key</label>
              <input
                type="password"
                name="adminSecret"
                value={formData.adminSecret}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light dark:focus:ring-accent-dark transition-all"
              />
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 mt-4 bg-accent-light dark:bg-accent-dark text-white dark:text-black rounded-md font-bold hover:opacity-90 transition-opacity"
          >
            Register
          </button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-secondary-light dark:text-secondary-dark">
        Already have an account? <Link to="/login" className="text-accent-light dark:text-accent-dark font-medium underline">Sign in</Link>
      </p>
    </div>
  );
};

export default Register;
