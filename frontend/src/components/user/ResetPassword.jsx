import React, { useState, useEffect } from 'react';
import { passwordResetApi } from '../../services/passwordResetApi';

const ResetPassword = ({ email, onBackToLogin, onSuccess }) => {
  const [step, setStep] = useState('code'); // 'code' or 'password'
  const [formData, setFormData] = useState({
    code: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [resetToken, setResetToken] = useState(null);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

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

  const validateCodeForm = () => {
    const newErrors = {};
    if (!formData.code) {
      newErrors.code = 'Verification code is required';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'Verification code must be 6 digits';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePasswordForm = () => {
    const newErrors = {};
    if (!formData.newPassword) {
      newErrors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = 'Password must be at least 6 characters';
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
  
    if (!validateCodeForm()) return;
  
    setLoading(true);
    try {
      const res = await passwordResetApi.verifyResetCode(email, formData.code);
  
      console.log("Verify response:", res);
      console.log("Debug code (nếu backend trả):", res?.debugCode);
  
      setResetToken(res.resetToken);
      setStep("password");
    } catch (err) {
      console.log("Verify code error:", err);
      setErrors({ general: err.message });
    } finally {
      setLoading(false);
    }
  };
  

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!validatePasswordForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await passwordResetApi.resetPassword(email, formData.newPassword, resetToken);
      console.log('Reset password response:', response);

      if (onSuccess) {
        onSuccess(response.message);
      }

    } catch (error) {
      console.error('Reset password error:', error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    try {
      const response = await passwordResetApi.sendResetEmail(email);
  
      console.log("=== RESEND CODE RESPONSE ===", response);
  
      const newCode =
        response?.debugCode ||
        response?.data?.debugCode ||
        response?.code ||
        null;
  
      if (newCode) {
        console.log("NEW VERIFICATION CODE:", newCode);
      } else {
        console.log("Không tìm thấy debugCode trong response:", response);
      }
  
      setTimeLeft(15 * 60);
      setErrors({});
    } catch (error) {
      console.log("Resend code error:", error);
      setErrors({ general: error.message });
    } finally {
      setLoading(false);
    }
  };
  

  if (step === 'code') {
    return (
      <div>
        {/* Page Title */}
        <div className="position-absolute top-0 start-0 p-3">
          <span className="text-muted small">Verify Code</span>
        </div>

        {/* Verify Code Card */}
        <div className="card shadow-lg border-0" style={{ width: '100%', minHeight: '600px', borderRadius: '10px' }}>
          <div className="card-body p-5">
            {/* Main Heading */}
            <h2 className="text-center mb-4 fw-bold" style={{ fontFamily: 'serif' }}>Verify Code</h2>

            {/* Divider Line */}
            <hr className="text-muted mb-4" style={{ opacity: 0.3 }} />

            {/* Description */}
            <p className="text-muted text-center mb-4">
              We sent a 6-digit verification code to <strong>{email}</strong>
            </p>

            {/* Timer */}
            <div className="text-center mb-4">
              <span className={`badge ${timeLeft > 0 ? 'bg-warning' : 'bg-danger'}`}>
                {timeLeft > 0 ? `Time left: ${formatTime(timeLeft)}` : 'Expired'}
              </span>
            </div>

            {/* General Error Message */}
            {errors.general && (
              <div className="alert alert-danger" role="alert">
                <i className="bi bi-exclamation-triangle me-2"></i>
                {errors.general}
              </div>
            )}

            {/* Verify Code Form */}
            <form onSubmit={handleVerifyCode}>
              {/* Code Field */}
              <div className="mb-4">
                <label htmlFor="code" className="form-label text-dark fw-medium">
                  Verification Code <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className={`form-control text-center ${errors.code ? 'is-invalid' : ''}`}
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  placeholder="Enter 6 digits"
                  maxLength="6"
                  style={{
                    backgroundColor: '#f8f9fa',
                    border: errors.code ? '1px solid #dc3545' : '1px solid #e9ecef',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    fontSize: '18px',
                    letterSpacing: '2px'
                  }}
                />
                {errors.code && (
                  <div className="invalid-feedback">
                    {errors.code}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-100 text-white fw-medium mb-3"
                disabled={loading || timeLeft <= 0}
                style={{
                  backgroundColor: loading || timeLeft <= 0 ? '#6c757d' : '#000',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px',
                  fontSize: '16px'
                }}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Verifying...
                  </>
                ) : (
                  'Verify Code'
                )}
              </button>
            </form>

            {/* Resend Code */}
            <div className="text-center">
              <p className="text-muted small mb-2">
                Didn't receive the code?
              </p>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="btn btn-link text-primary text-decoration-none p-0 fw-medium"
                style={{ border: 'none', background: 'none' }}
              >
                Resend Code
              </button>
            </div>

            {/* Back to Login */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={onBackToLogin}
                className="btn btn-link text-secondary text-decoration-none p-0 fw-medium"
                style={{ border: 'none', background: 'none' }}
              >
                ← Back to Login
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
        <span className="text-muted small">Reset Password</span>
      </div>

      {/* Reset Password Card */}
      <div className="card shadow-lg border-0" style={{ width: '100%', minHeight: '600px', borderRadius: '10px' }}>
        <div className="card-body p-5">
          {/* Main Heading */}
          <h2 className="text-center mb-4 fw-bold" style={{ fontFamily: 'serif' }}>Reset Password</h2>

          {/* Divider Line */}
          <hr className="text-muted mb-4" style={{ opacity: 0.3 }} />

          {/* Description */}
          <p className="text-muted text-center mb-4">
            Enter a new password for <strong>{email}</strong>
          </p>

          {/* General Error Message */}
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          {/* Reset Password Form */}
          <form onSubmit={handleResetPassword}>
            {/* New Password Field */}
            <div className="mb-3">
              <label htmlFor="newPassword" className="form-label text-dark fw-medium">
                New Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.newPassword ? 'is-invalid' : ''}`}
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleChange}
                placeholder="Enter your new password"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.newPassword ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.newPassword && (
                <div className="invalid-feedback">
                  {errors.newPassword}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label htmlFor="confirmPassword" className="form-label text-dark fw-medium">
                Confirm Password <span className="text-danger">*</span>
              </label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your new password"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.confirmPassword ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">
                  {errors.confirmPassword}
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
                fontSize: '16px'
              }}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Updating...
                </>
              ) : (
                'Update Password'
              )}
            </button>
          </form>

          {/* Back to Login */}
          <div className="text-center">
              <button
                type="button"
                onClick={onBackToLogin}
                className="btn btn-link text-secondary text-decoration-none p-0 fw-medium"
                style={{ border: 'none', background: 'none' }}
              >
                ← Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
