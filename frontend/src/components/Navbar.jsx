import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { Moon, Sun, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-surface-light dark:bg-surface-dark shadow-sm border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2 text-2xl font-black tracking-tighter">
          <Layers className="text-accent-light dark:text-accent-dark" size={32} />
          <span>Quizeesphere</span>
        </Link>

        <div className="flex items-center space-x-6">
          <button onClick={toggleTheme} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors" aria-label="Toggle Theme">
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="flex items-center space-x-1 hover:text-secondary-light dark:hover:text-secondary-dark transition-colors">
                <LayoutDashboard size={20} />
                <span className="hidden md:inline">Dashboard</span>
              </Link>
              <div className="flex items-center space-x-1 text-sm font-medium bg-gray-100 dark:bg-gray-800 py-1 px-3 rounded-full">
                <User size={16} />
                <span>{user.name}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center space-x-1 text-red-600 hover:text-red-700 transition-colors" aria-label="Logout">
                <LogOut size={20} />
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="font-medium hover:text-secondary-light dark:hover:text-secondary-dark transition-colors">
                Login
              </Link>
              <Link to="/register" className="bg-accent-light dark:bg-accent-dark text-white dark:text-black px-4 py-2 rounded-md font-medium hover:opacity-90 transition-opacity">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
