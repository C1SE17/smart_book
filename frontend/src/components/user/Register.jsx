import React, { useState } from 'react';
import { validateEmail } from '../../utils';
import { userService } from '../../services';

const Register = ({ onToggleMode, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

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

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Họ tên là bắt buộc';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Họ tên phải có ít nhất 2 ký tự';
    }

    if (!formData.email) {
      newErrors.email = 'Email là bắt buộc';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }

    if (!formData.password) {
      newErrors.password = 'Mật khẩu là bắt buộc';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Vui lòng xác nhận mật khẩu';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'Bạn phải đồng ý với điều khoản và điều kiện';
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
      // Gọi API backend để đăng ký
      const response = await userService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: '',
        address: '',
        role: 'customer'
      });
      
      console.log('Đăng ký thành công:', response);
      
      // Hiển thị thông báo thành công
      setErrors({ success: 'Đăng ký thành công! Vui lòng đăng nhập với thông tin của bạn.' });
      
      // Gọi callback thành công nếu có
      if (onRegisterSuccess) {
        onRegisterSuccess(response);
      }
      
      // Tự động chuyển sang login sau 2 giây
      setTimeout(() => {
        if (onToggleMode) {
          onToggleMode();
        }
      }, 2000);
      
    } catch (error) {
      console.error('Lỗi đăng ký:', error);
      setErrors({ general: 'Đăng ký thất bại. Vui lòng thử lại.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* Page Title */}
      <div className="position-absolute top-0 start-0 p-3">
        <span className="text-muted small">Register</span>
      </div>

      {/* Register Card */}
      <div className="card shadow-lg border-0" style={{width: '100%', minHeight: '600px', borderRadius: '10px'}}>
        <div className="card-body p-5">
          {/* Main Heading */}
          <h2 className="text-center mb-4 fw-bold" style={{fontFamily: 'serif'}}>Register</h2>
          
          {/* Divider Line */}
          <hr className="text-muted mb-4" style={{opacity: 0.3}} />

          {/* Success Message */}
          {errors.success && (
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle me-2"></i>
              {errors.success}
            </div>
          )}

          {/* General Error Message */}
          {errors.general && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle me-2"></i>
              {errors.general}
            </div>
          )}

          {/* Register Form */}
          <form onSubmit={handleSubmit}>
            {/* Full Name Field */}
            <div className="mb-3">
              <label htmlFor="fullName" className="form-label text-dark fw-medium">
                Họ và tên <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Nhập họ và tên của bạn"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.fullName ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.fullName && (
                <div className="invalid-feedback">
                  {errors.fullName}
                </div>
              )}
            </div>

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
                placeholder="Nhập email của bạn"
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
              <input
                type="password"
                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Nhập mật khẩu của bạn"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.password ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.password && (
                <div className="invalid-feedback">
                  {errors.password}
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-3">
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
                placeholder="Xác nhận mật khẩu của bạn"
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

            {/* Terms Agreement */}
            <div className="form-check mb-4">
              <input
                className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                type="checkbox"
                id="agreeTerms"
                name="agreeTerms"
                checked={formData.agreeTerms}
                onChange={handleChange}
              />
              <label className="form-check-label text-dark" htmlFor="agreeTerms">
                Tôi đồng ý với <a href="#" className="text-primary text-decoration-none">Điều khoản và Điều kiện</a>
              </label>
              {errors.agreeTerms && (
                <div className="invalid-feedback d-block">
                  {errors.agreeTerms}
                </div>
              )}
            </div>

            {/* Register Button */}
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
                  Đang đăng ký...
                </>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Đã có tài khoản? 
              <button 
                type="button"
                onClick={onToggleMode}
                className="btn btn-link text-primary text-decoration-none p-0 ms-1"
                style={{border: 'none', background: 'none'}}
              >
                Đăng nhập
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
