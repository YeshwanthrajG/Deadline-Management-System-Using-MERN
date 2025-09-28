import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Header = () => {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    navigate('/login');
  };

  const isOnDashboard = location.pathname === '/dashboard';

  return (
    <header className="bg-gradient-to-r from-blue-700 via-purple-700 to-indigo-800 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-6">
            <button
              onClick={() => navigate('/tasks')}
              className="text-2xl font-bold text-white flex items-center hover:text-gray-200 transition-colors duration-200"
            >
              <span className="mr-3 text-3xl">📋</span>
              TaskMaster Pro
            </button>
            
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-4">
              <button
                onClick={() => navigate('/tasks')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  !isOnDashboard 
                    ? 'bg-white bg-opacity-20 text-white shadow-md' 
                    : 'text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📝 Tasks
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isOnDashboard 
                    ? 'bg-white bg-opacity-20 text-white shadow-md' 
                    : 'text-white hover:text-gray-200 hover:bg-white hover:bg-opacity-10'
                }`}
              >
                📊 Dashboard
              </button>
            </nav>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:block text-white text-sm">
              Welcome, <span className="font-semibold">{user?.name}</span> ✨
            </div>
            
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center text-white hover:text-gray-200 transition-colors duration-200 p-2 hover:bg-white hover:bg-opacity-10 rounded-full"
              >
                <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl py-2 z-50 border border-gray-200">
                  <div className="px-4 py-3 text-sm text-gray-700 border-b border-gray-100 bg-gray-50">
                    <div className="font-semibold">{user?.name}</div>
                    <div className="text-gray-500">{user?.email}</div>
                  </div>
                  
                  <button
                    onClick={() => {
                      navigate('/dashboard');
                      setShowUserMenu(false);
                    }}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-800 transition-colors duration-200"
                  >
                    <span className="mr-3">📊</span>
                    My Progress
                  </button>
                  
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-red-50 hover:text-red-800 transition-colors duration-200"
                  >
                    <span className="mr-3">🚪</span>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
