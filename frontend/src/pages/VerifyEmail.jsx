import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';
import { CheckCircle, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const res = await api.get(`/auth/verify/${token}`);
        setStatus('success');
        setMessage(res.data.message);
      } catch (err) {
        setStatus('error');
        setMessage(err.response?.data?.error || 'Verification failed. The token may be invalid or expired.');
      }
    };
    verifyToken();
  }, [token]);

  return (
    <div className="max-w-md mx-auto mt-20 p-8 text-center bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg border border-gray-100 dark:border-gray-800">
      {status === 'verifying' && (
        <div className="animate-pulse">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <h2 className="text-2xl font-bold">Verifying your email...</h2>
        </div>
      )}
      
      {status === 'success' && (
        <div>
          <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
          <h2 className="text-2xl font-bold mb-2">Email Verified!</h2>
          <p className="text-secondary-light dark:text-secondary-dark mb-6">{message}</p>
          <Link to="/login" className="inline-block px-6 py-3 bg-accent-light dark:bg-accent-dark text-white dark:text-black rounded-md font-bold hover:opacity-90 transition-opacity">
            Go to Login
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle className="w-16 h-16 mx-auto mb-4 text-red-500" />
          <h2 className="text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-secondary-light dark:text-secondary-dark mb-6">{message}</p>
          <Link to="/register" className="inline-block px-6 py-3 border-2 border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark rounded-md font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
            Try Registering Again
          </Link>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
