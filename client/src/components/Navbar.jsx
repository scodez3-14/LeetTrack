import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = ({ isLoggedIn, onLogout }) => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full sticky top-0 z-50 bg-gradient-to-r from-blue-100 via-purple-50 to-indigo-100/70 backdrop-blur-md shadow-lg border-b border-indigo-200">
      <div className="w-full px-6">
        {/* Flex container: logo left, links right */}
        <div className="flex items-center justify-between h-16 w-full">
          
          {/* Logo LEFT */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-500 to-purple-400 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">LT</span>
            </div>
            <span className="text-2xl font-bold text-indigo-700 tracking-tight">LeetTrack</span>
          </Link>

          {/* Navigation Links RIGHT */}
          <div className="flex items-center space-x-2">
            <Link
              to="/"
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                isActive('/')
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-indigo-700 hover:bg-indigo-100'
              }`}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/dashboard"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/dashboard')
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={onLogout}
                  className="px-4 py-2 rounded-lg font-medium bg-red-500 text-white hover:bg-red-600 shadow transition-colors duration-200 ml-1"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/login')
                      ? 'bg-indigo-600 text-white shadow'
                      : 'text-indigo-700 hover:bg-indigo-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 ${
                    isActive('/signup')
                      ? 'bg-green-500 text-white shadow'
                      : 'text-indigo-700 hover:bg-green-100'
                  }`}
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;