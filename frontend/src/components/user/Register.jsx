import React, { useState } from 'react';
import { validateEmail } from '../../utils';
import apiService from '../../services';

const Register = ({ onToggleMode, onRegisterSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    let filteredValue = value;

    // Chặn ký tự không hợp lệ khi nhập
    if (name === 'phone') {
      // Chỉ cho phép số
      filteredValue = value.replace(/[^0-9]/g, '');
    }

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : filteredValue
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

    // Validation cho tên
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full name must be at least 2 characters';
    } else {
      // Kiểm tra tên không có ký tự đặc biệt hoặc số
      const nameRegex = /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ\s]+$/;
      if (!nameRegex.test(formData.fullName.trim())) {
        newErrors.fullName = 'Full name cannot contain special characters or numbers';
      }
    }

    // Validation cho email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    // Validation cho số điện thoại
    if (formData.phone) {
      // Kiểm tra chỉ có số
      const phoneNumbersOnly = /^[0-9]+$/.test(formData.phone);
      if (!phoneNumbersOnly) {
        newErrors.phone = 'Phone number can only contain digits';
      } else if (formData.phone.length < 10) {
        newErrors.phone = 'Phone number must have at least 10 digits';
      }
    }

    // Validation cho địa chỉ
    if (formData.address) {
      const trimmedAddress = formData.address.trim();
      if (trimmedAddress.length < 3) {
        newErrors.address = 'Address must be at least 3 characters';
      } else {
        // Kiểm tra địa chỉ hợp lệ: phải có ít nhất một ký tự chữ cái
        const hasValidChars = /[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵýỷỹ]/.test(trimmedAddress);
        if (!hasValidChars) {
          newErrors.address = 'Invalid address format';
        }
      }
    }

    // Validation cho password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the terms and conditions';
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
      // Clear any cached data before registering
      console.log('Clearing localStorage cache...');
      localStorage.removeItem('user');
      localStorage.removeItem('userToken');
      
      // Gọi real API để đăng ký
      const response = await apiService.register({
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || '',
        address: formData.address || ''
      });
      
      console.log('Registration response:', response);
      
      // Kiểm tra response thành công
      if (!response.success) {
        throw new Error(response.message || response.error || 'Registration failed');
      }
      
      console.log('Registration successful:', response);
      
      // Hiển thị thông báo thành công
      setErrors({ success: 'Registration successful! Please log in with your credentials.' });
      
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
      console.error('Registration error:', error);
      // Xử lý thông báo lỗi cụ thể
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.message) {
        if (error.message.includes('Email đã tồn tại') || error.message.includes('already exists')) {
          errorMessage = 'This email is already registered. Please use a different email or try logging in.';
        } else if (error.message.includes('Email phải là @gmail.com')) {
          errorMessage = 'Email must be a Gmail address (@gmail.com).';
        } else if (error.message.includes('Thiếu tên, email hoặc mật khẩu')) {
          errorMessage = 'Please fill in all required fields.';
        } else {
          errorMessage = error.message;
        }
      }
      
      setErrors({ general: errorMessage });
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
                Full Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
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

            {/* Phone Field */}
            <div className="mb-3">
              <label htmlFor="phone" className="form-label text-dark fw-medium">
                Phone Number
              </label>
              <input
                type="tel"
                className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your phone number"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.phone ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              />
              {errors.phone && (
                <div className="invalid-feedback">
                  {errors.phone}
                </div>
              )}
            </div>

            {/* Address Field */}
            <div className="mb-3">
              <label htmlFor="address" className="form-label text-dark fw-medium">
                Address
              </label>
              <textarea
                className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                id="address"
                name="address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter your address"
                style={{
                  backgroundColor: '#f8f9fa',
                  border: errors.address ? '1px solid #dc3545' : '1px solid #e9ecef',
                  borderRadius: '8px',
                  padding: '12px 16px'
                }}
              ></textarea>
              {errors.address && (
                <div className="invalid-feedback">
                  {errors.address}
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
                placeholder="Enter your password"
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
                placeholder="Confirm your password"
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
                I agree to the <a href="#" className="text-primary text-decoration-none">Terms and Conditions</a>
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
                  Signing up...
                </>
              ) : (
                'Sign up'
              )}
            </button>
          </form>

          {/* Additional Options */}
          <div className="text-center mt-4">
            <p className="text-muted small mb-0">
              Already have an account? 
              <button 
                type="button"
                onClick={onToggleMode}
                className="btn btn-link text-primary text-decoration-none p-0 ms-1"
                style={{border: 'none', background: 'none'}}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
