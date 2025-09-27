import React, { useState } from 'react';
import { validateEmail } from '../../utils';

const ForgotPassword = ({ onBackToLogin, onBackToHome }) => {
  const [formData, setFormData] = useState({
    email: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
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
      
      console.log('Password reset request sent to:', formData.email);
      setSuccess(true);
      
    } catch (error) {
      console.error('Password reset error:', error);
      setErrors({ general: 'Failed to send reset email. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div>
        {/* Page Title */}
        <div className="position-absolute top-0 start-0 p-3">
          <span className="text-muted small">Forgot Password</span>
        </div>

        {/* Success Card */}
        <div className="card shadow-lg border-0" style={{width: '100%', minHeight: '600px', borderRadius: '10px'}}>
          <div className="card-body p-5 d-flex flex-column justify-content-center align-items-center text-center">
            {/* Success Icon */}
            <div className="mb-4">
              <div 
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto"
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#d4edda',
                  color: '#155724'
                }}
              >
                <i className="bi bi-check-circle-fill" style={{fontSize: '2.5rem'}}></i>
              </div>
            </div>

            {/* Success Message */}
            <h3 className="fw-bold text-dark mb-3">Check Your Email</h3>
            <p className="text-muted mb-4">
              We've sent a password reset link to <strong>{formData.email}</strong>
            </p>
            <p className="text-muted small mb-4">
              Please check your email and click the link to reset your password. 
              If you don't see the email, check your spam folder.
            </p>

            {/* Action Buttons */}
            <div className="d-grid gap-2 w-100">
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => setSuccess(false)}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              >
                Send Another Email
              </button>
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={onBackToLogin}
                style={{
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              >
                Back to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Title */}
      <div className="position-absolute top-0 start-0 p-3">
        <span className="text-muted small">Forgot Password</span>
      </div>

      {/* Forgot Password Card */}
      <div className="card shadow-lg border-0" style={{width: '100%', minHeight: '600px', borderRadius: '10px'}}>
        <div className="card-body p-5">
          {/* Main Heading */}
          <h2 className="text-center mb-4 fw-bold" style={{fontFamily: 'serif'}}>Forgot Password</h2>
          
          {/* Divider Line */}
          <hr className="text-muted mb-4" style={{opacity: 0.3}} />

          {/* Description */}
          <p className="text-muted text-center mb-4">
            Enter your email address and we'll send you a link to reset your password.
          </p>

          {/* General Error Message */}
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          {/* Forgot Password Form */}
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label htmlFor="email" className="form-label text-dark fw-medium">
                Email Address <span className="text-danger">*</span>
              </label>
              <input
                type="email"
                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
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

            {/* Submit Button */}
            <button
              type="submit"
              className="btn w-100 text-white fw-medium mb-4"
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
                  Sending...
                </>
              ) : (
                'Send Reset Link'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center">
            <p className="text-muted small mb-0">
              Remember your password? 
              <button 
                type="button"
                onClick={onBackToLogin}
                className="btn btn-link text-primary text-decoration-none p-0 ms-1 fw-medium"
                style={{border: 'none', background: 'none'}}
              >
                Back to Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
