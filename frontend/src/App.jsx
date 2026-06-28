import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { ThemeProvider, ThemeContext } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Dashboard from './pages/Dashboard';
import QuizAttempt from './pages/QuizAttempt';
import AdminCreateQuiz from './pages/AdminCreateQuiz';
import AdminLeaderboard from './pages/AdminLeaderboard';

const PrivateRoute = ({ children, requireAdmin = false }) => {
  const { user, loading } = React.useContext(AuthContext);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  if (!user) return <Navigate to="/login" />;

  if (requireAdmin && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow container mx-auto px-4 py-8">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify/:token" element={<VerifyEmail />} />
                <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                <Route path="/quiz/:id" element={<PrivateRoute><QuizAttempt /></PrivateRoute>} />
                <Route path="/admin/quiz/create" element={<PrivateRoute><AdminCreateQuiz /></PrivateRoute>} />
                <Route path="/admin/quiz/:id/leaderboard" element={<PrivateRoute><AdminLeaderboard /></PrivateRoute>} />
                <Route path="*" element={<div className="text-center mt-20 text-2xl font-bold">404 - Not Found</div>} />
              </Routes>
            </main>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
