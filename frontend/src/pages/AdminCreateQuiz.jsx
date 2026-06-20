import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { Plus, Trash2 } from 'lucide-react';

const AdminCreateQuiz = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimit: 30,
  });
  const [questions, setQuestions] = useState([
    { text: '', options: ['', '', '', ''], correctAnswer: '', imageUrl: '' }
  ]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [isCustomTime, setIsCustomTime] = useState(false);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: '', imageUrl: '' }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, i) => i !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate that correct answer is one of the options
    for (let q of questions) {
      if (!q.options.includes(q.correctAnswer)) {
         setError(`For question "${q.text || 'Untitled'}", the correct answer must exactly match one of its options.`);
         setLoading(false);
         return;
      }
    }

    try {
      await api.post('/quizzes', {
        ...formData,
        questions
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create quiz');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Quiz</h1>
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
      
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-800 space-y-4">
          <h2 className="text-xl font-bold mb-4">Quiz Details</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Title</label>
            <input 
              type="text" required value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea 
              required value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Time Limit</label>
            <select 
              required={!isCustomTime} 
              value={isCustomTime ? 'custom' : formData.timeLimit} 
              onChange={e => {
                if (e.target.value === 'custom') {
                  setIsCustomTime(true);
                } else {
                  setIsCustomTime(false);
                  setFormData({...formData, timeLimit: parseInt(e.target.value)});
                }
              }}
              className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light"
            >
              <option value={30}>30 Minutes</option>
              <option value={60}>1 Hour</option>
              <option value={90}>1.5 Hours</option>
              <option value={120}>2 Hours</option>
              <option value={150}>2.5 Hours</option>
              <option value={180}>3 Hours</option>
              <option value="custom">Custom Time...</option>
            </select>
            {isCustomTime && (
              <input 
                type="number" required min="1"
                value={formData.timeLimit}
                onChange={e => setFormData({...formData, timeLimit: parseInt(e.target.value) || ''})}
                placeholder="Enter custom minutes"
                className="mt-3 w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-accent-light"
              />
            )}
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-bold flex justify-between items-center">
            <span>Questions</span>
            <button type="button" onClick={addQuestion} className="text-sm flex items-center bg-gray-200 dark:bg-gray-800 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition-colors">
              <Plus size={16} className="mr-1"/> Add Question
            </button>
          </h2>
          
          {questions.map((q, qIdx) => (
            <div key={qIdx} className="bg-surface-light dark:bg-surface-dark p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 relative">
              {questions.length > 1 && (
                <button type="button" onClick={() => removeQuestion(qIdx)} className="absolute top-4 right-4 text-red-500 hover:text-red-700">
                  <Trash2 size={20} />
                </button>
              )}
              <h3 className="font-semibold mb-4 text-lg">Question {qIdx + 1}</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Question Text</label>
                  <input 
                    type="text" required value={q.text} onChange={e => handleQuestionChange(qIdx, 'text', e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Image URL (Optional)</label>
                  <input 
                    type="text" value={q.imageUrl} onChange={e => handleQuestionChange(qIdx, 'imageUrl', e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                    placeholder="https://example.com/image.png"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx}>
                       <label className="block text-xs font-medium mb-1">Option {oIdx + 1}</label>
                       <input 
                          type="text" required value={opt} onChange={e => handleOptionChange(qIdx, oIdx, e.target.value)}
                          className="w-full px-3 py-2 rounded-md bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700"
                       />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1 text-green-600 dark:text-green-400">Correct Answer</label>
                  <input 
                    type="text" required value={q.correctAnswer} onChange={e => handleQuestionChange(qIdx, 'correctAnswer', e.target.value)}
                    className="w-full px-4 py-2 rounded-md bg-green-50 dark:bg-green-900/20 border border-green-300 dark:border-green-800"
                    placeholder="Must exactly match one of the options above"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <button 
          type="submit" disabled={loading}
          className="w-full py-4 bg-accent-light dark:bg-accent-dark text-white dark:text-black rounded-md font-bold text-lg hover:opacity-90 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Quiz'}
        </button>
      </form>
    </div>
  );
};

export default AdminCreateQuiz;
