import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate,useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import CompanyPage from './pages/CompanyPage';
import Login from './pages/Login'; // You'll need to create this
import Signup from './pages/Signup'; // You'll need to create this
import './index.css';

// Layout component with conditional navigation
const Layout = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check authentication status
    const checkAuth = () => {
      const token = localStorage.getItem('authToken');
      setIsLoggedIn(!!token);
    };
    
    checkAuth();
    // Listen for storage events (for when another tab logs in/out)
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsLoggedIn(false);
    navigate('/');
  };
  
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
      {children}
    </>
  );
};

// Protected route component
const ProtectedRoute = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('authToken');
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/login" element={<Layout><Login /></Layout>} />
        <Route path="/signup" element={<Layout><Signup /></Layout>} />
        <Route 
          path="/dashboard" 
          element={
            <Layout>
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            </Layout>
          } 
        />
        <Route 
          path="/company/:companyName" 
          element={
            <Layout>
              <ProtectedRoute>
                <CompanyPage />
              </ProtectedRoute>
            </Layout>
          } 
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);