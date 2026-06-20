import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

const AdminLeaderboard = () => {
  const { id } = useParams();
  const [attempts, setAttempts] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const [attemptsRes, quizRes] = await Promise.all([
          api.get(`/attempts/quiz/${id}`),
          api.get(`/quizzes/${id}`)
        ]);
        setAttempts(attemptsRes.data.data);
        setQuiz(quizRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [id]);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
           <h1 className="text-3xl font-bold mb-2">Leaderboard</h1>
           <h2 className="text-xl text-secondary-light dark:text-secondary-dark">{quiz?.title}</h2>
        </div>
        <Link to="/dashboard" className="text-accent-light dark:text-accent-dark hover:underline">
          Back to Dashboard
        </Link>
      </div>

      <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">User</th>
              <th className="px-6 py-4 font-semibold">Score</th>
              <th className="px-6 py-4 font-semibold">Completed At</th>
            </tr>
          </thead>
          <tbody>
            {attempts.length === 0 ? (
              <tr><td colSpan="4" className="px-6 py-8 text-center text-secondary-light">No attempts yet.</td></tr>
            ) : (
              attempts.map((attempt, idx) => (
                <tr key={attempt._id} className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                  <td className="px-6 py-4 font-bold">{idx + 1}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium">{attempt.user.name}</div>
                    <div className="text-sm text-secondary-light dark:text-secondary-dark">{attempt.user.email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`font-bold ${attempt.score >= 80 ? 'text-green-500' : ''}`}>
                      {attempt.score.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-secondary-light dark:text-secondary-dark">
                    {new Date(attempt.completedAt).toLocaleString()}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminLeaderboard;
