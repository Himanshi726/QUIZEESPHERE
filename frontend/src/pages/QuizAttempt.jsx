import React, { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import { generateCertificate } from '../utils/generateCertificate';
import { Clock, AlertTriangle, CheckCircle, Download } from 'lucide-react';

const QuizAttempt = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [warnings, setWarnings] = useState(0);
  const [error, setError] = useState('');

  // Shuffle array utility
  const shuffleArray = (array) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/quizzes/${id}`);
        const data = res.data.data;
        setQuiz(data);
        setTimeLeft(data.timeLimit * 60);
        
        // Shuffle questions and options
        const shuffledQuestions = shuffleArray(data.questions).map(q => ({
          ...q,
          options: shuffleArray(q.options)
        }));
        setQuestions(shuffledQuestions);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load quiz');
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  const handleSubmit = useCallback(async (autoSubmit = false) => {
    if (submitting || result) return;
    setSubmitting(true);
    
    const formattedAnswers = Object.keys(answers).map(qId => ({
      questionId: qId,
      providedAnswer: answers[qId]
    }));

    try {
      const res = await api.post('/attempts/submit', {
        quizId: id,
        answers: formattedAnswers
      });
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit quiz');
    } finally {
      setSubmitting(false);
    }
  }, [answers, id, submitting, result]);

  // Timer logic
  useEffect(() => {
    if (loading || result || error) return;
    
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, result, error, handleSubmit]);

  // Anti-cheating mechanics
  useEffect(() => {
    if (loading || result || error) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setWarnings(prev => {
          const newWarnings = prev + 1;
          if (newWarnings >= 3) {
            alert('Multiple tab switches detected. Quiz auto-submitted.');
            handleSubmit(true);
          } else {
            alert(`Warning ${newWarnings}/3: Tab switching is not allowed!`);
          }
          return newWarnings;
        });
      }
    };

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopyPaste = (e) => e.preventDefault();

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
    };
  }, [loading, result, error, handleSubmit]);

  const handleOptionSelect = (questionId, option) => {
    if (result) return;
    setAnswers(prev => ({
      ...prev,
      [questionId]: option
    }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) return <div className="text-center mt-20 text-xl font-medium">Preparing your quiz...</div>;
  if (error) return <div className="text-center mt-20 text-red-500 font-bold text-xl">{error}</div>;

  if (result) {
    return (
      <div className="max-w-2xl mx-auto mt-10 p-8 bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg text-center border border-gray-100 dark:border-gray-800">
        <CheckCircle className="w-20 h-20 mx-auto text-green-500 mb-6" />
        <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
        <div className="text-6xl font-black mb-6 tracking-tighter">{result.score.toFixed(1)}%</div>
        <p className="text-lg text-secondary-light dark:text-secondary-dark mb-8">
          You answered {result.answers.filter(a => a.isCorrect).length} out of {quiz.questions.length} questions correctly.
        </p>
        
        <div className="flex flex-col space-y-4 items-center">
          {result.score >= 80 && (
            <button 
              onClick={() => generateCertificate(user.name, quiz.title, result.score, new Date(result.completedAt).toLocaleDateString())}
              className="flex items-center space-x-2 bg-accent-light dark:bg-accent-dark text-white dark:text-black px-6 py-3 rounded-full font-bold hover:opacity-90 transition-opacity"
            >
              <Download size={20} />
              <span>Download Certificate</span>
            </button>
          )}
          <button 
            onClick={() => navigate('/dashboard')}
            className="text-accent-light dark:text-accent-dark font-medium hover:underline"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-20 select-none">
      {/* Header Sticky Bar */}
      <div className="sticky top-0 z-10 bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-800 p-4 mb-8 flex justify-between items-center rounded-b-lg">
        <div>
          <h1 className="text-xl font-bold truncate max-w-[200px] md:max-w-md">{quiz.title}</h1>
          <p className="text-sm text-secondary-light dark:text-secondary-dark">Answer all questions</p>
        </div>
        <div className="flex items-center space-x-4">
          {warnings > 0 && (
            <div className="flex items-center text-red-500 text-sm font-bold animate-pulse">
              <AlertTriangle size={16} className="mr-1" />
              <span>Warnings: {warnings}/3</span>
            </div>
          )}
          <div className={`flex items-center text-lg font-bold px-4 py-2 rounded-md ${timeLeft < 60 ? 'bg-red-100 text-red-600' : 'bg-gray-100 dark:bg-gray-800'}`}>
            <Clock size={20} className="mr-2" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-8">
        {questions.map((q, idx) => (
          <div key={q._id} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-lg font-medium mb-4"><span className="text-secondary-light dark:text-secondary-dark font-bold mr-2">{idx + 1}.</span> {q.text}</h3>
            {q.imageUrl && (
              <img src={q.imageUrl} alt="Question" className="mb-6 max-h-64 rounded-md mx-auto" />
            )}
            <div className="space-y-3">
              {q.options.map((opt, oIdx) => (
                <label 
                  key={oIdx} 
                  className={`block p-4 border rounded-md cursor-pointer transition-colors ${answers[q._id] === opt ? 'border-accent-light dark:border-accent-dark bg-gray-50 dark:bg-gray-900 ring-1 ring-accent-light dark:ring-accent-dark' : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                >
                  <div className="flex items-center">
                    <input 
                      type="radio" 
                      name={q._id} 
                      value={opt}
                      checked={answers[q._id] === opt}
                      onChange={() => handleOptionSelect(q._id, opt)}
                      className="mr-3 text-accent-light focus:ring-accent-light"
                    />
                    <span>{opt}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-right">
        <button 
          onClick={() => handleSubmit(false)}
          disabled={submitting}
          className="bg-accent-light dark:bg-accent-dark text-white dark:text-black px-8 py-4 rounded-md font-bold text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {submitting ? 'Submitting...' : 'Submit Quiz'}
        </button>
      </div>
    </div>
  );
};

export default QuizAttempt;
