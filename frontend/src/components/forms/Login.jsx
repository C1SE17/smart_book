import React, { useState } from 'react';
import { validateEmail } from '../../utils';

const Login = ({ onToggleMode, onLoginSuccess, onForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      console.log('Login successful:', formData);
      
      // Store user data if remember me is checked
      if (formData.rememberMe) {
        localStorage.setItem('userEmail', formData.email);
      }
      
      // Call success callback
      if (onLoginSuccess) {
        onLoginSuccess(formData);
      }
      
    } catch (error) {
      console.error('Login error:', error);
      setErrors({ general: 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="position-absolute top-0 start-0 p-3">
        <span className="text-muted small">Login</span>
      </div>

      {/* Login Card */}
      <div className="card shadow-lg border-0" style={{width: '100%', minHeight: '600px', borderRadius: '10px'}}>
        <div className="card-body p-5">
          {/* Main Heading */}
          <h2 className="text-center mb-4 fw-bold" style={{fontFamily: 'serif'}}>Login</h2>
          
          {/* Divider Line */}
          <hr className="text-muted mb-4" style={{opacity: 0.3}} />

          {/* General Error Message */}
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-3">
              <label htmlFor="email" className="form-label text-dark fw-medium">
                Email <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.email ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.email && (
                <div className="invalid-feedback">
                  {errors.email}
                </div>
              )}
            </div>

            {/* Password Field */}
            <div className="mb-3">
              <label htmlFor="password" className="form-label text-dark fw-medium">
                Password <span className="text-danger">*</span>
              </label>
              <div className="position-relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: errors.password ? '1px solid #dc3545' : '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '12px 45px 12px 16px'
                  }}
                />
                <button
                  type="button"
                  className="btn btn-link position-absolute end-0 top-50 translate-middle-y me-2"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    border: 'none',
                    background: 'none',
                    color: '#6c757d',
                    padding: '0',
                    fontSize: '14px'
                  }}
                >
                  <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                </button>
              </div>
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Remember Me & Lost Password */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                <label className="form-check-label text-dark" htmlFor="rememberMe">
                  Remember me
                </label>
              </div>
              <button 
                type="button"
                onClick={onForgotPassword}
                className="btn btn-link text-danger text-decoration-none p-0 small"
                style={{border: 'none', background: 'none'}}
              >
                Lost your password?
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn w-100 text-white fw-medium"
              disabled={loading}
              style={{
                backgroundColor: loading ? '#6c757d' : '#000',
                border: 'none',
                borderRadius: '8px',
                padding: '12px',
                fontSize: '16px',
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Log in'
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="text-center my-4">
            <span className="text-muted small">or</span>
          </div>

          {/* Social Login */}
          <div className="d-grid gap-2 mb-4">
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #e9ecef'
              }}
            >
              <i className="bi bi-google me-2"></i>
              Continue with Google
            </button>
            <button
              type="button"
              className="btn btn-outline-secondary"
              style={{
                borderRadius: '8px',
                padding: '12px',
                fontSize: '14px',
                border: '1px solid #e9ecef'
              }}
            >
              <i className="bi bi-facebook me-2"></i>
              Continue with Facebook
            </button>
          </div>

          {/* Additional Options */}
          <div className="text-center">
            <p className="text-muted small mb-0">
              Don't have an account? 
              <button 
                type="button"
                onClick={onToggleMode}
                className="btn btn-link text-primary text-decoration-none p-0 ms-1 fw-medium"
                style={{border: 'none', background: 'none'}}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
