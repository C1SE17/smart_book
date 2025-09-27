import React, { useState } from 'react';
import { Login, Register, ForgotPassword } from '../../components/forms';

const Auth = ({ onBackToHome, onLoginSuccess }) => {
  const [authMode, setAuthMode] = useState('login'); // 'login', 'register', 'forgot-password'

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);
    // You can add more logic here like redirecting to dashboard
    if (onLoginSuccess) {
      onLoginSuccess(userData);
    }
  };

  const renderAuthComponent = () => {
    switch (authMode) {
      case 'login':
        return (
          <Login 
            onToggleMode={() => setAuthMode('register')} 
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => setAuthMode('forgot-password')}
          />
        );
      case 'register':
        return (
          <Register 
            onToggleMode={() => setAuthMode('login')}
          />
        );
      case 'forgot-password':
        return (
          <ForgotPassword 
            onBackToLogin={() => setAuthMode('login')}
            onBackToHome={onBackToHome}
          />
        );
      default:
        return (
          <Login 
            onToggleMode={() => setAuthMode('register')} 
            onLoginSuccess={handleLoginSuccess}
            onForgotPassword={() => setAuthMode('forgot-password')}
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
          <i className="bi bi-house me-1"></i>
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