import React, { useContext } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { BrainCircuit } from 'lucide-react';

const Home = () => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return null;
  if (user) return <Navigate to="/dashboard" />;

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
      <BrainCircuit className="w-24 h-24 mb-8 text-accent-light dark:text-accent-dark" />
      <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
        Master Your Knowledge with <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-500 dark:from-white dark:to-gray-400">QUIZEE</span>
      </h1>
      <p className="text-xl md:text-2xl mb-10 text-secondary-light dark:text-secondary-dark max-w-2xl">
        The ultimate platform for taking secure, timed quizzes. Test yourself, earn certificates, and climb the leaderboard.
      </p>
      <div className="flex space-x-4">
        <Link to="/register" className="px-8 py-4 bg-accent-light dark:bg-accent-dark text-white dark:text-black rounded-full font-bold text-lg hover:opacity-90 transition-opacity shadow-lg">
          Get Started
        </Link>
        <Link to="/login" className="px-8 py-4 border-2 border-accent-light dark:border-accent-dark text-accent-light dark:text-accent-dark rounded-full font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
          Login
        </Link>
      </div>
    </div>
  );
};

export default Home;
