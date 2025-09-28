import React, { useState, useEffect } from 'react';
import { Login, Register, ForgotPassword } from '../../components/user';

const Auth = ({ onBackToHome, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot-password'

  // Check URL to determine initial auth mode
  useEffect(() => {
    const updateAuthMode = () => {
      const path = window.location.pathname;
      if (path === '/register') {
        setAuthMode('register');
      } else if (path === '/forgot-password') {
        setAuthMode('forgot-password');
      } else {
        setAuthMode('login');
      }
    };

    // Initial check
    updateAuthMode();

    // Listen for URL changes
    window.addEventListener('popstate', updateAuthMode);
    
    return () => {
      window.removeEventListener('popstate', updateAuthMode);
    };
  }, []);

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    // You can add more logic here like redirecting to dashboard
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };

  const handleRegisterSuccess = (userData) => {
    console.log('Register successful:', userData);
    // You can add more logic here if needed
  };

  const handleToggleToRegister = () => {
    window.history.pushState({}, '', '/register');
    setAuthMode('register');
  };

  const handleToggleToLogin = () => {
    window.history.pushState({}, '', '/login');
    setAuthMode('login');
  };

  const handleForgotPassword = () => {
    window.history.pushState({}, '', '/forgot-password');
    setAuthMode('forgot-password');
  };

  const renderAuthComponent = () => {
    switch (authMode) {
      case 'login':
        return (
          <Login 
            onToggleMode={handleToggleToRegister} 
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
        );
      case 'register':
        return (
          <Register 
            onToggleMode={handleToggleToLogin}
            onRegisterSuccess={handleRegisterSuccess}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword 
            onBackToLogin={handleToggleToLogin}
            onBackToHome={onBackToHome}
          />
        );
      default:
        return (
          <Login 
            onToggleMode={handleToggleToRegister} 
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={handleForgotPassword}
          />
        );
    }
  };

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center" style={{backgroundColor: '#f5f5f5'}}>
      {/* Back to Home Button */}
      <div className="position-absolute top-0 end-0 p-3">
        <button 
          className="btn btn-outline-secondary btn-sm"
          onClick={onBackToHome}
        >
          <i className="fas fa-home me-1"></i>
          Back to Home
        </button>
      </div>

      {/* Fixed Container */}
      <div style={{width: '450px', minHeight: '600px'}}>
        {renderAuthComponent()}
      </div>
    </div>
  );
};

export default Auth;