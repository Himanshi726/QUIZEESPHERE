import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { PlusCircle, PlayCircle, Award, Clock } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const quizRes = await api.get('/quizzes');
        setQuizzes(quizRes.data.data);
        
        const attemptRes = await api.get('/attempts/user');
        setAttempts(attemptRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.role]);

  const handleJoinQuiz = async (e) => {
    e.preventDefault();
    if (!joinCode) return;
    try {
      setJoinError('');
      const res = await api.get(`/quizzes/join/${joinCode}`);
      if (res.data.success) {
        navigate(`/quiz/${res.data.data._id}`);
      }
    } catch (err) {
      setJoinError(err.response?.data?.error || 'Invalid or missing join code');
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Welcome, {user.name}</h1>
        <Link to="/admin/quiz/create" className="flex items-center space-x-2 bg-accent-light dark:bg-accent-dark text-white dark:text-black px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
          <PlusCircle size={20} />
          <span>Create Quiz</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Available Quizzes */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow border border-gray-100 dark:border-gray-800">
          <div className="mb-6 pb-6 border-b border-gray-200 dark:border-gray-700">
             <h2 className="text-xl font-bold mb-3 flex items-center">Join a Private Quiz</h2>
             <form onSubmit={handleJoinQuiz} className="flex gap-2">
               <input 
                 type="text" 
                 placeholder="Enter Join Code" 
                 value={joinCode}
                 onChange={(e) => setJoinCode(e.target.value)}
                 className="flex-1 px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light uppercase"
               />
               <button type="submit" className="bg-accent-light dark:bg-accent-dark text-white dark:text-black px-4 py-2 rounded-md font-medium hover:opacity-90">
                 Join
               </button>
             </form>
             {joinError && <p className="text-red-500 text-sm mt-2">{joinError}</p>}
          </div>

          <h2 className="text-xl font-bold mb-4 flex items-center"><PlayCircle className="mr-2" /> Available Quizzes</h2>
          {quizzes.length === 0 ? (
            <p className="text-secondary-light dark:text-secondary-dark">No quizzes available yet.</p>
          ) : (
            <div className="space-y-4">
              {quizzes.map(quiz => {
                // Check if user already attempted
                const hasAttempted = attempts.some(a => a.quiz._id === quiz._id);
                return (
                  <div key={quiz._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-900">
                    <div>
                      <h3 className="font-semibold text-lg">{quiz.title}</h3>
                      <p className="text-sm text-secondary-light dark:text-secondary-dark flex items-center mt-1">
                        <Clock size={14} className="mr-1"/> {quiz.timeLimit} mins
                      </p>
                    </div>
                    <div className="flex space-x-3 items-center">
                      {hasAttempted ? (
                        <span className="text-green-600 dark:text-green-400 font-medium text-sm bg-green-100 dark:bg-green-900 px-3 py-1 rounded-full">Attempted</span>
                      ) : (
                        <Link to={`/quiz/${quiz._id}`} className="bg-accent-light dark:bg-accent-dark text-white dark:text-black px-4 py-2 rounded-md text-sm font-medium hover:opacity-90">
                          Start Quiz
                        </Link>
                      )}
                      <Link to={`/admin/quiz/${quiz._id}/leaderboard`} className="text-accent-light dark:text-accent-dark text-sm font-medium hover:underline">
                        Leaderboard
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Past Results */}
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow border border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold mb-4 flex items-center"><Award className="mr-2" /> Your Results</h2>
          {attempts.length === 0 ? (
            <p className="text-secondary-light dark:text-secondary-dark">You haven't taken any quizzes yet.</p>
          ) : (
            <div className="space-y-4">
              {attempts.map(attempt => (
                <div key={attempt._id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-md flex justify-between items-center bg-gray-50 dark:bg-gray-900">
                  <div>
                    <h3 className="font-semibold">{attempt.quiz?.title || 'Unknown Quiz'}</h3>
                    <p className="text-xs text-secondary-light dark:text-secondary-dark mt-1">
                      Completed: {new Date(attempt.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold">{attempt.score.toFixed(1)}%</div>
                    {attempt.score >= 80 && (
                      <button className="text-accent-light dark:text-accent-dark text-xs font-medium hover:underline flex items-center mt-1">
                         Certificate (Coming Soon)
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
